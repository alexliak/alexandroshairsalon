import React, { useEffect, useRef } from 'react';
import WORK from '../data/work.json';

// Πρόσφατα αποτελέσματα (src/data/work.json, ίδια πηγή με τις σελίδες χρώματος).
// Το βίντεο φορτώνει και παίζει μόνο όταν φανεί στην οθόνη, ώστε η αρχική να μένει γρήγορη.
const MONTHS = {
  el: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

function When({ date, lang }) {
  const [y, m] = date.split('-');
  return <time dateTime={date}>{MONTHS[lang][Number(m) - 1]} {y}</time>;
}

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
    }, { rootMargin: '200px 0px' });
    io.observe(v);
    return () => io.disconnect();
  }, [w.src]);
  return (
    <video ref={ref} poster={w.poster} width={w.w} height={w.h} muted loop playsInline preload="none" aria-label={w[lang].alt} />
  );
}

export default function WorkStrip({ language = 'el', href }) {
  const lang = language === 'en' ? 'en' : 'el';
  return (
    <div className="nh-work">
      {WORK.map((w) => (
        <figure key={w.id} className={`nh-work-item nh-work-item--${w.type}`}>
          <a href={href} className="nh-work-media" aria-label={w[lang].title}>
            {w.type === 'video' ? (
              <LazyVideo w={w} lang={lang} />
            ) : (
              <img
                src={`/images/work/alexandros-hair-salon-thiseio-${w.id}-600.webp`}
                srcSet={`/images/work/alexandros-hair-salon-thiseio-${w.id}-600.webp 600w, /images/work/alexandros-hair-salon-thiseio-${w.id}-1200.webp 1200w`}
                sizes="(max-width: 820px) 80vw, 560px"
                width={w.w}
                height={w.h}
                alt={w[lang].alt}
                loading="lazy"
                decoding="async"
              />
            )}
          </a>
          <figcaption>
            <When date={w.date} lang={lang} />
            <strong>{w[lang].title}</strong>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
