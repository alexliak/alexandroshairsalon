import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaSearch, FaSlidersH, FaTimes, FaWhatsapp } from 'react-icons/fa';
import {
  BRANDS, CATEGORIES, HAIR_TYPES, LINE_IMAGES, LINE_INFO, NEEDS, PRODUCTS, TYPES, imageSrc, t as tr
} from '../catalog';
import { useShop } from '../ShopContext';
import { CATALOG_MODE, SITE, WHATSAPP } from '../config';
import useFilters from '../useFilters';
import FilterPanel from '../components/FilterPanel';
import ProductCard from '../components/ProductCard';

const PAGE = 24;

// «Βρες αυτό που χρειάζεσαι»: το πρόβλημα με λόγια πελάτη, μετά το είδος προϊόντος
const CONCERNS = [
  { key: 'damaged', needs: ['repair'], el: 'Ταλαιπωρημένα ή σπασμένα', en: 'Damaged or breaking' },
  { key: 'colored', needs: ['color'], el: 'Βαμμένα μαλλιά', en: 'Colour-treated' },
  { key: 'blonde', needs: ['blonde'], el: 'Ξανθά ή γκρι', en: 'Blonde or grey' },
  { key: 'frizz', needs: ['smooth'], el: 'Φριζάρισμα', en: 'Frizz' },
  { key: 'curly', needs: ['curls'], el: 'Σγουρά, μπούκλες', en: 'Curly hair' },
  { key: 'dry', needs: ['hydration'], el: 'Ξηρά, αφυδατωμένα', en: 'Dry hair' },
  { key: 'fine', needs: ['volume', 'hairloss'], el: 'Λεπτά, αραιά, τριχόπτωση', en: 'Fine, thinning, hair loss' },
  { key: 'scalp', needs: ['scalp'], el: 'Τριχωτό: πιτυρίδα, λιπαρότητα', en: 'Scalp: dandruff, oiliness' },
  { key: 'long', needs: ['length'], el: 'Μακριά μαλλιά, ψαλίδα', en: 'Long hair, split ends' },
  { key: 'styling', needs: ['hold', 'heat'], el: 'Styling & θερμοπροστασία', en: 'Styling & heat protection' }
];
const KINDS = [
  { key: 'shampoo', types: ['shampoo', 'pre-shampoo'], el: 'Σαμπουάν', en: 'Shampoo' },
  { key: 'conditioner', types: ['conditioner'], el: 'Conditioner', en: 'Conditioner' },
  { key: 'mask', types: ['mask'], el: 'Μάσκα', en: 'Mask' },
  { key: 'leave', types: ['leave-in', 'serum', 'oil', 'treatment', 'ampoules'], el: 'Leave-in, ορός, λάδι', en: 'Leave-in, serum, oil' },
  { key: 'styling', types: ['styling', 'hairspray', 'pomade'], el: 'Styling & λακ', en: 'Styling & hairspray' },
  { key: 'tools', types: ['hair-tool', 'accessory'], el: 'Εργαλεία', en: 'Tools' }
];
const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

