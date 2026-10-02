#!/usr/bin/env python3
"""
Χτίζει τον κατάλογο του e-shop: src/data/shop/catalog.json

Πηγές (μία πηγή αλήθειας ανά πληροφορία):
  shop-data/loreal/LP_Assortment_Info.xlsx      -> περιγραφές L'Oréal (από τη L'Oréal)
  shop-data/loreal/PPD_Related_Products_2026.xlsx -> σχετικά προϊόντα + μεγέθη
  shop-data/other-brands.json                    -> Evoque, Gotstyle και κάθε άλλη εταιρεία
  shop-data/prices.csv                           -> ΤΙΜΕΣ, απόθεμα, ενεργό/ανενεργό (το συμπληρώνεις εσύ)
  shop-data/images.json                          -> ποια εικόνα πάει σε ποια σειρά/προϊόν

Τρέξιμο:  python3 scripts/shop/build_catalog.py
Αν το prices.csv δεν έχει μια γραμμή για ένα EAN, την προσθέτει κενή ώστε να βάλεις τιμή.
"""
import csv
import json
import re
import unicodedata
from collections import OrderedDict, defaultdict
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'shop-data'
OUT = ROOT / 'src' / 'data' / 'shop' / 'catalog.json'

# Επαγγελματικές σειρές (βαφές, οξυζενέ, ντεκαπάζ, περμανάντ): δεν πωλούνται στο κοινό.
PRO_ONLY_BRANDS = {'Inoa', 'Maji', 'Dia', 'G.Oxydants Eaux Oxy Add', 'Dulcia', 'Blond Studio'}
PRO_ONLY_EANS = {'3474630011595', '3474637067984'}  # Efassor, Sweet Mèches

LINE_NAMES = {
    'SE Absolut Repair Molecular': 'Absolut Repair Molecular',
    'SE Absolut Repair': 'Absolut Repair',
    'SE Metal Detox': 'Metal Detox',
    'SE Vitamino Color Spectrum': 'Vitamino Color Spectrum',
    'SE Vitamino Color': 'Vitamino Color',
    'SE Curl Expression': 'Curl Expression',
    'SE Pro Longer': 'Pro Longer',
    'SE Scalp': 'Scalp Advanced',
    'SE Silver': 'Silver',
    'SE Blondifier': 'Blondifier',
    'Keratin Alpha Sleek': 'Keratin Alpha Sleek',
    'Infinium Pure': 'Infinium',
    'Tecni Art Original': 'Tecni.Art',
    'Hair Touch Up': 'Hair Touch Up',
    'Steampod Outils': 'Steampod',
    'Steampod Produits': 'Steampod',
    'AirLight Pro': 'AirLight Pro',
}

# ── Τύπος προϊόντος ──────────────────────────────────────────────────────────
TYPES = OrderedDict([
    ('shampoo', ('Σαμπουάν', 'Shampoo', 'care')),
    ('conditioner', ('Conditioner', 'Conditioner', 'care')),
    ('mask', ('Μάσκα', 'Mask', 'care')),
    ('leave-in', ('Leave-in', 'Leave-in', 'care')),
    ('serum', ('Ορός', 'Serum', 'care')),
    ('oil', ('Λάδι μαλλιών', 'Hair oil', 'care')),
    ('treatment', ('Θεραπεία', 'Treatment', 'care')),
    ('pre-shampoo', ('Pre-shampoo', 'Pre-shampoo', 'care')),
    ('ampoules', ('Αμπούλες', 'Ampoules', 'care')),
    ('styling', ('Styling', 'Styling', 'styling')),
    ('hairspray', ('Λακ & σπρέι', 'Hairspray', 'styling')),
    ('pomade', ('Πομάδα & κερί', 'Pomade & wax', 'styling')),
    ('root-spray', ('Κάλυψη ρίζας', 'Root touch-up', 'color')),
    ('hair-tool', ('Πρέσες & σεσουάρ', 'Stylers & dryers', 'tools')),
    ('accessory', ('Αξεσουάρ', 'Accessories', 'tools')),
    ('set', ('Σετ & δώρα', 'Sets & gifts', 'sets')),
])

