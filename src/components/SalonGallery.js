import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SALON_PHOTOS } from '../data/gallery';

// Φωτογραφίες του χώρου: ήρεμο, «εκδοτικό» πλέγμα (μεγάλη + μικρότερες), χωρίς εφέ.
// Πάτημα σε φωτογραφία → μεγάλη προβολή (<dialog>) με προηγούμενη/επόμενη, βελάκια πληκτρολογίου και Esc.
// Οι εικόνες φορτώνουν μόνο όταν πλησιάσουν στην οθόνη (loading="lazy") σε μέγεθος ανάλογο της οθόνης.

const label = {
  el: { open: 'Μεγέθυνση', close: 'Κλείσιμο', prev: 'Προηγούμενη', next: 'Επόμενη', of: 'από' },
  en: { open: 'Enlarge', close: 'Close', prev: 'Previous', next: 'Next', of: 'of' }
};

export default function SalonGallery({ language = 'el', names, variant = 'full' }) {
  const L = language === 'en' ? 'en' : 'el';
  const t = label[L];
  const photos = names ? names.map((n) => SALON_PHOTOS.find((p) => p.name === n)).filter(Boolean) : SALON_PHOTOS;
  const [open, setOpen] = useState(-1);
  const dlg = useRef(null);

  const show = useCallback((i) => {
    setOpen(i);
    const d = dlg.current;
    if (d && !d.open) {
      if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    }
  }, []);
  const close = useCallback(() => {
    const d = dlg.current;
    if (d && d.open) { if (typeof d.close === 'function') d.close(); else d.removeAttribute('open'); }
    setOpen(-1);
  }, []);
  const step = useCallback((k) => setOpen((i) => (i + k + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    if (open < 0) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, step]);

  const cur = open >= 0 ? photos[open] : null;
  const sizes = variant === 'teaser'
    ? '(max-width: 820px) 86vw, (max-width: 1400px) 60vw, 860px'
    : '(max-width: 820px) 100vw, 50vw';

  return (
    <>
      <div className={`nh-gallery nh-gallery--${variant}`}>
        {photos.map((p, i) => (
          <figure key={p.name} className="nh-gallery-item">
            <button type="button" className="nh-gallery-btn" onClick={() => show(i)} aria-label={`${t.open}: ${p[L].cap}`}>
              <img
                src={p.small}
                srcSet={p.srcSet}
                sizes={sizes}
                width={p.w}
                height={p.h}
                alt={p[L].alt}
                loading="lazy"
                decoding="async"
              />
            </button>
            <figcaption>{p[L].cap}</figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dlg}
        className="nh-lightbox"
        aria-label={cur ? cur[L].cap : t.open}
        onClose={() => setOpen(-1)}
        onClick={(e) => { if (e.target === dlg.current) close(); }}
      >
        {cur && (
          <figure className="nh-lightbox-fig">
            <img src={cur.src} width={cur.w} height={cur.h} alt={cur[L].alt} />
            <figcaption>
              <span>{cur[L].cap}</span>
              <span className="nh-lightbox-count">{open + 1} {t.of} {photos.length}</span>
            </figcaption>
          </figure>
        )}
        <button type="button" className="nh-lightbox-btn nh-lightbox-close" onClick={close} aria-label={t.close}>×</button>
        {photos.length > 1 && (
          <>
            <button type="button" className="nh-lightbox-btn nh-lightbox-prev" onClick={() => step(-1)} aria-label={t.prev}>‹</button>
            <button type="button" className="nh-lightbox-btn nh-lightbox-next" onClick={() => step(1)} aria-label={t.next}>›</button>
          </>
        )}
      </dialog>
    </>
  );
}
