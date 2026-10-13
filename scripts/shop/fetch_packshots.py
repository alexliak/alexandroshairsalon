#!/usr/bin/env python3
"""
Κατεβάζει τα packshots της L'Oréal (shop-data/packshots.json -> source) και φτιάχνει
public/images/shop/p/<EAN>-400.webp και -800.webp. Γράφει στο packshots.json -> local
ποια κατέβηκαν, ώστε το build_catalog.py να τα δείχνει στο shop.

Τρέχει στο GitHub Actions (.github/workflows/packshots.yml), γιατί από εκεί υπάρχει πρόσβαση
στο images.salsify.com. Τοπικά: pip install pillow requests && python3 scripts/shop/fetch_packshots.py
"""
import io
import json
import sys
import time
from pathlib import Path

import requests
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
CFG = ROOT / 'shop-data' / 'packshots.json'
OUT = ROOT / 'public' / 'images' / 'shop' / 'p'


def square(img, size):
    """Λευκό τετράγωνο φόντο, το προϊόν στο κέντρο χωρίς παραμόρφωση."""
    img = img.convert('RGBA')
    bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
    img = Image.alpha_composite(bg, img).convert('RGB')
    img.thumbnail((size, size), Image.LANCZOS)
    canvas = Image.new('RGB', (size, size), (255, 255, 255))
    canvas.paste(img, ((size - img.width) // 2, (size - img.height) // 2))
    return canvas


def main():
    cfg = json.loads(CFG.read_text(encoding='utf-8'))
    local = cfg.setdefault('local', {})
    OUT.mkdir(parents=True, exist_ok=True)
    ok = failed = skipped = 0
    for ean, url in cfg['source'].items():
        name = f'p/{ean}'
        if local.get(ean) == name and (OUT / f'{ean}-800.webp').exists():
            skipped += 1
            continue
        try:
            r = requests.get(url, timeout=60)
            r.raise_for_status()
            img = Image.open(io.BytesIO(r.content))
            for size in (400, 800):
                square(img, size).save(OUT / f'{ean}-{size}.webp', 'WEBP', quality=82, method=6)
            local[ean] = name
            ok += 1
        except Exception as e:  # noqa: BLE001
            print(f'ΑΠΟΤΥΧΙΑ {ean}: {e}', file=sys.stderr)
            failed += 1
        time.sleep(0.2)
    CFG.write_text(json.dumps(cfg, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'packshots: {ok} νέα, {skipped} υπήρχαν, {failed} απέτυχαν')


if __name__ == '__main__':
    main()
