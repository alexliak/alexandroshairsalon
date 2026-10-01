# Plesk Nginx Configuration για /prosfora50

## Το Πρόβλημα
Το Plesk χρησιμοποιεί **nginx ως frontend** που proxy-άρει requests στο Apache. Αν το "Serve static files directly by nginx" είναι enabled, το nginx serve-άρει HTML files απευθείας **χωρίς** να περνάει από Apache, οπότε το `.htaccess` **δεν λειτουργεί**.

## Η Λύση: Nginx Configuration στο Plesk

### Βήμα 1: Πήγαινε στο Plesk
1. **Login** στο Plesk
2. **Websites & Domains** → **alexandroshairsalon.gr**
3. **Apache & nginx Settings**

### Βήμα 2: Προσθήκη Nginx Configuration

Στο πεδίο **"Additional nginx directives"** (στο τέλος της σελίδας, αν δεν το βλέπεις, πάτα "Show advanced options"), πρόσθεσε:

```nginx
# React Router support - redirect all non-file requests to index.html
location / {
    try_files $uri $uri/ /index.html;
}

# Ensure sitemap.xml is served correctly
location = /sitemap.xml {
    try_files $uri =404;
}
```

### Βήμα 3: Ελέγχος "Serve static files directly by nginx"

Στο **"Serve static files directly by nginx"**, βεβαιώσου ότι:
- Το `html` **ΔΕΝ** είναι στη λίστα των extensions που serve-άρονται απευθείας
- Αν το `html` είναι στη λίστα, **αφαίρεσέ το**

**Προσοχή:** Αν το `html` είναι στη λίστα, το nginx θα serve-άρει το `index.html` απευθείας, αλλά **δεν θα εφαρμόσει rewrite rules** για routes όπως `/prosfora50`.

### Βήμα 4: Apply Changes
- Πάτα **"OK"** ή **"Apply"**
- Περίμενε 1-2 λεπτά για να εφαρμοστούν οι αλλαγές

### Βήμα 5: Verification

**Test με curl:**
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

## Εναλλακτική: Αν δεν υπάρχει "Additional nginx directives"

Αν δεν βλέπεις το πεδίο "Additional nginx directives":

1. **Επικοινώνησε με το Top.Host support** και ζήτησε να προσθέσουν nginx configuration
2. **Ή** ζήτησε πρόσβαση στο nginx config file (συνήθως `/etc/nginx/conf.d/` ή `/etc/nginx/sites-available/`)

## Full Nginx Configuration (για reference)

Αν έχεις πρόσβαση στο nginx config file, πρόσθεσε αυτό:

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name alexandroshairsalon.gr;
    
    root /var/www/vhosts/your-domain/httpdocs;
    index index.html;
    
    # React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Sitemap
    location = /sitemap.xml {
        try_files $uri =404;
    }
}
```

## Troubleshooting

### Αν ακόμα παίρνεις 404:

1. **Clear nginx cache:**
   ```bash
   # Στο Plesk: Tools & Settings → Server Management → Restart Services → nginx
   ```

2. **Check nginx error logs:**
   - Στο Plesk: Logs → Error Log
   - Ψάξε για nginx errors

3. **Verify the configuration:**
   - Στο Plesk: Apache & nginx Settings
   - Βεβαιώσου ότι το nginx configuration είναι σωστό

4. **Test with different user agent:**
   ```bash
   curl -I -H "User-Agent: Googlebot" https://alexandroshairsalon.gr/prosfora50
   ```

## Σημαντικό

- Το `.htaccess` **δεν θα λειτουργήσει** αν το nginx serve-άρει static files απευθείας
- Η nginx configuration είναι **απαραίτητη** για React Router
- Μετά από κάθε αλλαγή, **περίμενε 1-2 λεπτά** για να εφαρμοστούν οι αλλαγές

