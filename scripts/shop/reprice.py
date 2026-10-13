#!/usr/bin/env python3
"""Τιμές e-shop από κόστος L'Oréal + τιμές Αγγελόπουλου.

  shop-data/pricing.json                  κανόνες (φάση, ελάχιστο περιθώριο, έκπτωση L'Oréal, χρεώσεις πληρωμής)
  shop-data/competitors/angelopoulos.json τιμές ανταγωνιστή ανά EAN
  shop-data/private/LP_Product_Catalogue_*.xlsm  τιμή καταλόγου L'Oréal χωρίς ΦΠΑ (ΙΔΙΩΤΙΚΟ, εκτός GitHub)
  shop-data/private/costs.json            εκπτώσεις αγοράς μας από τη L'Oréal (ΙΔΙΩΤΙΚΟ)
  -> shop-data/prices.csv (μόνο η στήλη price, μόνο για προϊόντα L'Oréal με τιμή καταλόγου)

Κανόνας για κάθε προϊόν:
  ελάχιστη τιμή = η μικρότερη τιμή που αφήνει το ελάχιστο καθαρό περιθώριο της φάσης,
                  αφού πληρωθούν κόστος αγοράς, προμήθεια πληρωμής και συσκευασία.
  Αν ο Αγγελόπουλος πουλάει ΠΑΝΩ από την ελάχιστη τιμή, πάμε στη δική του τιμή (στρογγυλοποίηση προς τα κάτω).
  Αλλιώς μένουμε στην ελάχιστη τιμή (στρογγυλοποίηση προς τα πάνω). Ποτέ κάτω από την ελάχιστη.
  Οι τιμές τελειώνουν σε ,49 ή ,99.

  python3 scripts/shop/reprice.py [--phase grow] [--report αρχείο.csv] [--dry-run]

Η αναφορά (--report) έχει κόστη και περιθώρια: κράτα τη ΕΚΤΟΣ του repository.
"""
import argparse
import csv
import json
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_catalog import DATA, ean13, load_pricelist  # noqa: E402


def up99(x):
    """Η μικρότερη τιμή ,49 ή ,99 που είναι >= x."""
    return round(math.ceil(round((x + 0.01) * 2, 6)) / 2 - 0.01, 2)


def down99(x):
    """Η μεγαλύτερη τιμή ,49 ή ,99 που είναι <= x."""
    return round(math.floor(round((x + 0.01) * 2, 6)) / 2 - 0.01, 2)


def economics(price, cost_net, cfg):
    """Καθαρό κέρδος ανά τεμάχιο και περιθώριο επί της τιμής χωρίς ΦΠΑ."""
    net = price / (1 + cfg['vat'])
    fee = price * cfg['paymentFeePct'] + cfg['paymentFeeFixed']
    profit = net - cost_net - fee - cfg['packagingPerItem']
    return profit, profit / net


def floor_price(cost_net, margin, cfg):
    k = (1 - margin) / (1 + cfg['vat']) - cfg['paymentFeePct']
    return (cost_net + cfg['paymentFeeFixed'] + cfg['packagingPerItem']) / k


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--phase')
    ap.add_argument('--report')
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()

    cfg = json.loads((DATA / 'pricing.json').read_text(encoding='utf-8'))
    private = DATA / 'private' / 'costs.json'
    if not private.exists():
        sys.exit('Λείπει το shop-data/private/costs.json (εκπτώσεις αγοράς). Δες docs/SHOP.md, «Ιδιωτικά δεδομένα».')
    cfg.update({k: v for k, v in json.loads(private.read_text(encoding='utf-8')).items() if not k.startswith('_')})
    phase = a.phase or cfg['phase']
    margin = cfg['phases'][phase]['minMargin']
    comp = json.loads((DATA / 'competitors' / 'angelopoulos.json').read_text(encoding='utf-8'))['prices']
    comp = {ean13(k): v for k, v in comp.items()}
    overrides = {ean13(k): float(v) for k, v in cfg.get('overrides', {}).items()}
    priv = json.loads(private.read_text(encoding='utf-8'))
    if sorted((DATA / 'private').glob('LP_Product_Catalogue_*.xlsm')):
        pl = load_pricelist(with_costs=True)
    else:  # χωρίς .xlsm: κατηγορίες από το δημόσιο JSON, τιμές καταλόγου από το ιδιωτικό costs.json
        pl = {e: {**v, 'wholesale': priv.get('listPrices', {}).get(e)} for e, v in load_pricelist().items()}

    path = DATA / 'prices.csv'
    with path.open(encoding='utf-8-sig') as f:
        rd = csv.DictReader(f)
        fields = rd.fieldnames
        rows = list(rd)

    report, changed = [], 0
    for r in rows:
        e = ean13(r['ean'])
        info = pl.get(e)
        # Μόνο λιανική (R) και εργαλεία: τα επαγγελματικά (T) έχουν άλλη έκπτωση και δεν πουλιούνται στο shop
        if not info or info.get('cls') not in ('R', 'Tools') or not isinstance(info.get('wholesale'), (int, float)):
            continue
        cost_net = info['wholesale'] * (1 - cfg['lorealRetailDiscount']) * (1 - cfg['lorealPromoDiscount'])
        fl = floor_price(cost_net, margin, cfg)
        c = comp.get(e) or {}
        now = c.get('now')
        if e in overrides:
            price, rule = overrides[e], 'χειροκίνητη'
        elif cfg.get('matchCompetitor') and now and now - cfg.get('undercut', 0) >= fl:
            price = down99(now - cfg.get('undercut', 0))
            price, rule = (price, 'τιμή Αγγελόπουλου') if price >= fl else (up99(fl), 'ελάχιστη')
        else:
            price, rule = up99(fl), 'ελάχιστη'
        profit, m = economics(price, cost_net, cfg)
        old = r.get('price', '')
        new = f'{price:.2f}'
        if old != new:
            changed += 1
            r['price'] = new
        report.append({
            'ean': e, 'product': r['product'], 'size': r['size'], 'rule': rule,
            'cost_with_vat': round(cost_net * (1 + cfg['vat']), 2), 'price': price,
            'angelopoulos_now': now, 'angelopoulos_old': c.get('old'),
            'vs_angelopoulos_now': '' if not now else f'{price / now - 1:+.1%}',
            'profit_eur': round(profit, 2), 'margin': f'{m:.1%}',
        })

    if not a.dry_run:
        with path.open('w', encoding='utf-8-sig', newline='') as f:
            w = csv.DictWriter(f, fieldnames=fields)
            w.writeheader()
            w.writerows(rows)
    if a.report:
        with open(a.report, 'w', encoding='utf-8-sig', newline='') as f:
            w = csv.DictWriter(f, fieldnames=list(report[0].keys()))
            w.writeheader()
            w.writerows(report)

    priced = [x for x in report if x['angelopoulos_now']]
    cheaper = sum(1 for x in priced if x['price'] <= x['angelopoulos_now'])
    avg_m = sum(float(x['margin'][:-1]) for x in report) / len(report)
    print(f'Φάση: {phase} (ελάχιστο περιθώριο {margin:.0%}) · {len(report)} τιμές · {changed} αλλαγές'
          f'{" (dry run)" if a.dry_run else ""}')
    print(f'Μέσο καθαρό περιθώριο: {avg_m:.1f}% · ίδια ή φθηνότερη από Αγγελόπουλο: {cheaper}/{len(priced)}')


if __name__ == '__main__':
    main()
