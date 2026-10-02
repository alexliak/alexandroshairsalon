# E-shop: πώς δουλεύει

## Πού είναι τι

| Τι | Αρχείο |
|---|---|
| Περιγραφές L'Oréal (από τη L'Oréal) | `shop-data/loreal/LP_Assortment_Info.xlsx` |
| Σχετικά προϊόντα L'Oréal | `shop-data/loreal/PPD_Related_Products_2026.xlsx` |
| Evoque, Gotstyle και κάθε άλλη εταιρεία | `shop-data/other-brands.json` |
| **Τιμές, απόθεμα, μέγεθος, ενεργό/ανενεργό** | `shop-data/prices.csv` |
| Ποια φωτογραφία σε ποιο προϊόν/σειρά | `shop-data/images.json` + `public/images/shop/` |
| Ο τελικός κατάλογος (παράγεται, μην τον αλλάζεις με το χέρι) | `src/data/shop/catalog.json` |
| Κώδικας shop | `src/shop/` |
| API κριτικών (Cloudflare Worker) | `worker/` |

Οι επαγγελματικές βαφές, τα οξυζενέ και τα ντεκαπάζ (Inoa, Majirel, Dia, Blond Studio, Dulcia, Efassor)
δεν μπαίνουν στο shop. Αυτό ορίζεται στο `PRO_ONLY_BRANDS` του `scripts/shop/build_catalog.py`.

## Αλλαγή τιμών / αποθέματος

1. Άνοιξε το `shop-data/prices.csv` (Excel ή LibreOffice, κωδικοποίηση UTF-8).
2. Στήλες:
   - `price`: τελική τιμή με ΦΠΑ, π.χ. `24.90`. Αν μείνει κενή, το προϊόν δείχνει «Ρώτα τιμή».
   - `compare_at`: παλιά τιμή, αν θέλεις να φαίνεται διαγραμμένη (προαιρετικό).
   - `stock`: `0` = εξαντλήθηκε. Κενό = διαθέσιμο.
   - `active`: `0` = κρυφό, `1` = φαίνεται.
   - `size`: μέγεθος, μόνο όπου λείπει (π.χ. `300ml`).
3. Τρέξε:
   ```bash
   pip install pandas openpyxl   # μία φορά
   npm run shop:catalog
   npm run build
   ```

Τα 16 EAN με `active = 0` είναι προϊόντα όπου το αρχείο της L'Oréal δεν γράφει μέγεθος
(π.χ. Blondifier). Συμπλήρωσε το `size`, βάλε `active = 1` και θα εμφανιστούν.

## Νέα εταιρεία ή προϊόν εκτός L'Oréal

Πρόσθεσε ένα αντικείμενο στο `shop-data/other-brands.json` (αντέγραψε ένα Evoque και άλλαξε
`id`, `brand`, `brandKey`, `name`, `variants`). Το φίλτρο «Εταιρεία» το βρίσκει μόνο του.

## Φωτογραφίες

Βάλε `όνομα-400.webp` και `όνομα-800.webp` (τετράγωνες, λευκό φόντο) στο `public/images/shop/` και
γράψε στο `shop-data/images.json`, στο `products`, `"EAN": "όνομα"`. Χωρίς φωτογραφία
εμφανίζεται ένα σχέδιο με το όνομα της σειράς.

## Κριτικές (Cloudflare Worker + D1)

Μία φορά:
```bash
cd worker
npm install
npx wrangler login
npx wrangler d1 create ahs-shop          # αντέγραψε το database_id στο wrangler.toml
npm run db:init
npx wrangler secret put ADMIN_TOKEN       # κωδικός για τη σελίδα /shop/admin
npx wrangler secret put IP_SALT           # οποιοδήποτε τυχαίο κείμενο
npm run deploy                            # δίνει διεύθυνση *.workers.dev
```
Μετά το build του site γίνεται με τη διεύθυνση αυτή:
```bash
REACT_APP_SHOP_API=https://ahs-shop-api.<λογαριασμός>.workers.dev npm run build
```
Οι κριτικές δημοσιεύονται μόνο αφού τις εγκρίνεις στο `https://alexandroshairsalon.gr/shop/admin`.
Μέχρι να ρυθμιστεί το API, οι σελίδες προϊόντων γράφουν «Οι κριτικές ανοίγουν σύντομα».

## Πληρωμές

Τώρα: αίτημα παραγγελίας με email (EmailJS) και πληρωμή με κατάθεση/IRIS, όπως το παλιό shop.
Επόμενο βήμα: Stripe Checkout (κάρτες, Apple/Google Pay, Klarna, PayPal) μέσα από τον ίδιο Worker.

## URLs

- `/shop` κατάλογος με φίλτρα (τα φίλτρα γράφονται στο URL, π.χ. `/shop?need=color&brand=loreal`)
- `/shop/p/<id>` σελίδα προϊόντος. Το `npm run build` φτιάχνει στατικό HTML για κάθε προϊόν
  με δικό του title, περιγραφή και Product schema, και το προσθέτει στο sitemap.
- `/shop/cart` καλάθι και παραγγελία (noindex)
- `/shop/admin` έγκριση κριτικών (noindex)
