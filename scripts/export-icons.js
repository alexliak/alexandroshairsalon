// Writes scripts/icons.json with the SVG markup of the react-icons used on the static pages.
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const fa = require('react-icons/fa');
const names = ['FaPhoneAlt', 'FaWhatsapp', 'FaViber', 'FaVideo', 'FaArrowUp', 'FaMapMarkerAlt'];
const out = {};
for (const n of names) out[n] = renderToStaticMarkup(React.createElement(fa[n], { 'aria-hidden': 'true', focusable: 'false' }));
require('fs').writeFileSync(__dirname + '/icons.json', JSON.stringify(out, null, 1));
console.log('icons:', Object.keys(out).join(', '));
