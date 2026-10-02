import React, { useEffect, useState } from 'react';
import { FaWhatsapp, FaViber, FaPhoneAlt, FaArrowUp, FaMapMarkerAlt } from 'react-icons/fa';
import { Link, NavLink, useLocation } from 'react-router-dom';
import '../pages/Home.css';

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
// Google Business Profile: the owner keeps the real opening hours here.
export const GOOGLE_PROFILE_URL =
  'https://www.google.com/maps/place/alexandroshairsalon/@37.976933,23.7162736,17z/data=!3m1!4b1!4m6!3m5!1s0x14a1bd200f79f18d:0x3024d28633f32b4!8m2!3d37.976933!4d23.7162736!16s%2Fg%2F11cm0h21cx';
export const MAP_EMBED_URL =
  'https://www.google.com/maps?q=Alexandros%20Hair%20Salon%20%CE%95%CF%81%CF%85%CF%83%CE%AF%CF%87%CE%B8%CE%BF%CE%BD%CE%BF%CF%82%203%20%CE%91%CE%B8%CE%AE%CE%BD%CE%B1&output=embed';

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
    mobileBarTop: 'Θησείο',
    mobileBarBottom: 'από το 1992',
    mobileBarCta: 'Κλείσε ραντεβού',
    footerShop: 'Online Shop',
    footerHours: 'Ωράριο στο Google',
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
    mobileBarTop: 'Thiseio',
    mobileBarBottom: 'since 1992',
    mobileBarCta: 'Book now',
    footerShop: 'Online Shop',
    footerHours: 'Hours on Google',
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

const NhLayout = ({ language, setLanguage, children, headerExtra, mobileBar }) => {
  const t = layoutText[language] || layoutText.el;
  const other = language === 'el' ? 'en' : 'el';
  const { pathname, hash } = useLocation();

  // Start each page at the top (keep #anchors working)
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

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
    { href: GOOGLE_PROFILE_URL, label: t.findUs, Icon: FaMapMarkerAlt, cls: 'is-map', external: true },
    { href: `tel:${PHONE}`, label: t.callSalon, Icon: FaPhoneAlt, cls: 'is-call' },
    { href: WHATSAPP_URL, label: t.whatsapp, Icon: FaWhatsapp, cls: 'is-wa', external: true },
    { href: VIBER_URL, label: t.viber, Icon: FaViber, cls: 'is-viber' }
  ];

  return (
    <div className="nh" lang={language}>
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
              <a key={item.label} href={item.href} className="nh-nav-link">
                {item.label}
              </a>
            )
          )}
        </nav>
        <div className="nh-header-actions">
          <nav className="nh-icons" aria-label={t.contactNav}>
            {icons.map(({ href, label, Icon, cls, external }) => (
              <a
                key={cls}
                href={href}
                className={`nh-icon ${cls}`}
                aria-label={label}
                title={label}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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

      <nav className="nh-subnav" aria-label={t.menu}>
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
            <a key={item.label} href={item.href} className="nh-subnav-link">
              {item.label}
            </a>
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
          <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">{t.footerHours}</a>
          <a href="https://www.facebook.com/alexandros.hairsalon" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href={VIBER_URL}>Viber</a>
        </span>
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
