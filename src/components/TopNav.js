import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  PhoneOutlined,
  EnvironmentOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons';
import AccessibilityControls from './AccessibilityControls';
import './TopNav.css';

const MAPS_URL =
  'https://www.google.com/maps/place/alexandroshairsalon/@37.976933,23.7162736,17z/data=!3m1!4b1!4m6!3m5!1s0x14a1bd200f79f18d:0x3024d28633f32b4!8m2!3d37.976933!4d23.7162736!16s%2Fg%2F11cm0h21cx?entry=ttu';

const navLabels = {
  en: {
    home: 'Home',
    services: 'Services & Prices',
    hours: 'Opening Hours',
    shop: 'Online Shop',
    findUs: 'Find Us',
    book: 'Book Appointment',
    menu: 'Open menu',
    closeMenu: 'Close menu'
  },
  el: {
    home: 'Αρχική',
    services: 'Υπηρεσίες & Τιμές',
    hours: 'Ωράριο',
    shop: 'Online Shop',
    findUs: 'Πού θα μας βρείτε',
    book: 'Κλείσε Ραντεβού',
    menu: 'Άνοιγμα μενού',
    closeMenu: 'Κλείσιμο μενού'
  }
};

const languageOptions = [
  { value: 'en', label: 'EN' },
  { value: 'el', label: 'EL' }
];

const TopNav = ({ language, setLanguage, accessibility, onToggleAccessibility }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const labels = navLabels[language];
  const isGreek = language === 'el';
  const logoSrc = `${process.env.PUBLIC_URL}/images/logo.jpg`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const getLangAria = (value) => {
    if (value === 'en') {
      return isGreek ? 'Αλλαγή γλώσσας στα Αγγλικά' : 'Switch language to English';
    }
    return isGreek ? 'Αλλαγή γλώσσας στα Ελληνικά' : 'Switch language to Greek';
  };

  const navItems = (
    <>
      <NavLink to="/" end className="topnav-link">
        {labels.home}
      </NavLink>
      <NavLink to="/services" className="topnav-link">
        {labels.services}
      </NavLink>
      <NavLink to="/hours" className="topnav-link">
        {labels.hours}
      </NavLink>
      <NavLink to="/shop" className="topnav-link topnav-link-shop">
        {labels.shop}
      </NavLink>
      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="topnav-link topnav-link-external"
      >
        <EnvironmentOutlined aria-hidden="true" /> {labels.findUs}
      </a>
    </>
  );

  const languageToggle = (
    <div
      className="language-toggle topnav-language-toggle"
      role="group"
      aria-label={isGreek ? 'Επιλογή γλώσσας' : 'Language selection'}
    >
      {languageOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`language-button ${language === option.value ? 'active' : ''}`}
          onClick={() => setLanguage(option.value)}
          aria-pressed={language === option.value}
          aria-label={getLangAria(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <header className={`topnav ${scrolled ? 'scrolled' : ''}`}>
      <div className="topnav-inner">
        <Link to="/" className="topnav-brand" aria-label="Alexandros Hair Salon">
          <img
            src={logoSrc}
            alt=""
            aria-hidden="true"
            className="topnav-logo"
          />
          <span className="topnav-wordmark">
            <span className="topnav-name">Alexandros</span>
            <span className="topnav-tagline">Hair Salon · Θησείο</span>
          </span>
        </Link>

        <nav className="topnav-links" aria-label={isGreek ? 'Κύριο μενού' : 'Main navigation'}>
          {navItems}
        </nav>

        <div className="topnav-actions">
          {languageToggle}
          <a href="tel:+302103465554" className="topnav-cta">
            <PhoneOutlined aria-hidden="true" />
            <span>{labels.book}</span>
          </a>
          <button
            type="button"
            className="topnav-burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? labels.closeMenu : labels.menu}
            aria-expanded={menuOpen}
            aria-controls="topnav-drawer"
          >
            {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="topnav-overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}
      <div id="topnav-drawer" className={`topnav-drawer ${menuOpen ? 'open' : ''}`}>
        <nav className="topnav-drawer-links" aria-label={isGreek ? 'Μενού' : 'Menu'}>
          {navItems}
        </nav>
        <a href="tel:+302103465554" className="topnav-cta topnav-drawer-cta">
          <PhoneOutlined aria-hidden="true" />
          <span>{labels.book}</span>
        </a>
        <div className="topnav-drawer-meta">
          {languageToggle}
          <AccessibilityControls
            language={language}
            settings={accessibility}
            onToggle={onToggleAccessibility}
            inline
          />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
