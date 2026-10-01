# Google Ads Conversion Tracking Setup

## Προσθήκη Google Ads Conversion Tracking

Για να track-άρεις conversions από την landing page `/prosfora50`, χρειάζεσαι:

### 1. Πάρε το Conversion ID και Label από το Google Ads

1. Πήγαινε στο [Google Ads](https://ads.google.com/)
2. Κάνε κλικ στο **Tools & Settings** → **Conversions**
3. Δημιούργησε ένα νέο conversion action (ή χρησιμοποίησε υπάρχον)
4. Επίλεξε **Website** ως source
5. Αντιγράψε το **Conversion ID** (μοιάζει με `AW-XXXXXXXXX`)
6. Αντιγράψε το **Conversion Label** (μοιάζει με `AbC-D_efG-h12`)

### 2. Προσθήκη στο `.env` file

Πρόσθεσε στο `.env` file:

```
REACT_APP_GA_ADS_CONVERSION_ID=AW-XXXXXXXXX
REACT_APP_GA_ADS_CONVERSION_LABEL=AbC-D_efG-h12
```

**Σημαντικό:** Αντέγραψε τα πραγματικά values από το Google Ads.

### 3. Ενημέρωση του Landing50.js

Το `Landing50.js` ήδη έχει το conversion tracking code. Απλά βεβαιώσου ότι τα environment variables είναι σωστά set.

### 4. Testing

Για να test-άρεις το conversion tracking:

1. Άνοιξε το site στον browser
2. Πήγαινε στο `/prosfora50`
3. Κάνε κλικ στο CTA button
4. Πήγαινε στο Google Ads → Tools & Settings → Conversions
5. Θα πρέπει να βλέπεις το conversion (μπορεί να χρειαστεί λίγος χρόνος)

## Σημείωση

Το conversion tracking θα λειτουργεί μόνο όταν:
- Το `.env` file έχει τα σωστά values
- Έχεις κάνει build και deploy
- Το Google Ads conversion action είναι active

