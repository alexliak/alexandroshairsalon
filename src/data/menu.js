// Single source of the salon price list (same as Treatwell). Prices in euro, online.
// The list lives in menu.json, generated from the price-list workbook (Alexandros_Timokatalogos, sheet «Τιμοκατάλογος 2026–27»):
// one price per service, no length options. The static SEO pages (scripts/build-static-pages.py) read the same file.
import menu from './menu.json';

export default menu;
