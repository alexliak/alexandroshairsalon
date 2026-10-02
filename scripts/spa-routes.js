// GitHub Pages has no rewrite rules: /services would hit 404.html (HTTP 404, bad for Google).
// After `npm run build`, copy index.html to <route>.html so GitHub Pages serves /services,
// /hours, /shop, /douleia and /montela directly with HTTP 200. The URL stays the same.
//
// Shop: every product gets its own HTML file (build/shop/p/<id>.html) with its own title,
// description, canonical, Open Graph and Product schema already in the HTML, so Google and
// link previews see the product even before JavaScript runs. Products are also added to the sitemap.
const fs = require('fs');
const path = require('path');

const ROUTES = ['services', 'hours', 'shop', 'douleia', 'montela'];
const SITE = 'https://alexandroshairsalon.gr';
const build = path.join(__dirname, '..', 'build');
const index = fs.readFileSync(path.join(build, 'index.html'), 'utf8');

for (const r of ROUTES) {
  fs.writeFileSync(path.join(build, `${r}.html`), index);
  console.log(`spa-routes: build/${r}.html`);
}

// ── Shop ────────────────────────────────────────────────────────────────────
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const withMeta = (html, { title, description, url, image, jsonld, noindex }) => {
  let out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(description)}" />`);
  if (image) {
    out = out
      .replace(/<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${image}" />`)
      .replace(/<meta property="og:image:width" content="[^"]*"\s*\/?>/, '<meta property="og:image:width" content="800" />')
      .replace(/<meta property="og:image:height" content="[^"]*"\s*\/?>/, '<meta property="og:image:height" content="800" />')
      .replace(/<meta property="og:image:type" content="[^"]*"\s*\/?>/, '<meta property="og:image:type" content="image/webp" />');
  }
  const extra = [
    noindex ? '<meta name="robots" content="noindex" />' : '',
    jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>` : ''
  ].join('');
  return out.replace('</head>', `${extra}</head>`);
};

const catalogPath = path.join(__dirname, '..', 'src', 'data', 'shop', 'catalog.json');
if (fs.existsSync(catalogPath)) {
  const { products } = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  // Catalog mode (no prices on the site): no prices in the schema either
  const settingsPath = path.join(__dirname, '..', 'src', 'shop', 'settings.json');
  const catalogMode = fs.existsSync(settingsPath) && !!JSON.parse(fs.readFileSync(settingsPath, 'utf8')).catalogMode;
  const dir = path.join(build, 'shop', 'p');
  fs.mkdirSync(dir, { recursive: true });
  // /shop/ as a folder too, in case GitHub Pages prefers the folder over shop.html
  fs.writeFileSync(path.join(build, 'shop', 'index.html'), index);

  const urls = [];
  for (const p of products) {
    const url = `${SITE}/shop/p/${p.id}`;
    const description = (p.short.el || p.description.el || p.name.el).slice(0, 155);
    const image = p.image ? `${SITE}/images/shop/${p.image}-800.webp` : null;
    const offers = p.variants
      .filter((v) => !catalogMode && typeof v.price === 'number')
      .map((v) => ({
        '@type': 'Offer', sku: v.sku, ...(v.ean ? { gtin13: v.ean } : {}), price: v.price.toFixed(2), priceCurrency: 'EUR',
        availability: v.stock === 0 ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition', url
      }));
    const jsonld = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name.el,
      description,
      brand: { '@type': 'Brand', name: p.brand },
      sku: p.variants[0].sku,
      ...(p.variants[0].ean ? { gtin13: p.variants[0].ean } : {}),
      ...(image ? { image: [image] } : {}),
      url,
      ...(offers.length ? { offers: offers.length === 1 ? offers[0] : offers } : {})
    };
    const html = withMeta(index, {
      title: `${p.name.el} | ${p.brand} | Alexandros Hair Salon`,
      description, url, image, jsonld
    });
    fs.writeFileSync(path.join(dir, `${p.id}.html`), html);
    urls.push(url);
  }

  for (const [file, title] of [['cart', 'Καλάθι'], ['admin', 'Διαχείριση']]) {
    fs.writeFileSync(
      path.join(build, 'shop', `${file}.html`),
      withMeta(index, { title: `${title} | Alexandros Hair Salon`, description: 'Alexandros Hair Salon Shop', url: `${SITE}/shop/${file}`, noindex: true })
    );
  }

  // Sitemap: add the product pages
  const smPath = path.join(build, 'sitemap.xml');
  if (fs.existsSync(smPath)) {
    const today = new Date().toISOString().slice(0, 10);
    const entries = urls
      .map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`)
      .join('\n');
    const sm = fs.readFileSync(smPath, 'utf8').replace('</urlset>', `${entries}\n</urlset>`);
    fs.writeFileSync(smPath, sm);
  }
  console.log(`spa-routes: ${products.length} product pages in build/shop/p/ + sitemap`);
}
