# Plesk Server Configuration for /prosfora50 Route

## Problem
Google Ads crawler returns 404 for `https://alexandroshairsalon.gr/prosfora50` even though the route works when accessed manually (client-side routing).

## Root Cause
The server needs to be configured to serve `index.html` for all routes (including `/prosfora50`) to allow React Router to handle client-side routing. The `.htaccess` file may not be working if:
- Apache `mod_rewrite` is not enabled
- `.htaccess` files are disabled in server configuration
- The server is using Nginx instead of Apache

## Solution: Plesk Configuration

### Option 1: Enable .htaccess in Plesk (Recommended)

1. **Login to Plesk**
2. **Go to:** Websites & Domains → alexandroshairsalon.gr
3. **Click:** "Apache & nginx Settings"
4. **Ensure:**
   - "Additional directives for HTTP" or "Additional directives for HTTPS" includes:
     ```apache
     <Directory "/var/www/vhosts/your-domain/httpdocs">
       Options Indexes FollowSymLinks
       AllowOverride All
       Require all granted
     </Directory>
     ```
   - Or enable "Allow .htaccess files" if there's a checkbox

### Option 2: Nginx Configuration (If using Nginx)

If your Plesk setup uses Nginx, add this to "Additional nginx directives":

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Option 3: Apache Virtual Host Configuration

If you have access to Apache configuration files:

1. **Find your virtual host file** (usually in `/etc/apache2/sites-available/` or `/etc/httpd/conf.d/`)
2. **Add or modify:**

```apache
<VirtualHost *:80>
  ServerName alexandroshairsalon.gr
  DocumentRoot /var/www/vhosts/your-domain/httpdocs
  
  <Directory "/var/www/vhosts/your-domain/httpdocs">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
    
    # Ensure mod_rewrite is working
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]
  </Directory>
</VirtualHost>
```

3. **Restart Apache:**
   ```bash
   sudo systemctl restart apache2
   # or
   sudo service httpd restart
   ```

### Option 4: Verify .htaccess is Working

1. **Test the .htaccess file:**
   - Create a test file: `test-rewrite.txt` in `httpdocs/`
   - Access: `https://alexandroshairsalon.gr/test-rewrite.txt`
   - If it loads, file serving works
   - Delete the test file

2. **Check Apache error logs:**
   - In Plesk: Logs → Error Log
   - Look for "mod_rewrite" or ".htaccess" errors
   - Common error: "RewriteEngine: bad flag delimiters" means syntax error

3. **Test the route:**
   - Use curl: `curl -I https://alexandroshairsalon.gr/prosfora50`
   - Should return `200 OK`, not `404 Not Found`
   - If 404, the rewrite is not working

### Option 5: Contact Hosting Support

If none of the above works, contact Top.Host support with:

**Subject:** "Apache mod_rewrite not working for React SPA routing"

**Message:**
```
Hello,

I have a React Single Page Application hosted on Plesk. The .htaccess file 
is not being processed correctly, causing 404 errors for routes like /prosfora50.

Please:
1. Verify that mod_rewrite is enabled for Apache
2. Verify that .htaccess files are allowed (AllowOverride All)
3. Check that the .htaccess file in httpdocs/ is being read

The .htaccess file contains:
---
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
---

Thank you!
```

## Verification After Configuration

1. **Test directly:**
   ```
   https://alexandroshairsalon.gr/prosfora50
   ```
   Should load the landing page (not 404)

2. **Test with curl:**
   ```bash
   curl -I https://alexandroshairsalon.gr/prosfora50
   ```
   Should return: `HTTP/1.1 200 OK`

3. **Test Google Ads crawler:**
   - Use Google Search Console URL Inspection Tool
   - Test URL: `https://alexandroshairsalon.gr/prosfora50`
   - Should return 200 status code

## Files to Deploy

After configuration, ensure these files are in `httpdocs/`:
- `index.html` (React app entry point)
- `.htaccess` (with rewrite rules)
- All files from `build/` folder

## Notes

- The static `prosfora50.html` file is a fallback but should not be needed if `.htaccess` works correctly
- React Router will handle the route client-side once `index.html` is served
- The `.htaccess` file must be in the root `httpdocs/` directory

