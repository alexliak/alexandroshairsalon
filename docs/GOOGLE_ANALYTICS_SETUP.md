# Google Analytics 4 Setup

## Βήματα για να προσθέσεις το Google Analytics στο site

### 1. Πάρε το Measurement ID από το Google Analytics

1. Πήγαινε στο [Google Analytics](https://analytics.google.com/)
2. Κάνε κλικ στο **Admin** (γρανάζι) στην κάτω αριστερή γωνία
3. Στο **Property**, επίλεξε το property σου (ή δημιούργησε νέο αν δεν έχεις)
4. Στο **Data Streams**, επίλεξε το stream του website σου
5. Αντιγράψε το **Measurement ID** (μοιάζει με `G-XXXXXXXXXX`)

### 2. Προσθήκη στο Project

Δημιούργησε ένα αρχείο `.env` στο root directory του project με το εξής περιεχόμενο:

```
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Σημαντικό:** Αντέγραψε το Measurement ID που πήρες από το Google Analytics.

### 3. Build και Deploy

Μετά την προσθήκη του `.env` file:

```bash
npm run build
```

Κάνε upload το build στον server σου.

### 4. Επαλήθευση

1. Άνοιξε το site σου στον browser
2. Πήγαινε στο Google Analytics > Reports > Realtime
3. Θα πρέπει να βλέπεις τον εαυτό σου ως active user

## Τι Track-άρει το Google Analytics

- **Page Views:** Όλες οι σελίδες που επισκέπτονται οι χρήστες
- **Events:** Κλικ σε links, κλήσεις τηλεφώνου, κ.λπ.
- **User Behavior:** Πώς περιηγούνται στο site

## Σημείωση

Το `.env` file **ΔΕΝ** πρέπει να commit-άρει στο Git (είναι ήδη στο `.gitignore`).
Μόνο το `.env.example` (αν υπάρχει) μπορεί να commit-αρθεί.

