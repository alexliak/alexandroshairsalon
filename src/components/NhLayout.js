import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FaWhatsapp, FaViber, FaPhoneAlt, FaArrowUp, FaMapMarkerAlt } from 'react-icons/fa';
import { Link, NavLink, useLocation } from '../lib/router';
import { themeMode, setThemeMode } from '../lib/themeBoot';

// Shared 2026 layout: header, footer and mobile booking bar for the new pages.
// Every booking button goes to /kratisi/ (Treatwell widget, no first-visit commission).
export const BOOK = '/kratisi/';
export const PHONE = '+302103465554';
export const PHONE_DISPLAY = '210 346 5554';
// Mobile: call, WhatsApp, Viber, FaceTime
export const MOBILE = '+306981319000';
export const MOBILE_DISPLAY = '698 131 9000';
export const WHATSAPP_URL = 'https://wa.me/306981319000';
export const VIBER_URL = 'viber://chat?number=%2B306981319000';
export const FACETIME_URL = 'facetime:+306981319000';
// Google: Place ID του κομμωτηρίου στο Google Maps (Business Profile).
export const PLACE_ID = 'ChIJjfF5DyC9oRQRtDI_YyhNAgM';
const PLACE_QUERY = encodeURIComponent('Alexandros Hair Salon, Ερυσίχθονος 3-5, Αθήνα 118 51');
// Google Business Profile: ο ιδιοκτήτης κρατά εκεί το πραγματικό ωράριο.
// Μορφή «Maps URLs» (api=1): στο κινητό ανοίγει κατευθείαν η εφαρμογή Google Maps, αλλιώς το Maps στον browser.
export const GOOGLE_PROFILE_URL = `https://www.google.com/maps/search/?api=1&query=${PLACE_QUERY}&query_place_id=${PLACE_ID}`;
// Οδηγίες μέχρι το κομμωτήριο από εκεί που βρίσκεται ο επισκέπτης (η εφαρμογή διαλέγει πόδια/μετρό/αυτοκίνητο).
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${PLACE_QUERY}&destination_place_id=${PLACE_ID}`;
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${PLACE_QUERY}&z=16&output=embed`;

/**
 * Props για σύνδεσμο προς Google Maps.
 * Υπολογιστής: νέα καρτέλα. Κινητό/tablet: ίδια καρτέλα, ώστε το σύστημα να δώσει τον σύνδεσμο
 * κατευθείαν στην εφαρμογή Google Maps (με νέα καρτέλα άνοιγε πρώτα ο browser και μετά ρωτούσε για την εφαρμογή).
 */
export function mapLinkProps(href) {
  return {
    href,
    target: '_blank',
    rel: 'noopener noreferrer',
    onClick: (e) => {
      if (typeof window === 'undefined' || !window.matchMedia) return;
      if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        e.preventDefault();
        window.location.href = href;
      }
    }
  };
}


