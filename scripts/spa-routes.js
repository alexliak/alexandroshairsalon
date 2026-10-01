// GitHub Pages has no rewrite rules: /services would hit 404.html (HTTP 404, bad for Google).
// After `npm run build`, copy index.html to <route>.html so GitHub Pages serves /services,
// /hours, /shop, /douleia and /montela directly with HTTP 200. The URL stays the same.
const fs = require('fs');
const path = require('path');

const ROUTES = ['services', 'hours', 'shop', 'douleia', 'montela'];
const build = path.join(__dirname, '..', 'build');
const index = fs.readFileSync(path.join(build, 'index.html'));

for (const r of ROUTES) {
  fs.writeFileSync(path.join(build, `${r}.html`), index);
  console.log(`spa-routes: build/${r}.html`);
}
