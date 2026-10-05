// After `next build` (static export to out/):
//  - out/shop/index.html as well as out/shop.html, so GitHub Pages serves /shop and /shop/ the same way
//  - adds every product page to out/sitemap.xml
const fs = require('fs');
const path = require('path');

const SITE = 'https://alexandroshairsalon.gr';
const out = path.join(__dirname, '..', 'out');

fs.copyFileSync(path.join(out, 'shop.html'), path.join(out, 'shop', 'index.html'));

const { products } = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'shop', 'index.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const urls = [...products.map((p) => `${SITE}/shop/p/${p.id}`), `${SITE}/shop/diagnosi`];
const entries = urls
  .map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`)
  .join('\n');
const smPath = path.join(out, 'sitemap.xml');
fs.writeFileSync(smPath, fs.readFileSync(smPath, 'utf8').replace('</urlset>', `${entries}\n</urlset>`));

const missing = products.filter((p) => !fs.existsSync(path.join(out, 'shop', 'p', `${p.id}.html`)));
if (missing.length) throw new Error(`postbuild: missing product pages: ${missing.map((p) => p.id).join(', ')}`);
console.log(`postbuild: ${products.length} product pages + sitemap, shop/index.html`);