// Διακόπτης εμφάνισης στο υποσέλιδο: Αυτόματο (ρύθμιση συσκευής) / Ανοιχτό / Σκούρο. Η επιλογή μένει στη συσκευή.
function ThemeSwitch({ t }) {
  const [mode, setMode] = useState('auto');
  useEffect(() => {
    const sync = () => setMode(themeMode());
    sync();
    window.addEventListener('ahs-theme', sync);
    return () => window.removeEventListener('ahs-theme', sync);
  }, []);
  return (
    <div className="nh-theme-switch" role="radiogroup" aria-label={t.theme}>
      <span className="nh-theme-label" aria-hidden="true">{t.theme}</span>
      {t.themeOpts.map(([value, label, hint]) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={mode === value}
          className={`nh-theme-opt${mode === value ? ' is-on' : ''}`}
          title={hint || label}
          onClick={() => setThemeMode(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const layoutText = {
  el: {
    nav: [
      { label: 'Υπηρεσίες & τιμές', to: '/services' },
      { label: 'L’Oréal & Redken', href: '/#brands' },
      { label: 'Ωράριο', to: '/hours' },
      { label: 'Shop', to: '/shop' },
      { label: 'Γίνε μοντέλο', to: '/montela', promo: true },
      { label: 'We are hiring', to: '/douleia', hiring: true }
    ],
    menu: 'Κύριο μενού',
    city: 'Θησείο',
    book: 'Κλείσε ραντεβού',
    mobileBarTop: 'Online κράτηση',
    mobileBarBottom: 'σε 1 λεπτό',
    mobileBarCta: 'Κλείσε ραντεβού',
    footerShop: 'Online Shop',
    footerHours: 'Ωράριο στο Google',
    theme: 'Εμφάνιση',
    themeOpts: [['auto', 'Αυτόματο', 'Όπως η συσκευή σου'], ['light', 'Ανοιχτό', ''], ['dark', 'Σκούρο', '']],
    footerJobs: 'Δουλειά μαζί μας',
    footerModels: 'Γίνε μοντέλο μας',
    langSwitch: 'EN',
    langAria: 'Switch to English',
    skip: 'Μετάβαση στο περιεχόμενο',
    contactNav: 'Επικοινωνία στο κινητό',
    callSalon: 'Κλήση στο κομμωτήριο 210 346 5554',
    findUs: 'Πού θα μας βρεις: άνοιγμα στο Google Maps',
    whatsapp: 'Μήνυμα στο WhatsApp',
    viber: 'Μήνυμα στο Viber',
    facetime: 'Κλήση FaceTime',
    toTop: 'Επιστροφή στην κορυφή',
    seoNav: 'Υπηρεσίες κομμωτηρίου',
    seoLinks: [
      ['Κούρεμα στην Αθήνα', '/kourema-athina/'],
      ['Βαφή μαλλιών στην Αθήνα', '/vafi-mallion-athina/'],
      ['Balayage στην Αθήνα', '/balayage-athina/'],
      ['Κράτηση online', '/kratisi/']
    ]
  },
  en: {
    nav: [
      { label: 'Services & prices', to: '/services' },
      { label: 'L’Oréal & Redken', href: '/#brands' },
      { label: 'Hours', to: '/hours' },
      { label: 'Shop', to: '/shop' },
      { label: 'Be our model', to: '/montela', promo: true },
      { label: 'We are hiring', to: '/douleia', hiring: true }
    ],
    menu: 'Main menu',
    city: 'Thiseio',
    book: 'Book now',
    mobileBarTop: 'Book online',
    mobileBarBottom: 'in 1 minute',
    mobileBarCta: 'Book now',
    footerShop: 'Online Shop',
    footerHours: 'Hours on Google',
    theme: 'Appearance',
    themeOpts: [['auto', 'Auto', 'Same as your device'], ['light', 'Light', ''], ['dark', 'Dark', '']],
    footerJobs: 'We are hiring',
    footerModels: 'Be our model',
    langSwitch: 'EL',
    langAria: 'Αλλαγή στα Ελληνικά',
    skip: 'Skip to content',
    contactNav: 'Contact on mobile',
    callSalon: 'Call the salon 210 346 5554',
    findUs: 'Find us: open in Google Maps',
    whatsapp: 'Message on WhatsApp',
    viber: 'Message on Viber',
    facetime: 'FaceTime call',
    toTop: 'Back to top',
    seoNav: 'Salon services',
    seoLinks: [
      ['Haircut in Athens', '/kourema-athina/'],
      ['Hair colour in Athens', '/vafi-mallion-athina/'],
      ['Balayage in Athens', '/balayage-athina/'],
      ['Book online', '/kratisi/']
    ]
  }
};

// Η οριζόντια μπάρα του κινητού θυμάται πού την άφησε ο επισκέπτης ανάμεσα στις σελίδες
let subnavScrollLeft = 0;

const NhLayout = ({ language, setLanguage, children, headerExtra, mobileBar }) => {
  const t = layoutText[language] || layoutText.el;
  const other = language === 'el' ? 'en' : 'el';
  const { pathname, hash } = useLocation();

  // Start each page at the top. With an #anchor (e.g. /#brands), glide to that section instead.
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return undefined; }
    const id = decodeURIComponent(hash.slice(1));
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  // Κινητό: η μπάρα μένει ακριβώς εκεί που την άφησε ο επισκέπτης όταν αλλάζει σελίδα
  // (επαναφορά πριν ζωγραφιστεί η οθόνη, χωρίς άλμα). Μόνο αν η ενεργή επιλογή είναι
  // εκτός οθόνης, γλιστράει απαλά ώστε να φανεί.
  const subnavRef = useRef(null);
  useLayoutEffect(() => {
    const nav = subnavRef.current;
    if (!nav) return undefined;
    nav.scrollLeft = subnavScrollLeft;
    const active = nav.querySelector('.is-active');
    if (!active) return undefined;
    const left = active.offsetLeft;
    const right = left + active.offsetWidth;
    const pad = 16;
    if (left >= nav.scrollLeft + pad && right <= nav.scrollLeft + nav.clientWidth - pad) return undefined;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = Math.max(0, left - (nav.clientWidth - active.offsetWidth) / 2);
    const raf = requestAnimationFrame(() => nav.scrollTo({ left: target, behavior: reduce ? 'auto' : 'smooth' }));
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);
  const onSubnavScroll = (e) => { subnavScrollLeft = e.currentTarget.scrollLeft; };
  // Πάτημα ξανά στην ίδια άγκυρα (π.χ. L’Oréal & Redken ενώ ήδη είσαι εκεί): ξαναπήγαινε στην ενότητα
  const reTap = (href) => {
    const i = href.indexOf('#');
    if (i < 0 || pathname !== '/' || hash !== href.slice(i)) return;
    const el = document.getElementById(href.slice(i + 1));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Κινητό/tablet: η μπάρα με τις επιλογές κρύβεται όταν κατεβαίνεις και ξαναβγαίνει μόλις ανέβεις,
  // ώστε να μένει περισσότερη οθόνη για το περιεχόμενο (η κεφαλίδα και το «Κλείσε ραντεβού» μένουν πάντα).
  const [subTucked, setSubTucked] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 140 || y < last - 6) setSubTucked(false);
        else if (y > last + 6) setSubTucked(true);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setSubTucked(false); }, [pathname]);

  // Show the back-to-top button after the visitor has scrolled down
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    const target = document.getElementById('nh-main');
    if (target) target.focus({ preventScroll: true });
  };

  const icons = [
    { href: DIRECTIONS_URL, label: t.findUs, Icon: FaMapMarkerAlt, cls: 'is-map', map: true },
    { href: `tel:${PHONE}`, label: t.callSalon, Icon: FaPhoneAlt, cls: 'is-call' },
    { href: WHATSAPP_URL, label: t.whatsapp, Icon: FaWhatsapp, cls: 'is-wa', external: true },
    { href: VIBER_URL, label: t.viber, Icon: FaViber, cls: 'is-viber' }
  ];

  return (
    <div className={`nh${subTucked ? ' is-sub-tucked' : ''}`} lang={language}>
      <a href="#nh-main" className="nh-skip">{t.skip}</a>
      <header className="nh-header">
        <Link to="/" className="nh-logo" aria-label="Alexandros Hair Salon">
          <span className="nh-logo-name">Alexandros</span>
          <span className="nh-logo-sub">Hair Salon · {t.city}</span>
        </Link>
        <nav className="nh-nav" aria-label={t.menu}>
          {t.nav.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => `nh-nav-link${item.hiring ? ' nh-nav-hiring' : ''}${item.promo ? ' nh-nav-promo' : ''}${isActive ? ' is-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ) : (
              <Link key={item.label} to={item.href} onClick={() => reTap(item.href)} className={`nh-nav-link${pathname === '/' && hash && item.href.endsWith(hash) ? ' is-active' : ''}`}>
                {item.label}
              </Link>
            )
          )}
        </nav>
        <div className="nh-header-actions">
          <nav className="nh-icons" aria-label={t.contactNav}>
            {icons.map(({ href, label, Icon, cls, external, map }) => (
              <a
                key={cls}
                href={href}
                className={`nh-icon ${cls}`}
                aria-label={label}
                title={label}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                {...(map ? mapLinkProps(href) : {})}
              >
                <Icon aria-hidden="true" focusable="false" />
              </a>
            ))}
          </nav>
          {headerExtra}
          <button type="button" className="nh-lang" onClick={() => setLanguage(other)} aria-label={t.langAria}>
            {t.langSwitch}
          </button>
          <a href={BOOK} className="nh-btn nh-btn-gold nh-btn-sm">{t.book}</a>
        </div>
      </header>

      <nav className={`nh-subnav${subTucked ? ' is-tucked' : ''}`} aria-label={t.menu} ref={subnavRef} onScroll={onSubnavScroll}>
        {[...t.nav.filter((i) => i.hiring || i.promo), ...t.nav.filter((i) => !i.hiring && !i.promo)].map((item) =>
          item.to ? (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => `nh-subnav-link${item.hiring ? ' nh-nav-hiring' : ''}${item.promo ? ' nh-nav-promo' : ''}${isActive ? ' is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ) : (
            <Link key={item.label} to={item.href} onClick={() => reTap(item.href)} className={`nh-subnav-link${pathname === '/' && hash && item.href.endsWith(hash) ? ' is-active' : ''}`}>
              {item.label}
            </Link>
          )
        )}
      </nav>

      <div id="nh-main" tabIndex="-1" className="nh-main">{children}</div>

      <footer className="nh-footer">
        <span>© {new Date().getFullYear()} Alexandros Hair Salon · {t.city}</span>
        <span className="nh-footer-links">
          <Link to="/shop">{t.footerShop}</Link>
          <Link to="/douleia">{t.footerJobs}</Link>
          <Link to="/montela">{t.footerModels}</Link>
          <a {...mapLinkProps(GOOGLE_PROFILE_URL)}>{t.footerHours}</a>
          <a href="https://www.facebook.com/alexandros.hairsalon" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href={VIBER_URL}>Viber</a>
        </span>
        <ThemeSwitch t={t} />
        <nav className="nh-footer-seo" aria-label={t.seoNav}>
          {t.seoLinks.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
      </footer>

      <button
        type="button"
        className={`nh-top${showTop ? ' is-visible' : ''}`}
        onClick={toTop}
        aria-label={t.toTop}
        title={t.toTop}
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
      >
        <FaArrowUp aria-hidden="true" focusable="false" />
      </button>

      {mobileBar || (
        <div className="nh-mobile-bar">
          <span className="nh-mobile-bar-text">
            <span>{t.mobileBarTop}</span>
            <strong>{t.mobileBarBottom}</strong>
          </span>
          <a href={BOOK} className="nh-btn nh-btn-gold nh-btn-sm">{t.mobileBarCta}</a>
        </div>
      )}
    </div>
  );
};

export default NhLayout;
