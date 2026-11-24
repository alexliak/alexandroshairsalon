import menu from './menu';

// Prices for cards and texts, read from menu.json so they can never drift from the price list.
const all = menu.flatMap((c) => c.services);

export const service = (name) => {
  const s = all.find((x) => x.name.el === name);
  if (!s) throw new Error(`prices: no service «${name}» in menu.json`);
  return s;
};

// '€54' (ακέραιο), '€0,01' / '€0.01' (δεκαδικό) ή «Δωρεάν» / «Free» για 0.
// Στο site και στο Google οι δωρεάν υπηρεσίες γράφουν «Δωρεάν»· το €0,01 υπάρχει μόνο στην Treatwell, που δεν δέχεται €0.
export const eur = (p, lang) =>
  p === 0
    ? (lang === 'en' ? 'Free' : 'Δωρεάν')
    : Number.isInteger(p) ? `€${p}` : `€${lang === 'en' ? p.toFixed(2) : p.toFixed(2).replace('.', ',')}`;

// '€54' for one price, 'από €26' / 'from €26' for several.
// Η χαμηλότερη τιμή μετράει και τη Μηνιαία ρίζα (€35): όπου φαίνεται, γράφουμε δίπλα πότε ισχύει.
export const priceText = (lang, ...names) => {
  const ps = names.flatMap((n) => service(n).options.map((o) => o.price));
  const min = Math.min(...ps);
  return min === Math.max(...ps) ? eur(min, lang) : `${lang === 'en' ? 'from' : 'από'} ${eur(min, lang)}`;
};

// Μέρες για τη Μηνιαία ρίζα: αλλάζει σε ένα σημείο, στο "monthlyDays" της «Βαφή ρίζας» στο menu.json.
export const MONTHLY_DAYS = service('Βαφή ρίζας').monthlyDays;

// Κείμενο υπηρεσίας με τις μεταβλητές του menu.json (π.χ. {monthlyDays}).
export const fill = (txt) => (typeof txt === 'string' ? txt.replace(/\{monthlyDays\}/g, String(MONTHLY_DAYS)) : txt);

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
