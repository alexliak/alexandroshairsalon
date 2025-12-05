# Οδηγίες για Fix του /prosfora50 στο Plesk

## Το Πρόβλημα
Το `html` είναι στη λίστα "Serve static files directly by nginx", οπότε το nginx serve-άρει HTML files απευθείας **χωρίς** να εφαρμόσει rewrite rules. Αυτό σημαίνει ότι το `/prosfora50` δεν μπορεί να redirect στο `index.html`.

## Η Λύση (2 Βήματα)

### Βήμα 1: Αφαίρεση `html` από "Serve static files directly by nginx"

1. **Στο Plesk:** Websites & Domains → alexandroshairsalon.gr → **Apache & nginx Settings**

2. **Βρες:** "Serve static files directly by nginx"

3. **Στο πεδίο με τα extensions**, **ΑΦΑΙΡΕΣΕ** το `html`:
   - **Πριν:** `ac3 avi bmp bz2 css cue dat doc docx dts eot exe flv gif gz htm html ico img iso...`
   - **Μετά:** `ac3 avi bmp bz2 css cue dat doc docx dts eot exe flv gif gz htm ico img iso...`
   - (Αφαίρεσε μόνο το `html`, κράτησε το `htm` αν υπάρχει)

4. **Πάτα:** "OK" ή "Apply"

### Βήμα 2: Προσθήκη Apache Directives (εναλλακτική)

Αν δεν υπάρχει "Additional nginx directives", μπορούμε να προσθέσουμε Apache directives:

1. **Στο ίδιο page** (Apache & nginx Settings)

2. **Βρες:** "Additional directives for HTTP" ή "Additional directives for HTTPS"

3. **Πρόσθεσε:**
   ```apache
   <Directory "/var/www/vhosts/your-domain/httpdocs">
     RewriteEngine On
     RewriteBase /
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule ^ index.html [L]
   </Directory>
   ```

   **ΣΗΜΑΝΤΙΚΟ:** Αντικατέστησε `/var/www/vhosts/your-domain/httpdocs` με το **πραγματικό path** του `httpdocs` folder σου.

   **Πώς να βρεις το path:**
   - Στο Plesk: Files → httpdocs
   - Κάνε right-click στο folder → Properties
   - Το "Full path" είναι αυτό που χρειάζεσαι

4. **Πάτα:** "OK" ή "Apply"

### Βήμα 3: Verification

**Μετά από 1-2 λεπτά** (για να εφαρμοστούν οι αλλαγές):

```bash
curl -I https://alexandroshairsalon.gr/prosfora50
```

Πρέπει να επιστρέφει:
```
HTTP/1.1 200 OK
```

**Test στο browser:**
```
https://alexandroshairsalon.gr/prosfora50
```

Πρέπει να φορτώνει τη landing page.

**Test Google Ads:**
- Πήγαινε στο Google Ads
- Κάνε "Test URL" για `https://alexandroshairsalon.gr/prosfora50`
- Πρέπει να επιστρέφει 200 OK

## Αν δεν βρεις "Additional directives for HTTP/HTTPS"

Επικοινώνησε με το **Top.Host support**:

**Subject:** "Need Apache rewrite rules for React SPA routing"

**Message:**
```
Hello,

I have a React Single Page Application and need Apache rewrite rules 
for client-side routing. The route /prosfora50 returns 404 for 
Google Ads crawler.

Please add this to the Apache configuration for alexandroshairsalon.gr:

<Directory "/var/www/vhosts/your-domain/httpdocs">
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</Directory>

Thank you!
```

## Σημαντικό

- **Μετά την αλλαγή, περίμενε 1-2 λεπτά** για να εφαρμοστούν οι αλλαγές
- **Clear browser cache** (Ctrl+Shift+R) αν δοκιμάζεις στο browser
- Το `.htaccess` file πρέπει να είναι στο `httpdocs/` folder (το έχουμε ήδη)

## Troubleshooting

### Αν ακόμα παίρνεις 404:

1. **Verify το `.htaccess` είναι στο `httpdocs/`:**
   - Στο Plesk: Files → httpdocs
   - Βεβαιώσου ότι υπάρχει το `.htaccess` file

2. **Check Apache error logs:**
   - Στο Plesk: Logs → Error Log
   - Ψάξε για "mod_rewrite" errors

3. **Test με διαφορετικό user agent:**
   ```bash
   curl -I -H "User-Agent: Googlebot" https://alexandroshairsalon.gr/prosfora50
   ```

4. **Restart services:**
   - Στο Plesk: Tools & Settings → Server Management → Restart Services
   - Restart: Apache

