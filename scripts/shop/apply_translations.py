#!/usr/bin/env python3
"""
Βάζει αγγλικά κείμενα (shop-data/translations-en.py) στα προϊόντα όπου η L'Oréal δεν δίνει αγγλική εκδοχή.
Το καλεί το build_catalog.py πριν γράψει τα αρχεία. Τρέχει και μόνο του, πάνω στα ήδη χτισμένα
src/data/shop/index.json και src/data/shop/products/*.json:
    python3 scripts/shop/apply_translations.py
Αγγίζει μόνο πεδία "en" που λείπουν ή είναι στην πράξη ελληνικά.
"""
import json
import re
import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GREEK = re.compile('[α-ωΑ-Ωά-ώΆ-Ώ]')
EN = runpy.run_path(str(ROOT / 'shop-data' / 'translations-en.py'))['EN']


def needs_en(field):
    en = (field or {}).get('en') or ''
    return bool((field or {}).get('el')) and (not en.strip() or len(GREEK.findall(en)) > 3)


def short_text(desc, limit=180):
    d = re.sub(r'\[[^\]]+\]', ' ', desc or '')
    d = re.sub(r'\*+[^.]*?(τεστ|test|δοκιμ)[^.]*\.', ' ', d, flags=re.I)
    d = re.sub(r'\s+', ' ', d).strip()
    if len(d) <= limit:
        return d
    cut = d[:limit]
    dot = cut.rfind('. ')
    return cut[:dot + 1] if dot > 80 else cut.rsplit(' ', 1)[0] + '…'


def apply(p):
    """p: dict με name/short/description/howTo/safety ({el, en}). Αλλάζει το p επί τόπου."""
    tr = EN.get(p.get('id'), {})
    for k in ('name', 'description', 'howTo', 'safety'):
        if k in tr and k in p and needs_en(p[k]):
            p[k] = {**p[k], 'en': tr[k]}
    if 'short' in p and needs_en(p['short']) and 'description' in p and p['description'].get('en'):
        p['short'] = {**p['short'], 'en': short_text(p['description']['en'])}
    return p


def main():
    idx_path = ROOT / 'src' / 'data' / 'shop' / 'index.json'
    idx = json.loads(idx_path.read_text(encoding='utf-8'))
    for p in idx['products']:
        apply(p)
    idx_path.write_text(json.dumps(idx, ensure_ascii=False, indent=1), encoding='utf-8')
    for f in sorted((ROOT / 'src' / 'data' / 'shop' / 'products').glob('*.json')):
        d = json.loads(f.read_text(encoding='utf-8'))
        before = json.dumps(d, ensure_ascii=False)
        apply(d)
        if json.dumps(d, ensure_ascii=False) != before:
            f.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding='utf-8')
    left = [p['id'] for p in idx['products'] if needs_en(p['name'])]
    print('χωρίς αγγλικό όνομα:', left or 'κανένα')


if __name__ == '__main__':
    main()