CATEGORIES = OrderedDict([
    ('care', ('Περιποίηση', 'Hair care')),
    ('styling', ('Styling', 'Styling')),
    ('tools', ('Εργαλεία', 'Tools')),
    ('color', ('Χρώμα στο σπίτι', 'Colour at home')),
    ('sets', ('Σετ & δώρα', 'Sets & gifts')),
])

NEEDS = OrderedDict([
    ('repair', ('Επανόρθωση & ενδυνάμωση', 'Repair & strength')),
    ('hydration', ('Ενυδάτωση & θρέψη', 'Hydration & nutrition')),
    ('color', ('Προστασία χρώματος', 'Colour protection')),
    ('blonde', ('Ξανθά & γκρι, κατά του κιτρινίσματος', 'Blonde & grey, anti-brass')),
    ('smooth', ('Λείανση & anti-frizz', 'Smoothing & anti-frizz')),
    ('curls', ('Μπούκλες', 'Curls')),
    ('volume', ('Όγκος & πύκνωση', 'Volume & density')),
    ('hairloss', ('Κατά της τριχόπτωσης', 'Hair loss')),
    ('scalp', ('Τριχωτό κεφαλής', 'Scalp care')),
    ('length', ('Μακριά μαλλιά & ψαλίδα', 'Long hair & split ends')),
    ('heat', ('Θερμοπροστασία', 'Heat protection')),
    ('shine', ('Λάμψη', 'Shine')),
    ('hold', ('Κράτημα & styling', 'Hold & styling')),
    ('metals', ('Αποτοξίνωση από μέταλλα', 'Metal detox')),
])

EFFECT_TO_NEED = {
    'επανόρθωση': 'repair', 'αναδόμηση': 'repair', 'ενδυνάμωση': 'repair', 'κατά του σπασίματος': 'repair',
    'ενυδάτωση': 'hydration', 'θρέψη': 'hydration',
    'λάμψη': 'shine',
    'προστασία χρώματος': 'color', 'ένταση χρώματος': 'color',
    'κατά των ανεπιθύμητων τόνων': 'blonde',
    'κατά του φριζαρίσματος': 'smooth', 'απαλοτήτα': 'smooth',
    'μπούκλες': 'curls', 'καλοσχηματισμένα': 'curls',
    'όγκος': 'volume', 'πύκνωση': 'volume', 'πυκνότητα': 'volume',
    'κατά της τριχόπτωσης': 'hairloss',
    'κατά της πιτυρίδας': 'scalp', 'καταπράυνση': 'scalp', 'κατά της λιπαρότητας': 'scalp',
    'θερμοπροστασία': 'heat',
    'κράτημα': 'hold',
}

LINE_NEEDS = {
    'Metal Detox': ['metals', 'repair', 'color'],
    'Vitamino Color': ['color'],
    'Vitamino Color Spectrum': ['color'],
    'Pro Longer': ['length'],
    'Silver': ['blonde'],
    'Blondifier': ['blonde'],
    'Curl Expression': ['curls', 'hydration'],
    'Keratin Alpha Sleek': ['smooth'],
    'Absolut Repair': ['repair'],
    'Absolut Repair Molecular': ['repair'],
    'Steampod': ['smooth', 'heat'],
    'Infinium': ['hold'],
    'Tecni.Art': ['hold'],
}

HAIR_TYPES = OrderedDict([
    ('all', ('Όλοι οι τύποι', 'All hair types')),
    ('damaged', ('Ταλαιπωρημένα', 'Damaged')),
    ('colored', ('Βαμμένα', 'Colour-treated')),
    ('blonde', ('Ξανθά & γκρι', 'Blonde & grey')),
    ('curly', ('Σγουρά', 'Curly')),
    ('frizzy', ('Φριζαρισμένα', 'Frizzy')),
    ('fine', ('Λεπτά & αραιωμένα', 'Fine & thinning')),
    ('oily', ('Λιπαρά', 'Oily')),
    ('sensitive', ('Ευαίσθητο τριχωτό', 'Sensitive scalp')),
    ('long', ('Μακριά', 'Long')),
])

