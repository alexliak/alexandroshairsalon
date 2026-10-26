import React from 'react';
import NhLayout, { BOOK, PHONE } from '../components/NhLayout';
import menu from '../data/menu';
import { priceText, bookUrl, eur, service } from '../data/prices';

// Ίδιο με το svc_anchor() του scripts/build-static-pages.py: σύνδεσμος σε συγκεκριμένη υπηρεσία
const anchor = (s) => s.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const rootPrice = (label, lang) => eur(service('Βαφή ρίζας').options.find((o) => o.el === label).price, lang);

// Services & prices (2026 design). The list itself lives in src/data/menu.js.
const text = {
  el: {
    eyebrow: 'Τιμές κομμωτηρίου · Θησείο, Αθήνα',
    title: 'Τιμές',
    titleEm: 'και χρόνοι.',
    lead: 'Ξέρεις την τιμή πριν καθίσεις. Κάτω από κάθε υπηρεσία γράφουμε τι περιλαμβάνει, για ποιο μήκος και πόσο χρώμα. Ό,τι επιπλέον χρειαστεί είναι κι αυτό γραμμένο εδώ, και μπορείς πάντα να ρωτήσεις πριν ξεκινήσουμε. Ίδιες τιμές στο κομμωτήριο και online.',
    phoneOnly: 'Κλείνεται τηλεφωνικά',
    pickOption: 'Η κράτηση γίνεται από την επιλογή σου.',
    book: 'Κλείσε online',
    call: 'Κάλεσε',
    from: 'από',
    bookThis: 'Κράτηση',
    notesTitle: 'Καλό να ξέρεις',
    footnotes: [
      '* Αν βάφεσαι πρώτη φορά σε εμάς, μπορούμε να κάνουμε δωρεάν τεστ ευαισθησίας πριν από τη βαφή. Δεν χρειάζεται για να κλείσεις ραντεβού.',
      'Κάθε βαφή περιλαμβάνει συγκεκριμένη ποσότητα χρώματος. Αν χρειαστεί περισσότερο, το «+ Επιπλέον χρώμα» (' + eur(service('+ Επιπλέον χρώμα').options[0].price, 'el') + ' ανά 30 g, Redken ' + eur(service('+ Επιπλέον χρώμα').options[1].price, 'el') + ') το συμφωνούμε πριν την εφαρμογή.'
    ],
    notes: [
      'Μηνιαία ρίζα (' + rootPrice('Μηνιαία ρίζα', 'el') + ', χωρίς αμμωνία ' + rootPrice('Χωρίς αμμωνία · μηνιαία ρίζα', 'el') + '): όταν η επόμενη βαφή ρίζας γίνεται μέσα σε 30 ημέρες από την προηγούμενη σε εμάς. Στο ταμείο παίρνεις καρτελάκι με την ημερομηνία.',
      'Στις ανταύγειες και στο μπαλαγιάζ, για μαλλιά κάτω από τους ώμους υπάρχει το «+ Μακριά μαλλιά» (' + priceText('el', '+ Μακριά μαλλιά (ανταύγειες / μπαλαγιάζ)') + ').',
      'Αν έχεις extensions, μπορείς να το σημειώσεις στην κράτηση, για να κρατήσουμε τον σωστό χρόνο.',
      <>Ποια βαφή σού ταιριάζει, τι περιλαμβάνει κάθε υπηρεσία και τι δεν συνδυάζεται: στις <a className="nh-inline-link" href="/syxnes-erotiseis/">Συχνές ερωτήσεις</a>.</>,
      <>Κάτι δεν σου άρεσε; Μπορείς να μας το πεις <a className="nh-inline-link" href="/gnomi/">ανώνυμα εδώ</a>.</>
    ],
    jump: 'Κατηγορίες',
    faq: 'Συχνές ερωτήσεις',
    feedback: 'Η γνώμη σου, ανώνυμα'
  },
  en: {
    eyebrow: 'Hair salon prices · Thiseio, Athens',
    title: 'Prices',
    titleEm: 'and times.',
    lead: 'You know the price before you sit down. Under each service we say what it includes, for which length and how much colour. Anything extra is written here too, and you can always ask before we start. Same prices at the salon and online.',
    phoneOnly: 'Book by phone',
    pickOption: 'Booking starts from your option.',
    book: 'Choose a service ↓',
    call: 'Call',
    from: 'from',
    bookThis: 'Book',
    bookNote: 'Tap any price to book: the booking page opens in Greek with your service already selected, so you only pick a time. Prefer to message us in English? WhatsApp +30 698 131 9000.',
    notesTitle: 'Good to know',
    footnotes: [
      '* If it’s your first colour with us, we can do a free skin test beforehand. You don’t need one to book.',
      'Every colour includes a set amount of product. If more is needed, Extra Colour (' + eur(service('+ Επιπλέον χρώμα').options[0].price, 'en') + ' per 30 g, Redken ' + eur(service('+ Επιπλέον χρώμα').options[1].price, 'en') + ') is agreed before we apply it.'
    ],
    notes: [
      'Monthly Root (' + rootPrice('Μηνιαία ρίζα', 'en') + ', ammonia-free ' + rootPrice('Χωρίς αμμωνία · μηνιαία ρίζα', 'en') + '): when your next root colour is within 30 days of your last one with us. At the desk you get a small card with the date.',
      'For highlights and balayage on hair below the shoulders there is the Long Hair add-on (' + priceText('en', '+ Μακριά μαλλιά (ανταύγειες / μπαλαγιάζ)') + ').',
      'If you wear extensions, you can note it when you book so we reserve the right time.',
      <>Which colour suits you, what each service includes and what can’t be combined: see our <a className="nh-inline-link" href="/syxnes-erotiseis/">FAQ</a>.</>,
      <>Something you didn’t like? You can <a className="nh-inline-link" href="/gnomi/">tell us anonymously here</a>.</>
    ],
    jump: 'Categories',
    faq: 'FAQ',
    feedback: 'Your feedback, anonymously'
  }
};

