import React, { useEffect, useRef } from 'react';
import WORK from '../data/work.json';

// «Αποτελέσματα»: σκοτεινή, γκλάμουρ σκηνή με ξεχωριστές κάρτες (01, 02, 03…), μία ανά δουλειά.
// Πηγή: src/data/work.json (ίδια με τις σελίδες χρώματος). Το βίντεο φορτώνει/παίζει μόνο όταν φανεί.
const MONTHS = {
  el: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

const text = {
  el: {
    eyebrow: 'Αποτελέσματα · Πριν & μετά',
    titleA: 'Δουλειές από το ',
    titleEm: 'Θησείο.',
    lead: 'Κάθε κάρτα είναι μία πελάτισσα και μία δουλειά, με την ημερομηνία που έγινε.',
    cta: 'Κλείσε χρώμα',
    more: 'Διόρθωση & αλλαγή χρώματος →',
    href: '/diorthosi-xromatos-athina/',
    prev: 'Προηγούμενο', next: 'Επόμενο'
  },
  en: {
    eyebrow: 'Results · Before & after',
    titleA: 'Work from ',
    titleEm: 'Thiseio.',
    lead: 'Each card is one client and one piece of work, with the date it was done.',
    cta: 'Book colour',
    more: 'Colour correction & change →',
    href: '/hair-colour-correction-athens/',
    prev: 'Previous', next: 'Next'
  }
};

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
  return <video ref={ref} poster={w.poster} width={w.w} height={w.h} muted loop playsInline preload="none" aria-label={w[lang].alt} />;
}

export default function WorkStrip({ language = 'el', book }) {
  const lang = language === 'en' ? 'en' : 'el';
  const t = text[lang];
  const rail = useRef(null);
  const go = (k) => {
    const r = rail.current;
    if (r) r.scrollBy({ left: k * Math.max(280, r.clientWidth * 0.6), behavior: 'smooth' });
  };

  return (
    <section className="nh-results" aria-labelledby="results-title">
      <div className="nh-results-head">
        <div>
          <span className="nh-results-eyebrow">{t.eyebrow}</span>
          <h2 id="results-title" className="nh-results-title">{t.titleA}<em>{t.titleEm}</em></h2>
          <p className="nh-results-lead">{t.lead}</p>
        </div>
        <div className="nh-results-nav">
          <button type="button" onClick={() => go(-1)} aria-label={t.prev}>‹</button>
          <button type="button" onClick={() => go(1)} aria-label={t.next}>›</button>
        </div>
      </div>

      <ol className="nh-results-rail" ref={rail}>
        {WORK.map((w, i) => {
          const [y, m] = w.date.split('-');
          return (
            <li key={w.id} className={`nh-res nh-res--${w.type}`}>
              <div className="nh-res-top">
                <span className="nh-res-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <time dateTime={w.date}>{MONTHS[lang][Number(m) - 1]} {y}</time>
              </div>
              <div className="nh-res-media">
                {w.type === 'video' ? (
                  <LazyVideo w={w} lang={lang} />
                ) : (
                  <img
                    src={`/images/work/alexandros-hair-salon-thiseio-${w.id}-1200.webp`}
                    srcSet={`/images/work/alexandros-hair-salon-thiseio-${w.id}-600.webp 600w, /images/work/alexandros-hair-salon-thiseio-${w.id}-1200.webp 1200w`}
                    sizes="(max-width: 820px) 86vw, 640px"
                    width={w.w}
                    height={w.h}
                    alt={w[lang].alt}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
              <div className="nh-res-cap">
                <strong>{w[lang].title}</strong>
                <span>{w[lang].desc}</span>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="nh-results-foot">
        <a href={book} className="nh-btn nh-btn-gold">{t.cta}</a>
        <a href={t.href} className="nh-results-more">{t.more}</a>
      </div>
    </section>
  );
}
