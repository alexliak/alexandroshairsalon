import menu from './menu';

// Prices for cards and texts, read from menu.json so they can never drift from the price list.
const all = menu.flatMap((c) => c.services);

export const service = (name) => {
  const s = all.find((x) => x.name.el === name);
  if (!s) throw new Error(`prices: no service «${name}» in menu.json`);
  return s;
};

// '€54' for one price, 'από €26' / 'from €26' for several.
export const priceText = (lang, ...names) => {
  const ps = names.flatMap((n) => service(n).options.map((o) => o.price));
  const min = Math.min(...ps);
  return min === Math.max(...ps) ? `€${min}` : `${lang === 'en' ? 'from' : 'από'} €${min}`;
};
