import React, { useEffect, useRef, useState } from 'react';
import NhLayout, { BOOK, PHONE, PHONE_DISPLAY, WHATSAPP_URL, REVIEWS_URL, mapLinkProps } from '../components/NhLayout';
import WORK from '../data/work.json';
import { priceText } from '../data/prices';

// /apotelesmata: πραγματικές δουλειές (src/data/work.json), ανά κατηγορία, γραμμένες ώστε να κλείνουν ραντεβού.
// Κάθε δουλειά: τι ήταν, τι έγινε, ημερομηνία, και «Θέλω αυτό το αποτέλεσμα» (WhatsApp με έτοιμο μήνυμα) ή κράτηση.

const MONTHS = {
  el: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

const CATS = {
  allagi: {
    el: { name: 'Αλλαγή χρώματος από μαύρο', short: 'Από μαύρο', text: 'Από μαύρο βαμμένο σε κόκκινο, χάλκινο ή πιο ανοιχτό χρώμα, με ελεγχόμενο ξάνοιγμα.' },
    en: { name: 'Colour change from black', short: 'From black', text: 'From dyed black to red, copper or a lighter colour, with controlled lightening.' }
  },
  diorthosi: {
    el: { name: 'Διόρθωση χρώματος', short: 'Διόρθωση', text: 'Color correction: όταν η βαφή βγήκε σκούρα, ανομοιόμορφη ή σε λάθος τόνο.' },
    en: { name: 'Colour correction', short: 'Correction', text: 'When colour came out too dark, patchy or the wrong tone.' }
  }
};

const content = {
  el: {
    eyebrow: 'Αποτελέσματα · Πριν & μετά',
    titleA: 'Το χρώμα που θέλεις, ',
    titleEm: 'σε πραγματικά μαλλιά.',
    lead: 'Πραγματικές πελάτισσες του κομμωτηρίου, με την ημερομηνία που έγινε κάθε δουλειά. Βρες κάτι που σου μοιάζει και στείλε μας φωτογραφία των μαλλιών σου: σου λέμε τι γίνεται, σε πόσα ραντεβού και πόσο κοστίζει.',
    ctaWa: 'Στείλε φωτογραφία στο WhatsApp',
    ctaBook: 'Κλείσε ραντεβού',
    trust: ['4,6 ★ στο Google', 'L’Oréal Professionnel & Redken', 'Στο Θησείο από το 1992'],
    all: 'Όλα',
    what: 'Τι έγινε',
    want: 'Θέλω αυτό το αποτέλεσμα',
    waHello: 'Γεια σας! Θέλω αλλαγή ή διόρθωση χρώματος. Σας στέλνω φωτογραφία των μαλλιών μου.',
    waMsg: (title) => `Γεια σας! Θέλω αποτέλεσμα σαν το «${title}» που είδα στο site. Σας στέλνω φωτογραφία των μαλλιών μου.`,
    diag: (p) => `Ξεκινά με διάγνωση & strand test ${p}, που αφαιρείται από την τιμή αν κάνεις τη δουλειά σε εμάς.`,
    howEyebrow: 'Πώς δουλεύουμε',
    howTitleA: 'Κανένα ρίσκο, ',
    howTitleEm: 'κανένα μισό αποτέλεσμα.',
    how: [
      ['Διάγνωση & strand test', 'Κοιτάμε το ιστορικό του χρώματος και δοκιμάζουμε σε μια κρυφή τούφα πώς ανοίγει και πώς πιάνει το χρώμα.'],
      ['Πλάνο & γραπτή προσφορά', 'Ξέρεις από πριν τι θα γίνει, πόση ώρα θα πάρει και πόσο κοστίζει. Χωρίς εκπλήξεις στο ταμείο.'],
      ['Το αποτέλεσμα', 'Σε ένα ή σε δύο ραντεβού, ανάλογα με το τι αντέχει η τρίχα. Θα σου το πούμε από τη διάγνωση.']
    ],
    endTitleA: 'Έχεις μαύρο ή μια βαφή που δεν σου αρέσει; ',
    endTitleEm: 'Στείλ’ το μας.',
    endText: 'Μια φωτογραφία στο φως της μέρας, από μπροστά και από πίσω, αρκεί για μια πρώτη γνώμη.',
    call: `Κάλεσε ${PHONE_DISPLAY}`,
    reviews: 'Δες τις κριτικές στο Google',
    more: 'Διόρθωση & αλλαγή χρώματος: πώς γίνεται →',
    moreHref: '/diorthosi-xromatos-athina/'
  },
  en: {
    eyebrow: 'Results · Before & after',
    titleA: 'The colour you want, ',
    titleEm: 'on real hair.',
    lead: 'Real clients of the salon, with the date each job was done. Find one that looks like you and send us a photo of your hair: we’ll tell you what’s possible, in how many appointments and what it costs.',
    ctaWa: 'Send a photo on WhatsApp',
    ctaBook: 'Book an appointment',
    trust: ['4.6 ★ on Google', 'L’Oréal Professionnel & Redken', 'In Thiseio since 1992'],
    all: 'All',
    what: 'What we did',
    want: 'I want this result',
    waHello: 'Hello! I’d like a colour change or correction. I’m sending a photo of my hair.',
    waMsg: (title) => `Hello! I’d like a result like “${title}” from your website. I’m sending a photo of my hair.`,
    diag: (p) => `Starts with an assessment & strand test (${p}), deducted from the price if you book the work with us.`,
    howEyebrow: 'How we work',
    howTitleA: 'No risk, ',
    howTitleEm: 'no half results.',
    how: [
      ['Assessment & strand test', 'We look at your colour history and test a hidden section to see how it lifts and takes colour.'],
      ['Plan & written quote', 'You know beforehand what we’ll do, how long it takes and what it costs. No surprises at the till.'],
      ['The result', 'In one or two appointments, depending on what your hair can take. We’ll tell you at the assessment.']
    ],
    endTitleA: 'Dyed black, or colour you don’t like? ',
    endTitleEm: 'Send it to us.',
    endText: 'A photo in daylight, from the front and the back, is enough for a first opinion.',
    call: `Call ${PHONE_DISPLAY}`,
    reviews: 'Read our Google reviews',
    more: 'Colour correction & change: how it works →',
    moreHref: '/hair-colour-correction-athens/'
  }
};

const wa = (msg) => `${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`;

function LazyVideo({ w, lang }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return undefined;
    if (!('IntersectionObserver' in window)) { v.src = w.src; return undefined; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!v.getAttribute('src')) v.src = w.src;
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } else if (!v.paused) v.pause();
    }, { rootMargin: '150px 0px' });
    io.observe(v);
    return () => io.disconnect();
  }, [w.src]);
  return <video ref={ref} poster={w.poster} width={w.w} height={w.h} muted loop playsInline preload="none" controls aria-label={w[lang].alt} />;
}