HAIRTYPE_MAP = {
    'όλοι οι τύποι': 'all', 'ταλαιπωρημένα': 'damaged', 'φθαρμένα': 'damaged', 'εύθραυστα': 'damaged',
    'σπασμένες άκρες': 'damaged', 'βαμμένα': 'colored', 'ξανθά': 'blonde', 'σγουρά': 'curly',
    'φριζαρισμένα': 'frizzy', 'ατίθασα': 'frizzy', 'άφρο': 'curly', 'λιπαρά': 'oily',
    'αραίωση': 'fine', 'λεπτά': 'fine', 'ευαίσθητο τριχωτό': 'sensitive', 'πιτυρίδα': 'sensitive',
    'τριχόπτωση': 'fine', 'μακριά': 'long',
}

LINE_HAIRTYPES = {
    'Metal Detox': ['colored', 'damaged'], 'Vitamino Color': ['colored'], 'Vitamino Color Spectrum': ['colored'],
    'Pro Longer': ['long'], 'Silver': ['blonde'], 'Blondifier': ['blonde'], 'Curl Expression': ['curly'],
    'Keratin Alpha Sleek': ['frizzy'], 'Absolut Repair': ['damaged'], 'Absolut Repair Molecular': ['damaged'],
}


def clean(v):
    if v is None:
        return ''
    if isinstance(v, float) and pd.isna(v):
        return ''
    s = str(v).replace('\r', '').strip()
    return '' if s.lower() == 'nan' else s


def slugify(s):
    s = unicodedata.normalize('NFKD', s.lower())
    s = ''.join(c for c in s if not unicodedata.combining(c))
    s = s.translate(str.maketrans('αβγδεζηθικλμνξοπρστυφχψως', 'abgdezitiklmnxoprstyfxpos'))
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return re.sub(r'-+', '-', s)[:80]


# Κωδικοί L'Oréal που ξέρουμε από τιμολόγια: E4567xxx = Refill 1 λίτρου
SIZE_HINTS = {'E4567': '1000ml'}

SIZE_RE = re.compile(r'(\d+(?:[.,]\d+)?)\s*(ml|mL|ML|l|L|gr|g)\b|(\d+)\s*[x*]\s*(\d+)\s*ml', re.I)


def find_size(*texts):
    for t in texts:
        if not t:
            continue
        found = None
        for m in SIZE_RE.finditer(t):
            found = m  # keep the last size mentioned in the name
        if found:
            if found.group(3):
                return f'{found.group(3)}x{found.group(4)}ml'
            num, unit = found.group(1).replace(',', '.'), found.group(2).lower()
            if unit == 'l':
                return f'{int(float(num) * 1000)}ml'
            if unit == 'gr':
                unit = 'g'
            return f'{num}{unit}'
    return ''


def size_ml(size):
    m = re.match(r'(\d+)x(\d+)ml', size or '')
    if m:
        return int(m.group(1)) * int(m.group(2))
    m = re.match(r'(\d+(?:\.\d+)?)', size or '')
    return float(m.group(1)) if m else 0


def detect_type(name_el, name_en, dmi, line):
    # Το ελληνικό όνομα έχει προτεραιότητα· τα αγγλικά κείμενα αναφέρουν συχνά και άλλα προϊόντα
    first = _detect(name_el.lower(), dmi, line) if name_el.strip() else None
    if first:
        return first
    n = f'{name_el} {name_en}'.lower()
    if not re.sub(r"l[’']or[ée]al professionnel|serie expert|[\s,.]", '', n):
        n = dmi.lower()
    return _detect(n, dmi, line) or _fallback(n, dmi, line)


def _fallback(n, dmi, line):
    d = dmi.lower()
    if 'styling' in d or 'foam' in d or 'lotion' in d or line == 'Tecni.Art':
        return 'styling'
    if 'treatment' in d or 'cream' in d:
        return 'treatment'
    if 'spray' in n or 'σπρέι' in n:
        return 'leave-in'
    return 'treatment'


