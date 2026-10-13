// Light list of every product (names, sizes, EAN, photos, filters). The long texts of each
// product are not here: they are built into that product's own page (src/pages/shop/p/[id].js).
import data from '../data/shop/index.json';
import { CATALOG_MODE, SHOW_UNPRICED } from './config';

const byKey = (list) => Object.fromEntries(list.map((x) => [x.key, x]));

export const BRANDS = data.brands;
export const CATEGORIES = data.categories;
export const TYPES = data.types;
export const NEEDS = data.needs;
export const HAIR_TYPES = data.hairTypes;
export const LINE_INFO = data.lines || {};
export const LINE_IMAGES = data.lineImages || {};

export const typeByKey = byKey(TYPES);
export const needByKey = byKey(NEEDS);
export const hairByKey = byKey(HAIR_TYPES);
export const catByKey = byKey(CATEGORIES);
export const brandByKey = byKey(BRANDS);

// Greek-friendly search: lower case, no accents, final sigma
export const norm = (s) =>
  (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/ς/g, 'σ');

// Ποσότητα για την τιμή ανά μονάδα (υποχρεωτική στη λιανική: €/λίτρο ή €/κιλό).
// '300ml' -> 0.3 l, '10x6ml' -> 0.06 l, '7g' -> 0.007 kg. Kit/σετ: χωρίς τιμή ανά μονάδα.
export const quantity = (size) => {
  const t = (size || '').toLowerCase().replace(',', '.');
  let m = t.match(/(\d+)\s*x\s*(\d+(?:\.\d+)?)\s*ml/);
  if (m) return { qty: (m[1] * m[2]) / 1000, unit: 'l' };
  m = t.match(/(\d+(?:\.\d+)?)\s*ml\b/);
  if (m) return { qty: m[1] / 1000, unit: 'l' };
  m = t.match(/(\d+(?:\.\d+)?)\s*l\b/);
  if (m) return { qty: +m[1], unit: 'l' };
  m = t.match(/(\d+(?:\.\d+)?)\s*(?:g|gr)\b/);
  if (m) return { qty: m[1] / 1000, unit: 'kg' };
  return null;
};

export const unitPrice = (v) => {
  const q = quantity(v.size || v.label);
  return q && typeof v.price === 'number' ? { value: v.price / q.qty, unit: q.unit } : null;
};

// «Προτεινόμενα»: πρώτα οι βασικές σειρές και τα βασικά βήματα ρουτίνας (σαμπουάν, μάσκα…).
const LINE_RANK = ['Absolut Repair Molecular', 'Metal Detox', 'Vitamino Color Spectrum', 'Keratin Alpha Sleek', 'Vitamino Color',
  'Absolut Repair', 'Pro Longer', 'Curl Expression', 'Scalp Advanced', 'Silver', 'Tecni.Art', 'Infinium', 'Steampod'];
const TYPE_RANK = ['shampoo', 'mask', 'conditioner', 'leave-in', 'serum', 'oil', 'treatment', 'pre-shampoo', 'ampoules', 'set',
  'styling', 'hairspray', 'root-spray', 'pomade', 'hair-tool', 'accessory'];
const rankOf = (list, x) => { const i = list.indexOf(x); return i < 0 ? list.length : i; };

// «Νεότερα»: τα νεότερα EAN της L'Oréal (3474637…) είναι μεγαλύτεροι αριθμοί. Οι παλιοί εσωτερικοί κωδικοί (000…) μετρούν ως παλιά.
const newness = (p) => Math.max(0, ...p.variants.map((v) => (/^347463/.test(v.ean || '') ? Number(v.ean) - 3474630000000 : 0)));

const enrich = (raw) => {
  const p = CATALOG_MODE
    ? { ...raw, variants: raw.variants.map((v) => ({ ...v, price: null, compareAt: null })) }
    : raw;
  const prices = p.variants.map((v) => v.price).filter((x) => typeof x === 'number');
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const inStock = p.variants.some((v) => v.stock === null || v.stock === undefined || v.stock > 0);
  const haystack = norm(
    [p.brand, p.line, p.name.el, p.name.en, typeByKey[p.type]?.el, typeByKey[p.type]?.en,
      ...p.needs.map((n) => needByKey[n]?.el), ...p.hairTypes.map((h) => hairByKey[h]?.el),
      p.kw, ...p.variants.map((v) => `${v.label} ${v.ean}`)].join(' ')
  );
  const units = p.variants.map(unitPrice).filter(Boolean);
  const minUnit = units.length ? units.reduce((a, b) => (b.value < a.value ? b : a)) : null;
  const featuredRank = rankOf(LINE_RANK, p.line) * 100 + rankOf(TYPE_RANK, p.type);
  return { ...p, minPrice, maxPrice, priced: minPrice !== null, inStock, haystack, minUnit, featuredRank, newness: newness(p) };
};

export const PRODUCTS = data.products.map(enrich).filter((p) => CATALOG_MODE || SHOW_UNPRICED || p.priced);
export const productById = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
export const LINES = [...new Set(PRODUCTS.map((p) => p.line))].sort((a, b) => a.localeCompare(b));

export const t = (obj, lang) => (obj ? obj[lang] || obj.el || '' : '');

export const unitLabel = (u, lang) => (u ? `${money(u.value, lang)}/${u.unit === 'kg' ? (lang === 'en' ? 'kg' : 'κιλό') : (lang === 'en' ? 'litre' : 'λίτρο')}` : '');

export const money = (n, lang = 'el') =>
  typeof n === 'number'
    ? new Intl.NumberFormat(lang === 'en' ? 'en-IE' : 'el-GR', { style: 'currency', currency: 'EUR' }).format(n)
    : '';

export const imageSrc = (img, size = 400) => (img ? `/images/shop/${img}-${size}.webp` : null);

export const productUrl = (p) => `/shop/p/${p.id}`;

// Product page: the light entry plus its full texts (short, description, howTo, safety)
export const withDetail = (id, detail) => (productById[id] ? { ...productById[id], ...detail } : null);