export default function Results({ language, setLanguage }) {
  const lang = language === 'en' ? 'en' : 'el';
  const t = content[lang];
  const [cat, setCat] = useState('all');
  const diagPrice = priceText(lang, 'Διόρθωση χρώματος');
  const cats = Object.keys(CATS).filter((k) => WORK.some((w) => w.category === k));
  const shown = WORK.map((w, i) => ({ ...w, n: i + 1 })).filter((w) => cat === 'all' || w.category === cat);

  return (
    <NhLayout language={language} setLanguage={setLanguage}>
      <main id="top" className="nh-rs">
        <header className="nh-rs-hero">
          <figure className="nh-rs-hero-art" aria-hidden="true">
            <img src={WORK[0].poster} width={WORK[0].w} height={WORK[0].h} alt="" decoding="async" />
            <figcaption>{WORK[0][lang].title}</figcaption>
          </figure>
          <span className="nh-rs-eyebrow">{t.eyebrow}</span>
          <h1 className="nh-rs-h1">{t.titleA}<em>{t.titleEm}</em></h1>
          <p className="nh-rs-lead">{t.lead}</p>
          <div className="nh-cta-row">
            <a href={wa(t.waHello)} className="nh-btn nh-btn-gold" target="_blank" rel="noopener">{t.ctaWa}</a>
            <a href={BOOK} className="nh-btn nh-rs-ghost">{t.ctaBook}</a>
          </div>
          <ul className="nh-rs-trust">
            {t.trust.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </header>

        <div className="nh-rs-body">
          <div className="nh-rs-tabs" role="tablist" aria-label={t.eyebrow}>
            <button type="button" role="tab" aria-selected={cat === 'all'} className={cat === 'all' ? 'on' : ''} onClick={() => setCat('all')}>
              {t.all} <span>{WORK.length}</span>
            </button>
            {cats.map((k) => (
              <button key={k} type="button" role="tab" aria-selected={cat === k} className={cat === k ? 'on' : ''} onClick={() => setCat(k)}>
                {CATS[k][lang].name} <span>{WORK.filter((w) => w.category === k).length}</span>
              </button>
            ))}
          </div>
          {cat !== 'all' && <p className="nh-rs-cattext">{CATS[cat][lang].text}</p>}

          <ol className="nh-rs-list">
            {shown.map((w) => {
              const [y, m] = w.date.split('-');
              const x = w[lang];
              return (
                <li key={w.id} className={`nh-rs-case nh-rs-case--${w.type}`} id={w.id}>
                  <div className="nh-rs-media">
                    {w.type === 'video' ? (
                      <LazyVideo w={w} lang={lang} />
                    ) : (
                      <img
                        src={`/images/work/alexandros-hair-salon-thiseio-${w.id}-1200.webp`}
                        srcSet={`/images/work/alexandros-hair-salon-thiseio-${w.id}-600.webp 600w, /images/work/alexandros-hair-salon-thiseio-${w.id}-1200.webp 1200w`}
                        sizes="(max-width: 900px) 100vw, 720px"
                        width={w.w}
                        height={w.h}
                        alt={x.alt}
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                  <div className="nh-rs-info">
                    <div className="nh-rs-top">
                      <span className="nh-rs-no" aria-hidden="true">{String(w.n).padStart(2, '0')}</span>
                      <time dateTime={w.date}>{MONTHS[lang][Number(m) - 1]} {y}</time>
                    </div>
                    <em className={`nh-rs-chip nh-rs-chip--${w.category}`}>{CATS[w.category][lang].name}</em>
                    <h2 className="nh-rs-title">{x.title}</h2>
                    <p className="nh-rs-desc">{x.desc}</p>
                    <span className="nh-rs-what">{t.what}</span>
                    <ol className="nh-rs-steps">
                      {x.steps.map((s) => <li key={s}>{s}</li>)}
                    </ol>
                    <p className="nh-rs-diag">{t.diag(diagPrice)}</p>
                    <div className="nh-rs-actions">
                      <a href={wa(t.waMsg(x.title))} className="nh-btn nh-btn-gold" target="_blank" rel="noopener">{t.want}</a>
                      <a href={BOOK} className="nh-rs-link">{t.ctaBook} →</a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <section className="nh-rs-how" aria-labelledby="rs-how">
          <span className="nh-eyebrow">{t.howEyebrow}</span>
          <h2 id="rs-how" className="nh-h2">{t.howTitleA}<em>{t.howTitleEm}</em></h2>
          <ol className="nh-rs-how-steps">
            {t.how.map(([h, p], i) => (
              <li key={h}>
                <span className="nh-rs-how-n">{String(i + 1).padStart(2, '0')}</span>
                <strong>{h}</strong>
                <p>{p}</p>
              </li>
            ))}
          </ol>
          <a href={t.moreHref} className="nh-underline">{t.more}</a>
        </section>

        <section className="nh-rs-end">
          <h2 className="nh-rs-h2">{t.endTitleA}<em>{t.endTitleEm}</em></h2>
          <p>{t.endText}</p>
          <div className="nh-cta-row">
            <a href={wa(t.waHello)} className="nh-btn nh-btn-gold" target="_blank" rel="noopener">{t.ctaWa}</a>
            <a href={`tel:${PHONE}`} className="nh-btn nh-rs-ghost">{t.call}</a>
          </div>
          <a className="nh-rs-link" {...mapLinkProps(REVIEWS_URL)}>{t.reviews} →</a>
        </section>
      </main>
    </NhLayout>
  );
}
