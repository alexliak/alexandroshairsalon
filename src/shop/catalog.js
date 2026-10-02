import data from '../data/shop/catalog.json';
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
      p.short.el, ...p.variants.map((v) => `${v.label} ${v.ean}`)].join(' ')
  );
  return { ...p, minPrice, maxPrice, priced: minPrice !== null, inStock, haystack };
};

export const PRODUCTS = data.products.map(enrich).filter((p) => CATALOG_MODE || SHOW_UNPRICED || p.priced);
export const productById = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
export const LINES = [...new Set(PRODUCTS.map((p) => p.line))].sort((a, b) => a.localeCompare(b));

export const t = (obj, lang) => (obj ? obj[lang] || obj.el || '' : '');

export const money = (n, lang = 'el') =>
  typeof n === 'number'
    ? new Intl.NumberFormat(lang === 'en' ? 'en-IE' : 'el-GR', { style: 'currency', currency: 'EUR' }).format(n)
    : '';

export const imageSrc = (img, size = 400) => (img ? `/images/shop/${img}-${size}.webp` : null);

export const productUrl = (p) => `/shop/p/${p.id}`;
