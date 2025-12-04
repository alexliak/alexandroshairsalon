# Οδηγίες Αφαίρεσης Landing Page /prosfora50

## Πότε να αφαιρέσεις τη σελίδα

Όταν σταματήσεις τα Google Ads campaigns τον Ιανουάριο 2026, μπορείς να αφαιρέσεις εύκολα τη landing page.

## Βήματα για Αφαίρεση

### 1. Διαγραφή Αρχείων

Διέγραψε τα παρακάτω αρχεία:

```bash
src/pages/Landing50.js
src/pages/Landing50.css
```

### 2. Αφαίρεση από App.js

Στο `src/App.js`, αφαίρεσε:

1. **Το import:**
   ```javascript
   import Landing50 from './pages/Landing50';
   ```

2. **Το isLandingPage check:**
   ```javascript
   const isLandingPage = location.pathname === '/prosfora50';
   ```

3. **Το conditional rendering:**
   ```javascript
   if (isLandingPage) {
     return (
       <Routes>
         <Route path="/prosfora50" element={<Landing50 />} />
       </Routes>
     );
   }
   ```

### 3. Αφαίρεση από Sitemap

Στο `public/sitemap.xml`, αφαίρεσε:

```xml
<url>
  <loc>https://alexandroshairsalon.gr/prosfora50</loc>
  <lastmod>2025-01-27</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

### 4. Αφαίρεση από App.js (canonical/title maps)

Στο `src/App.js`, αφαίρεσε από τα maps:

- `canonicalMap['/prosfora50']`
- `titleMap['/prosfora50']`
- `descriptionMap['/prosfora50']`

### 5. Build & Deploy

```bash
npm run build
```

Upload το build στον server.

### 6. Google Search Console

Πήγαινε στο Google Search Console και:
- Request removal για `/prosfora50` (αν θέλεις να αφαιρεθεί από τα search results)

## Σημείωση

Η σελίδα είναι ήδη indexable και έχει όλα τα SEO features ενεργά. Όταν την αφαιρέσεις, το Google θα την αφαιρέσει από το index μετά από λίγο χρόνο.

