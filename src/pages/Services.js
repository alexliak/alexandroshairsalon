import React from 'react';
import NhLayout, { BOOK, PHONE } from '../components/NhLayout';
import menu from '../data/menu';

// Services & prices (2026 design). The list itself lives in src/data/menu.js.
const text = {
  el: {
    eyebrow: 'Τιμές κομμωτηρίου · Θησείο, Αθήνα',
    title: 'Τιμές',
    titleEm: 'και χρόνοι.',
    lead: 'Τιμές και χρόνοι κατά προσέγγιση: τα μακριά ή πυκνά μαλλιά θέλουν λίγο παραπάνω προϊόν και χρόνο. Στην online κράτηση βλέπεις ελεύθερες ώρες και πληρώνεις online ή στο κομμωτήριο.',
    book: 'Κλείσε online',
    call: 'Κάλεσε',
    from: 'από',
    bookThis: 'Κράτηση',
    notesTitle: 'Καλό να ξέρεις',
    notes: [
      'Η τιμή εξαρτάται από το μήκος και την πυκνότητα των μαλλιών.',
      'Στη βαφή για πολύ πυκνά ή πολύ μακριά μαλλιά υπάρχει η προσθήκη +€19 για την επιπλέον ποσότητα και τον χρόνο.',
      'Δωρεάν τεστ ευαισθησίας πριν από την πρώτη σου βαφή.',
      'Έχεις extensions; Γράψ’ το στην κράτηση για να κρατήσουμε τον σωστό χρόνο.'
    ],
    jump: 'Κατηγορίες'
  },
  en: {
    eyebrow: 'Hair salon prices · Thiseio, Athens',
    title: 'Prices',
    titleEm: 'and times.',
    lead: 'Prices and times are approximate: long or thick hair needs a little more product and time. When you book online you see free slots and pay online or at the salon.',
    book: 'Book online',
    call: 'Call',
    from: 'from',
    bookThis: 'Book',
    notesTitle: 'Good to know',
    notes: [
      'Price depends on hair length and thickness.',
      'For colour on very thick or very long hair there is a +€19 add-on for the extra product and time.',
      'Free sensitivity test before your first colour.',
      'Wearing extensions? Mention it when you book so we reserve the right time.'
    ],
    jump: 'Categories'
  }
};

const priceLabel = (options, t) => {
  const prices = options.map((o) => o.price);
  const min = Math.min(...prices);
  return prices.length > 1 && Math.max(...prices) !== min ? `${t.from} €${min}` : `€${min}`;
};

const Services = ({ language, setLanguage }) => {
  const t = text[language] || text.el;
  const lang = language === 'en' ? 'en' : 'el';

  return (
    <NhLayout language={language} setLanguage={setLanguage}>
      <main className="nh-page">
        <section className="nh-page-hero">
          <h1 className="nh-h1 nh-h1-page">
            <span className="nh-eyebrow nh-h1-kicker">{t.eyebrow}</span>
            {t.title} <em>{t.titleEm}</em>
          </h1>
          <p className="nh-lead">{t.lead}</p>
          <div className="nh-cta-row">
            <a href={BOOK} className="nh-btn nh-btn-gold">{t.book}</a>
            <a href={`tel:${PHONE}`} className="nh-btn nh-btn-ghost">{t.call} 210 346 5554</a>
          </div>
        </section>

        <nav className="nh-chips" aria-label={t.jump}>
          {menu.map((c) => (
            <a key={c.key} href={`#${c.key}`} className="nh-chip">{c.title[lang]}</a>
          ))}
        </nav>

        {menu.map((c) => (
          <section key={c.key} id={c.key} className="nh-menu-section" aria-labelledby={`h-${c.key}`}>
            <h2 id={`h-${c.key}`} className="nh-h2 nh-menu-title">{c.title[lang]}</h2>
            <div className="nh-menu-list">
              {c.services.map((s) => (
                <article key={s.name.el} className="nh-menu-item">
                  <div className="nh-menu-head">
                    <h3 className="nh-menu-name">{s.name[lang]}</h3>
                    <span className="nh-menu-from">{priceLabel(s.options, t)}</span>
                  </div>
                  {s.desc ? <p className="nh-menu-desc">{s.desc[lang]}</p> : null}
                  {s.options.length === 1 && !s.options[0][lang] ? (
                    <p className="nh-menu-meta">{s.options[0].time[lang]}</p>
                  ) : (
                  <ul className="nh-menu-options">
                    {s.options.map((o) => (
                      <li key={`${o.el}-${o.price}`}>
                        <span className="nh-menu-opt">
                          {o[lang] ? `${o[lang]} · ` : ''}
                          <span className="nh-menu-time">{o.time[lang]}</span>
                        </span>
                        <strong>€{o.price}</strong>
                      </li>
                    ))}
                  </ul>
                  )}
                  <a href={BOOK} className="nh-menu-book" aria-label={`${t.bookThis}: ${s.name[lang]}`}>
                    {t.bookThis} →
                  </a>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="nh-notes" aria-labelledby="notes-title">
          <h2 id="notes-title" className="nh-h2 nh-menu-title">{t.notesTitle}</h2>
          <ul>
            {t.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <a href={BOOK} className="nh-btn nh-btn-gold">{t.book}</a>
        </section>
      </main>
    </NhLayout>
  );
};

export default Services;
