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

// Κράτηση μιας συγκεκριμένης υπηρεσίας/επιλογής στο ίδιο widget της Treatwell (widget.treatwell.gr, όχι marketplace).
// Ανοίγει κατευθείαν την «Επιλογή ώρας» με την υπηρεσία ήδη στο καλάθι.
const VENUE = '523778';
export const bookUrl = (option) =>
  option && option.book
    ? `https://widget.treatwell.gr/availability?venueId=${VENUE}&proposedServices=${encodeURIComponent(
        JSON.stringify([{ menuItemId: option.book.item, optionIds: [option.book.option] }])
      )}`
    : null;

// Ο σύνδεσμος κράτησης μιας υπηρεσίας με μία μόνο επιλογή (για κάρτες της αρχικής).
export const serviceBookUrl = (name) => {
  const s = service(name);
  return s.options.length === 1 ? bookUrl(s.options[0]) : null;
};
