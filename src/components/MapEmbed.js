import React, { useEffect, useRef, useState } from 'react';
import { DIRECTIONS_URL, MAP_EMBED_URL, mapLinkProps } from './NhLayout';

// Χάρτης χωρίς καθυστέρηση.
// Ο ενσωματωμένος χάρτης της Google κατεβάζει ~1 MB JavaScript και στο κινητό «κλέβει» το σύρσιμο της σελίδας.
// Γι' αυτό εμφανίζεται πρώτα ένα ελαφρύ σχέδιο της γειτονιάς (SVG, μηδέν αιτήματα) με δύο κουμπιά:
//   «Οδηγίες»: ανοίγει κατευθείαν την εφαρμογή Google Maps με διαδρομή μέχρι το κομμωτήριο
//   «Χάρτης εδώ»: φορτώνει τον πραγματικό χάρτη μέσα στη σελίδα
// Σε υπολογιστή ο πραγματικός χάρτης φορτώνει μόνος του λίγο πριν φανεί στην οθόνη.

const text = {
  el: {
    title: 'Χάρτης: Alexandros Hair Salon',
    directions: 'Οδηγίες',
    load: 'Χάρτης εδώ',
    caption: 'Ερυσίχθονος 3-5 · 5′ από το μετρό Θησείο',
    metro: 'Μ Θησείο',
    area: 'ΘΗΣΕΙΟ',
    acropolis: 'Ακρόπολη'
  },
  en: {
    title: 'Map: Alexandros Hair Salon',
    directions: 'Directions',
    load: 'Show map',
    caption: 'Erisichthonos 3-5 · 5′ from Thiseio metro',
    metro: 'M Thiseio',
    area: 'THISEIO',
    acropolis: 'Acropolis'
  }
};

const Sketch = ({ t }) => (
  <svg className="nh-mapsketch-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="nhMapGlow" cx="58%" cy="46%" r="40%">
        <stop offset="0" stopColor="var(--nh-gold)" stopOpacity="0.22" />
        <stop offset="1" stopColor="var(--nh-gold)" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="300" fill="url(#nhMapGlow)" />
    {/* Απλά, διακοσμητικά οικοδομικά τετράγωνα της γειτονιάς — όχι ακριβής χάρτης */}
    <g fill="none" stroke="var(--nh-line-strong)" strokeWidth="1">
      <path d="M-10 70 L180 40 L420 66" />
      <path d="M-10 150 L150 128 L232 138 L420 120" />
      <path d="M-10 236 L170 214 L420 232" />
      <path d="M60 -10 L84 310" />
      <path d="M150 -10 L150 128 L170 214 L180 310" />
      <path d="M300 -10 L286 130 L310 310" />
    </g>
    <g fill="none" stroke="var(--nh-line)" strokeWidth="0.8">
      <path d="M-10 108 L420 92" />
      <path d="M-10 196 L420 178" />
      <path d="M110 -10 L124 310" />
      <path d="M232 -10 L232 138 L248 310" />
      <path d="M352 -10 L346 310" />
    </g>
    {/* Γραμμή μετρό και στάση Θησείο */}
    <path d="M20 300 C 70 250, 90 210, 112 168 S 150 90, 170 -10" fill="none" stroke="var(--nh-gold)" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="5 5" />
    <circle cx="112" cy="168" r="6" fill="var(--nh-surface)" stroke="var(--nh-gold)" strokeWidth="1.6" />
    <text x="124" y="186" fontSize="11" fill="var(--nh-muted)" fontFamily="var(--nh-sans)">{t.metro}</text>
    {/* Ακρόπολη, νοτιοανατολικά */}
    <path d="M318 206 q 26 -22 52 0" fill="none" stroke="var(--nh-line-strong)" strokeWidth="1" />
    <text x="312" y="224" fontSize="10" fill="var(--nh-muted)" fontFamily="var(--nh-sans)">{t.acropolis}</text>
    <text x="20" y="96" fontSize="10" letterSpacing="4" fill="var(--nh-muted)" fontFamily="var(--nh-sans)">{t.area}</text>
    {/* Το κομμωτήριο */}
    <circle cx="232" cy="138" r="22" fill="var(--nh-gold)" fillOpacity="0.12" />
    <path d="M232 150 c -10 -12 -15 -20 -15 -27 a 15 15 0 0 1 30 0 c 0 7 -5 15 -15 27 z" fill="var(--nh-gold)" />
    <circle cx="232" cy="123" r="5" fill="var(--nh-surface)" />
    <text x="254" y="134" fontSize="15" fontStyle="italic" fill="var(--nh-text)" fontFamily="var(--nh-serif)">Alexandros</text>
    <text x="254" y="150" fontSize="9" letterSpacing="2.5" fill="var(--nh-muted)" fontFamily="var(--nh-sans)">HAIR SALON</text>
  </svg>
);

export default function MapEmbed({ language = 'el', className = '' }) {
  const t = text[language] || text.el;
  const [live, setLive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (live || typeof window === 'undefined') return undefined;
    const touch = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (touch || !('IntersectionObserver' in window) || !ref.current) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setLive(true); io.disconnect(); }
    }, { rootMargin: '300px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [live]);

  return (
    <div ref={ref} className={`nh-map ${className}`.trim()}>
      {live ? (
        <iframe title={t.title} src={MAP_EMBED_URL} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <div className="nh-mapsketch">
          <Sketch t={t} />
          <div className="nh-mapsketch-bar">
            <span className="nh-mapsketch-cap">{t.caption}</span>
            <div className="nh-mapsketch-actions">
              <a className="nh-btn nh-btn-gold nh-btn-sm" {...mapLinkProps(DIRECTIONS_URL)}>{t.directions}</a>
              <button type="button" className="nh-btn nh-btn-ghost nh-btn-sm" onClick={() => setLive(true)}>{t.load}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