const priceLabel = (options, t, lang) => {
  const prices = options.map((o) => o.price);
  const min = Math.min(...prices);
  return prices.length > 1 && Math.max(...prices) !== min ? `${t.from} ${eur(min, lang)}` : eur(min, lang);
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
          {t.bookNote ? <p className="nh-help-links">{t.bookNote}</p> : null}
          <div className="nh-cta-row">
            <a href={t.bookNote ? '#haircuts' : BOOK} className="nh-btn nh-btn-gold">{t.book}</a>
            <a href={`tel:${PHONE}`} className="nh-btn nh-btn-ghost">{t.call} 210 346 5554</a>
          </div>
          <p className="nh-help-links">
            <a className="nh-inline-link" href="/syxnes-erotiseis/">{t.faq} →</a>
            <a className="nh-inline-link" href="/gnomi/">{t.feedback} →</a>
          </p>
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
                <article key={s.name.el} id={anchor(s)} className="nh-menu-item">
                  <div className="nh-menu-head">
                    <h3 className="nh-menu-name">{s.name[lang]}</h3>
                    <span className="nh-menu-from">{priceLabel(s.options, t, lang)}</span>
                  </div>
                  {s.desc ? <p className="nh-menu-desc">{s.desc[lang]}</p> : null}
                  {s.note ? <p className="nh-menu-note">{s.note[lang]}</p> : null}
                  {s.faq ? <p className="nh-menu-note"><a className="nh-inline-link" href={s.faq.href}>{s.faq[lang]} →</a></p> : null}
                  {s.options.length === 1 && !s.options[0][lang] ? (
                    <p className="nh-menu-meta">{s.options[0].time[lang]}</p>
                  ) : (
                  <ul className="nh-menu-options">
                    {s.options.map((o) => {
                      const row = (
                        <>
                          <span className="nh-menu-opt">
                            {o[lang] ? `${o[lang]} · ` : ''}
                            <span className="nh-menu-time">{o.time[lang]}</span>
                          </span>
                          <strong>{eur(o.price, lang)}{s.options.length > 1 && bookUrl(o) ? ' →' : ''}</strong>
                        </>
                      );
                      return (
                        <li key={`${o.el}-${o.price}`}>
                          {s.options.length > 1 && bookUrl(o) ? (
                            <a className="nh-menu-optlink" href={bookUrl(o)} target="_blank" rel="noopener" aria-label={`${t.bookThis}: ${s.name[lang]} · ${o[lang]}`}>{row}</a>
                          ) : row}
                        </li>
                      );
                    })}
                  </ul>
                  )}
                  {s.online === false ? (
                    <a href={`tel:${PHONE}`} className="nh-menu-book" aria-label={`${t.phoneOnly}: ${s.name[lang]}`}>
                      {t.phoneOnly} →
                    </a>
                  ) : s.options.length > 1 ? (
                    <p className="nh-menu-pick">{t.pickOption}</p>
                  ) : (
                    <a href={bookUrl(s.options[0]) || BOOK} className="nh-menu-book" target="_blank" rel="noopener" aria-label={`${t.bookThis}: ${s.name[lang]}`}>
                      {t.bookThis} →
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="nh-notes" aria-labelledby="notes-title">
          <h2 id="notes-title" className="nh-h2 nh-menu-title">{t.notesTitle}</h2>
          <ul>
            {t.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
          {t.footnotes.map((f) => (
            <p key={f} className="nh-footnote" style={{ fontSize: '0.82em', opacity: 0.75, margin: '0 0 8px' }}>{f}</p>
          ))}
          <div style={{ height: 10 }} />
          <a href={BOOK} className="nh-btn nh-btn-gold">{t.book}</a>
        </section>
      </main>
    </NhLayout>
  );
};

export default Services;