const ShopHome = ({ lang, t }) => {
  const { ratings, wish } = useShop();
  const f = useFilters({ ratings, wish });
  const { state, results, update, toggle, clearAll, active } = f;
  const [sheet, setSheet] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const [q, setQ] = useState(state.q);
  const gridRef = useRef(null);
  const hasRatings = Object.keys(ratings).length > 0;

  useEffect(() => setLimit(PAGE), [results.length, state.sort]);
  useEffect(() => setQ(state.q), [state.q]);

  // Debounced search into the URL
  useEffect(() => {
    const id = setTimeout(() => q !== state.q && update({ q }), 250);
    return () => clearTimeout(id);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = sheet ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheet]);

  // ItemList structured data for the shop page
  useEffect(() => {
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'shop-list-schema';
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Alexandros Hair Salon Shop',
      itemListElement: PRODUCTS.slice(0, 60).map((p, i) => ({
        '@type': 'ListItem', position: i + 1, url: `${SITE}/shop/p/${p.id}`, name: p.name.el
      }))
    });
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  // Οι φωτογραφίες σειρών μπαίνουν μόνο εδώ (δείχνουν όλη τη σειρά, όχι ένα προϊόν)
  const lines = useMemo(
    () =>
      Object.entries(LINE_IMAGES)
        .filter(([line]) => PRODUCTS.some((p) => p.line === line))
        .map(([line, image]) => ({ line, image })),
    []
  );

  const chips = [];
  const label = (list, key) => tr(list.find((x) => x.key === key), lang) || key;
  state.brand.forEach((k) => chips.push({ k: 'brand', v: k, l: BRANDS.find((b) => b.key === k)?.name || k }));
  state.cat.forEach((k) => chips.push({ k: 'cat', v: k, l: label(CATEGORIES, k) }));
  state.need.forEach((k) => chips.push({ k: 'need', v: k, l: label(NEEDS, k) }));
  state.hair.forEach((k) => chips.push({ k: 'hair', v: k, l: label(HAIR_TYPES, k) }));
  state.type.forEach((k) => chips.push({ k: 'type', v: k, l: label(TYPES, k) }));
  state.line.forEach((k) => chips.push({ k: 'line', v: k, l: k }));

  const goToGrid = () => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const advice = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    lang === 'en' ? 'Hello, I would like advice on which products suit my hair.' : 'Γεια σας, θα ήθελα συμβουλή για το ποια προϊόντα ταιριάζουν στα μαλλιά μου.'
  )}`;

  return (
    <div className="sh">
      <section className="sh-hero">
        <div className="sh-hero-text">
          <span className="nh-eyebrow">{t.heroEyebrow}</span>
          <h1 className="nh-h1 nh-h1-page" dangerouslySetInnerHTML={{ __html: t.heroTitle }} />
          <p className="nh-lead">{t.heroLead}</p>
          <div className="nh-cta-row">
            <button type="button" className="nh-btn nh-btn-gold" onClick={goToGrid}>{t.heroCta}</button>
            <a className="nh-btn nh-btn-ghost" href={advice} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp aria-hidden="true" style={{ marginRight: 10 }} /> {t.askAdvice}
            </a>
          </div>
        </div>
        <figure className="sh-hero-art">
          <picture>
            <source media="(max-width: 820px)" srcSet="/images/shop/hero-steampod-800.webp" />
            <img src="/images/shop/hero-steampod-1600.webp" alt="L’Oréal Professionnel Steampod" width="1600" height="622" />
          </picture>
        </figure>
        {CATALOG_MODE && <p className="sh-catalog-banner" role="note">{t.catalogBanner}</p>}
        <ul className="sh-trust">
          <li>{t.trust1}</li>
          <li>{t.trust2}</li>
          <li>{t.trust3}</li>
        </ul>
      </section>

      <section className="sh-finder" aria-labelledby="sh-finder-title">
        <h2 id="sh-finder-title" className="sh-h2">{t.finderTitle}</h2>
        <p className="sh-finder-step"><span>1</span>{t.finderStep1}</p>
        <div className="sh-concerns">
          {CONCERNS.map((c) => {
            const on = sameSet(state.need, c.needs);
            const n = PRODUCTS.filter((p) => c.needs.some((x) => p.needs.includes(x))).length;
            if (!n) return null;
            return (
              <button
                key={c.key}
                type="button"
                className={`sh-concern${on ? ' is-on' : ''}`}
                aria-pressed={on}
                onClick={() => update({ need: on ? [] : c.needs })}
              >
                <span className="sh-concern-name">{c[lang] || c.el}</span>
                <span className="sh-concern-count">{t.results(n)}</span>
              </button>
            );
          })}
        </div>
        <p className="sh-finder-step"><span>2</span>{t.finderStep2}</p>
        <div className="sh-need-row">
          {KINDS.map((k) => {
            const on = sameSet(state.type, k.types);
            if (!PRODUCTS.some((p) => k.types.includes(p.type))) return null;
            return (
              <button
                key={k.key}
                type="button"
                className={`sh-need${on ? ' is-on' : ''}`}
                aria-pressed={on}
                onClick={() => update({ type: on ? [] : k.types })}
              >
                {k[lang] || k.el}
              </button>
            );
          })}
        </div>
        <div className="sh-finder-foot">
          <button type="button" className="nh-btn nh-btn-gold" onClick={goToGrid}>
            {t.showResults(results.length)}
          </button>
          {(state.need.length > 0 || state.type.length > 0) && (
            <button type="button" className="sh-link" onClick={() => update({ need: [], type: [] })}>{t.clearAll}</button>
          )}
        </div>
      </section>

      <section className="sh-lines-strip" aria-labelledby="sh-lines-title">
        <h2 id="sh-lines-title" className="sh-h2">{t.shopByLine}</h2>
        <div className="sh-line-cards">
          {lines.map((p) => (
            <button
              key={p.line}
              type="button"
              className={`sh-line-card${state.line.includes(p.line) ? ' is-on' : ''}`}
              aria-pressed={state.line.includes(p.line)}
              onClick={() => {
                update({ line: state.line.includes(p.line) ? [] : [p.line] });
                goToGrid();
              }}
            >
              <img src={imageSrc(p.image, 400)} alt="" loading="lazy" width="400" height="400" />
              <span className="sh-line-card-name">{p.line}</span>
              <span className="sh-line-card-sub">{tr(LINE_INFO[p.line], lang)}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="sh-catalog" ref={gridRef} aria-label={t.allProducts}>
        <div className="sh-toolbar">
          <form className="sh-search" role="search" onSubmit={(e) => { e.preventDefault(); update({ q }); }}>
            <FaSearch aria-hidden="true" />
            <label className="sh-visually-hidden" htmlFor="sh-q">{t.search}</label>
            <input id="sh-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchPh} autoComplete="off" />
          </form>
          <div className="sh-toolbar-right">
            <button type="button" className="sh-filter-btn" onClick={() => setSheet(true)}>
              <FaSlidersH aria-hidden="true" /> {t.filters}{active > 0 && <span className="sh-dot">{active}</span>}
            </button>
            <label className="sh-sort">
              <span className="sh-visually-hidden">{t.sort}</span>
              <select value={state.sort} onChange={(e) => update({ sort: e.target.value === 'featured' ? null : e.target.value })}>
                <option value="featured">{t.sortFeatured}</option>
                {!CATALOG_MODE && <option value="price-asc">{t.sortPriceAsc}</option>}
                {!CATALOG_MODE && <option value="price-desc">{t.sortPriceDesc}</option>}
                <option value="name">{t.sortName}</option>
                {hasRatings && <option value="rating">{t.sortRating}</option>}
              </select>
            </label>
          </div>
        </div>

        <div className="sh-layout">
          <aside className={`sh-side${sheet ? ' is-open' : ''}`} aria-label={t.filters}>
            <div className="sh-sheet-head">
              <h2>{t.filters}</h2>
              <button type="button" className="sh-icon-btn" onClick={() => setSheet(false)} aria-label={t.close}>
                <FaTimes aria-hidden="true" />
              </button>
            </div>
            <div className="sh-side-scroll">
              <FilterPanel lang={lang} t={t} f={f} hasRatings={hasRatings} />
            </div>
            <div className="sh-sheet-foot">
              <button type="button" className="sh-link" onClick={clearAll}>{t.clearAll}</button>
              <button type="button" className="nh-btn nh-btn-gold nh-btn-sm" onClick={() => setSheet(false)}>
                {t.showResults(results.length)}
              </button>
            </div>
          </aside>
          {sheet && <div className="sh-sheet-scrim" onClick={() => setSheet(false)} />}

          <div className="sh-results">
            <div className="sh-results-head">
              <p className="sh-count" aria-live="polite">{t.results(results.length)}</p>
              {(chips.length > 0 || active > 0) && (
                <div className="sh-chips">
                  {chips.map((c) => (
                    <button key={`${c.k}-${c.v}`} type="button" className="sh-chip" onClick={() => toggle(c.k, c.v)}>
                      {c.l} <FaTimes aria-hidden="true" />
                    </button>
                  ))}
                  {state.q && (
                    <button type="button" className="sh-chip" onClick={() => update({ q: null })}>
                      “{state.q}” <FaTimes aria-hidden="true" />
                    </button>
                  )}
                  <button type="button" className="sh-link" onClick={clearAll}>{t.clearAll}</button>
                </div>
              )}
            </div>

            {results.length === 0 ? (
              <div className="sh-empty">
                <p>{t.noResults}</p>
                <p className="sh-muted">{t.noResultsHint}</p>
                <button type="button" className="nh-btn nh-btn-ghost nh-btn-sm" onClick={clearAll}>{t.clearAll}</button>
              </div>
            ) : (
              <div className="sh-grid">
                {results.slice(0, limit).map((p) => (
                  <ProductCard key={p.id} product={p} lang={lang} t={t} />
                ))}
              </div>
            )}
            {results.length > limit && (
              <div className="sh-center sh-mt">
                <button type="button" className="nh-btn nh-btn-ghost nh-btn-sm" onClick={() => setLimit(limit + PAGE)}>
                  {t.showMore} ({results.length - limit})
                </button>
              </div>
            )}

            <aside className="sh-advice">
              <div>
                <h2 className="sh-h2">{t.adviceTitle}</h2>
                <p>{t.adviceText}</p>
              </div>
              <a className="nh-btn nh-btn-dark" href={advice} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp aria-hidden="true" style={{ marginRight: 10 }} /> WhatsApp
              </a>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopHome;