def _detect(n, dmi, line):
    if 'touch up' in n:
        return 'root-spray'
    if 'kit' in n or 'duo set' in n or 'set' == dmi.lower().split(' - ')[-1].lower():
        return 'set'
    if 'filters' in n or 'φίλτρων' in n or 'nozzle' in n or 'ακροφύσιο' in n:
        return 'accessory'
    if line in ('Steampod', 'AirLight Pro') and ('outil' in n or 'πρέσα' in n or 'σεσουάρ' in n or 'dryer' in n or 'styler' in n):
        return 'hair-tool'
    if 'λακ' in n or 'hairspray' in n or 'hair spray' in n:
        return 'hairspray'
    if 'leave-in' in n or 'leave in' in n:
        return 'leave-in'
    if 'pre-shampoo' in n or 'pre shampoo' in n:
        return 'pre-shampoo'
    if 'σαμπουάν' in n or 'shampoo' in n:
        return 'shampoo'
    if 'conditioner' in n:
        return 'conditioner'
    if 'μάσκα' in n or 'mask' in n:
        return 'mask'
    if 'αμπούλ' in n:
        return 'ampoules'
    if 'serum' in n or 'ορός' in n:
        return 'serum'
    if 'έλαιο' in n or ' oil' in n:
        return 'oil'
    return None


def split_list(s):
    return [x.strip().lower() for x in re.split(r'[,;]', s or '') if x.strip()]


def strip_size(name):
    name = re.sub(r'\s*\d+\s*[x*]\s*\d+\s*ml', '', name, flags=re.I)
    name = re.sub(r'\s*\d+(?:[.,]\d+)?\s*(ml|l|gr|g)\b\.?', '', name, flags=re.I)
    return re.sub(r'\s{2,}', ' ', name).strip(' ,-')


def family_key(name_el):
    k = unicodedata.normalize('NFKD', (name_el or '').lower())
    k = ''.join(c for c in k if not unicodedata.combining(c))
    k = re.sub(r"serie expert|l'oreal professionnel|refill|pouch", ' ', k)
    if 'infinium' in k:
        return 'infinium'
    k = re.split(r'\s(για|γι)\s', k)[0]
    return re.sub(r'\s+', ' ', k).strip()


def display_name(name):
    if re.match(r"^L[’']Oréal Professionnel x ", name or ''):
        return name
    name = re.sub(r'^(Serie Expert|L[’\']Oréal Professionnel)\s+', '', name or '').strip()
    return name[:1].upper() + name[1:]


def short_text(desc, limit=180):
    d = re.sub(r'\[[^\]]+\]', ' ', desc or '')
    d = re.sub(r'\*+[^.]*?(τεστ|test|δοκιμ)[^.]*\.', ' ', d, flags=re.I)
    d = re.sub(r'\s+', ' ', d).strip()
    if len(d) <= limit:
        return d
    cut = d[:limit]
    dot = cut.rfind('. ')
    return (cut[:dot + 1] if dot > 80 else cut.rsplit(' ', 1)[0] + '…')


def tidy_long(desc):
    """Κρατά τις παραγράφους, βγάζει διπλά κενά."""
    d = (desc or '').replace('\r', '')
    d = re.sub(r'\n{3,}', '\n\n', d)
    d = re.sub(r'[ \t]+', ' ', d)
    return d.strip()


def load_prices():
    path = DATA / 'prices.csv'
    rows = OrderedDict()
    if path.exists():
        with path.open(encoding='utf-8-sig') as f:
            for r in csv.DictReader(f):
                rows[r['ean'].strip()] = r
    return rows, path


def to_price(v):
    v = (v or '').strip().replace('€', '').replace(',', '.')
    try:
        return round(float(v), 2) if v else None
    except ValueError:
        return None


def main():
    df = pd.read_excel(DATA / 'loreal' / 'LP_Assortment_Info.xlsx', dtype={'EAN/UPC': str})
    ppd = pd.read_excel(DATA / 'loreal' / 'PPD_Related_Products_2026.xlsx', dtype=str)
    ppd_name = {clean(r['Barcode']): clean(r['Product Name']) for _, r in ppd.iterrows()}
    related_raw = {}
    for _, r in ppd.iterrows():
        rel = [clean(r[c]) for c in ppd.columns if c.startswith('Related Product') and not c.endswith('.1')]
        related_raw[clean(r['Barcode'])] = [x for x in rel if x]

    images = json.loads((DATA / 'images.json').read_text(encoding='utf-8')) if (DATA / 'images.json').exists() else {}
    prices, prices_path = load_prices()

    groups = OrderedDict()
    for _, r in df.iterrows():
        ean = clean(r['EAN/UPC'])
        brand = clean(r['Brand_Final'])
        if brand in PRO_ONLY_BRANDS or ean in PRO_ONLY_EANS:
            continue
        line = LINE_NAMES.get(clean(r['Sub_Brand_Final']), clean(r['Sub_Brand_Final']))
        name_el = clean(r['Product_Name_Long (el-GR)'])
        name_en_long = clean(r['Product_Name_Long (en-GB)'])
        dmi = clean(r['Product_type DMI'])
        pname = ppd_name.get(ean, '')
        size = (prices.get(ean, {}).get('size') or '').strip() or find_size(name_en_long, pname, name_el) \
            or find_size(clean(r['Product_Description_Long (el-GR)'])[:400]) or SIZE_HINTS.get(clean(r['Logistic_code'])[:5], '') \
            or ('300ml' if line == 'Infinium' else '')
        ptype = detect_type(name_el, name_en_long + ' ' + pname, dmi, line)
        refill = 'refill' in f'{name_el} {name_en_long} {pname}'.lower() or clean(r['Logistic_code'])[:5] in SIZE_HINTS
        base_el = strip_size(re.sub(r'\s*Refill\b', '', name_el, flags=re.I)) if name_el else ''
        base_el = re.sub(r"^L'Oréal Professionnel\s+", '', base_el)

        fam = 'touch-up' if ptype == 'root-spray' else (family_key(base_el) if base_el and not refill else '')
        key = (line, ptype, fam or f'__{ean}')
        g = groups.setdefault(key, {'rows': [], 'line': line, 'type': ptype})
        g['rows'].append({
            'ean': ean, 'size': size, 'refill': refill, 'r': r, 'name_el': base_el,
            'name_en_long': name_en_long, 'pname': pname,
        })

    # Τα Refill και όσα δεν έχουν ελληνικό όνομα μπαίνουν ως μέγεθος στο κύριο προϊόν της ίδιας σειράς/τύπου
    for key in [k for k in groups if k[2].startswith('__')]:
        line, ptype, _ = key
        mains = [k for k in groups if k[0] == line and k[1] == ptype and not k[2].startswith('__')]
        if mains:
            target = max(mains, key=lambda k: len(groups[k]['rows']))
            groups[target]['rows'].extend(groups.pop(key)['rows'])

    products = []
    ean_to_product = {}
    csv_rows = []
    for (line, ptype, _), g in groups.items():
        rows = g['rows']
        main = max(rows, key=lambda x: (bool(x['name_el']), len(clean(x['r']['Product_Description_Long (el-GR)']))))
        r = main['r']
        name_el = display_name(main['name_el'] or strip_size(main['pname'].replace('LP SE ', '').title()) or line)
        if ptype == 'root-spray':
            name_el = 'Hair Touch Up Σπρέι Κάλυψης Ριζών'
        if line == 'Infinium':
            name_el = 'Infinium Pure Λακ Μαλλιών'
        en_src = main['name_en_long'] or main['pname']
        name_en = en_src.split(',')[0] if en_src else name_el
        name_en = re.sub(r"^L[’']Or[ée]al Professionnel\s*,?\s*", '', name_en).strip()
        name_en = strip_size(name_en) or name_el
        if name_en.lower().startswith('l’oréal') or len(name_en) < 6 or name_en.isupper():
            name_en = name_el
        name_en = display_name(name_en)
        if ptype == 'root-spray':
            name_en = 'Hair Touch Up Root Concealer Spray'
        if line == 'Infinium':
            name_en = 'Infinium Pure Hairspray'
        if name_en.strip().lower() == line.lower():
            name_en = name_el

        effects = split_list(clean(r['Hair_effect']))
        needs = []
        for e in effects:
            n = EFFECT_TO_NEED.get(e)
            if n and n not in needs:
                needs.append(n)
        for n in LINE_NEEDS.get(line, []):
            if n not in needs:
                needs.append(n)

        hts = []
        for col in ('Hair_type', 'Hair_type.1'):
            for h in split_list(clean(r[col])):
                k = HAIRTYPE_MAP.get(h)
                if k and k not in hts:
                    hts.append(k)
        for h in LINE_HAIRTYPES.get(line, []):
            if h not in hts:
                hts.append(h)
        if len(hts) > 1 and 'all' in hts:
            hts.remove('all')
        if not hts:
            hts = ['all']

        variants = []
        for row in sorted(rows, key=lambda x: (x['refill'], size_ml(x['size']))):
            p = prices.get(row['ean'], {})
            label = row['size'] or ''
            if row['refill']:
                label = (label + ' Refill').strip()
            if ptype == 'hairspray' and line == 'Infinium':
                nm = (row['name_el'] + ' ' + row['pname']).lower()
                hold = 'Πολύ δυνατό κράτημα' if ('πολύ' in nm or 'extra' in nm) else 'Δυνατό κράτημα' if ('δυνατό' in nm or 'strong' in nm) else 'Απαλό κράτημα'
                label = f"{hold} · {row['size'] or '300ml'}"
            if ptype == 'root-spray':
                shade = re.search(r'Touch Up\s+(.*?)\s+Σπρέι', row['name_el'] or '')
                label = (shade.group(1) if shade else label) + (' · 75ml' if shade else '')
            variants.append({
                'sku': row['ean'], 'ean': row['ean'], 'label': label or 'Standard', 'size': row['size'],
                'price': to_price(p.get('price')), 'compareAt': to_price(p.get('compare_at')),
                'stock': int(p['stock']) if p.get('stock', '').strip().isdigit() else None,
                'active': (p.get('active', '1' if (row['size'] or ptype in ('hair-tool', 'accessory', 'set', 'root-spray')) else '0').strip() or '1') not in ('0', 'no', 'όχι', 'false'),
                'pro': size_ml(row['size']) >= 1000,
            })
        for v in variants:
            csv_rows.append((v, "L'Oréal Professionnel", name_el))
        seen = set()
        uniq = []
        for v in sorted(variants, key=lambda v: v['price'] is None):
            if v['active'] and v['label'] not in seen:
                seen.add(v['label'])
                uniq.append(v)
        order = {id(v): i for i, v in enumerate(variants)}
        variants = sorted(uniq, key=lambda v: order[id(v)])
        if not variants:
            continue

        words = slugify(f"loreal {name_en if name_en != name_el else name_el}").split('-')
        base_slug = '-'.join(words[:8])
        slug = base_slug
        n = 2
        while any(pp['id'] == slug for pp in products):
            slug = f'{base_slug}-{n}'
            n += 1

        desc_el = tidy_long(clean(r['Product_Description_Long (el-GR)']))
        desc_en = tidy_long(clean(r['Product_Description_Long (en-GB)']))
        how_el = clean(r['Instruction_of_use (el-GR)'])
        safety_el = clean(r['Safety_Information_use (el-GR)'])
        if safety_el and safety_el in how_el:
            how_el = how_el.replace(safety_el, '').strip(' .\n') + '.'
        img = images.get('products', {}).get(main['ean'])
        for rule in images.get('rules', []):
            if not img and (rule['contains'].lower() in f'{name_el} {name_en}'.lower()):
                img = rule['image']
        # Η φωτογραφία της σειράς ΔΕΝ μπαίνει στο προϊόν: δείχνει άλλα/περισσότερα προϊόντα

        prod = {
            'id': slug,
            'brand': "L'Oréal Professionnel",
            'brandKey': 'loreal',
            'line': line,
            'category': TYPES[ptype][2],
            'type': ptype,
            'name': {'el': name_el, 'en': name_en},
            'short': {'el': short_text(desc_el), 'en': short_text(desc_en)},
            'description': {'el': desc_el, 'en': desc_en},
            'howTo': {'el': how_el, 'en': clean(r['Instruction_of_use (en-GB)'])},
            'safety': {'el': safety_el, 'en': clean(r['Safety_Information_use (en-GB)'])},
            'hairTypes': hts,
            'needs': needs,
            'variants': variants,
            'image': img,
            'related': [],
            '_eans': [v['ean'] for v in variants],
        }
        products.append(prod)
        for v in variants:
            ean_to_product[v['ean']] = slug

    # Σχετικά προϊόντα (από τη L'Oréal)
    for p in products:
        rel = []
        for e in p['_eans']:
            for x in related_raw.get(e, []):
                pid = ean_to_product.get(x)
                if pid and pid != p['id'] and pid not in rel:
                    rel.append(pid)
        if not rel:
            rel = [q['id'] for q in products if q['line'] == p['line'] and q['id'] != p['id']][:4]
        p['related'] = rel[:6]
        del p['_eans']

    # Άλλες εταιρείες (Evoque, Gotstyle …)
    other_path = DATA / 'other-brands.json'
    if other_path.exists():
        for o in json.loads(other_path.read_text(encoding='utf-8')):
            for v in o['variants']:
                p = prices.get(v['sku'], {})
                if p.get('price'):
                    v['price'] = to_price(p['price'])
                if p.get('stock', '').strip().isdigit():
                    v['stock'] = int(p['stock'])
                v.setdefault('compareAt', None)
                v.setdefault('stock', None)
                v.setdefault('active', (p.get('active', '1').strip() or '1') not in ('0', 'no', 'όχι', 'false'))
                v.setdefault('pro', False)
            for v in o['variants']:
                csv_rows.append((v, o['brand'], o['name']['el']))
            o['variants'] = [v for v in o['variants'] if v['active']]
            if o['variants']:
                o.setdefault('related', [])
                products.append(o)

    # Συμπλήρωσε το prices.csv με όσα EAN λείπουν, για να βάλεις τιμές
    all_rows = OrderedDict(prices)
    for v, brand, pname in csv_rows:
            if v['sku'] not in all_rows:
                all_rows[v['sku']] = {
                    'ean': v['sku'], 'brand': brand, 'product': pname, 'variant': v['label'],
                    'size': v['size'], 'price': '' if v['price'] is None else f"{v['price']:.2f}", 'compare_at': '',
                    'stock': '', 'active': '1' if v['active'] else '0',
                }
    with prices_path.open('w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=['ean', 'brand', 'product', 'variant', 'size', 'price', 'compare_at', 'stock', 'active'])
        w.writeheader()
        for row in all_rows.values():
            w.writerow({k: row.get(k, '') for k in w.fieldnames})

    brands = OrderedDict()
    for p in products:
        brands.setdefault(p['brandKey'], p['brand'])
    out = {
        'generated': pd.Timestamp.now(tz='Europe/Athens').strftime('%Y-%m-%d'),
        'currency': 'EUR',
        'brands': [{'key': k, 'name': v} for k, v in brands.items()],
        'categories': [{'key': k, 'el': v[0], 'en': v[1]} for k, v in CATEGORIES.items()],
        'types': [{'key': k, 'el': v[0], 'en': v[1], 'category': v[2]} for k, v in TYPES.items()],
        'needs': [{'key': k, 'el': v[0], 'en': v[1]} for k, v in NEEDS.items()],
        'hairTypes': [{'key': k, 'el': v[0], 'en': v[1]} for k, v in HAIR_TYPES.items()],
        'lines': images.get('lineInfo', {}),
        'lineImages': {k: v for k, v in images.get('lines', {}).items()},
        'products': products,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf-8')
    priced = sum(1 for p in products for v in p['variants'] if v['price'] is not None)
    total_v = sum(len(p['variants']) for p in products)
    print(f'catalog: {len(products)} προϊόντα, {total_v} παραλλαγές, {priced} με τιμή -> {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
