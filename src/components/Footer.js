import React from 'react';
import { Link } from 'react-router-dom';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  FacebookOutlined
} from '@ant-design/icons';
import './Footer.css';

const MAPS_URL =
  'https://www.google.com/maps/place/alexandroshairsalon/@37.976933,23.7162736,17z/data=!3m1!4b1!4m6!3m5!1s0x14a1bd200f79f18d:0x3024d28633f32b4!8m2!3d37.976933!4d23.7162736!16s%2Fg%2F11cm0h21cx?entry=ttu';

const footerContent = {
  en: {
    blurb: 'Professional hairdressing in the heart of Thiseio, Athens, since 1992.',
    contactTitle: 'Contact',
    address: 'Erysichthonos 3-5, Thiseio 11851, Athens',
    hoursTitle: 'Opening Hours',
    hours: [
      'Mon: Closed',
      'Tue & Thu: 08:30–13:30 / 17:30–20:00',
      'Wed: 08:30–14:00',
      'Fri: 08:30–18:00',
      'Sat: 08:30–15:00'
    ],
    linksTitle: 'Pages',
    links: [
      { to: '/', label: 'Home' },
      { to: '/services', label: 'Services & Prices' },
      { to: '/hours', label: 'Opening Hours' },
      { to: '/shop', label: 'Online Shop' }
    ]
  },
  el: {
    blurb: 'Επαγγελματική κομμωτική στην καρδιά του Θησείου, από το 1992.',
    contactTitle: 'Επικοινωνία',
    address: 'Ερυσίχθονος 3-5, Θησείο 11851, Αθήνα',
    hoursTitle: 'Ωράριο',
    hours: [
      'Δευτέρα: Κλειστά',
      'Τρ & Πε: 08:30–13:30 / 17:30–20:00',
      'Τετάρτη: 08:30–14:00',
      'Παρασκευή: 08:30–18:00',
      'Σάββατο: 08:30–15:00'
    ],
    linksTitle: 'Σελίδες',
    links: [
      { to: '/', label: 'Αρχική' },
      { to: '/services', label: 'Υπηρεσίες & Τιμές' },
      { to: '/hours', label: 'Ωράριο' },
      { to: '/shop', label: 'Online Shop' }
    ]
  }
};

const Footer = ({ language = 'el' }) => {
  const content = footerContent[language] || footerContent.el;
  const logoSrc = `${process.env.PUBLIC_URL}/images/logo.jpg`;

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col footer-brand">
          <div className="footer-brand-row">
            <img
              src={logoSrc}
              alt="Alexandros Hair Salon - Κομμωτήριο κέντρο Αθήνας, Θησείο"
              className="footer-logo"
            />
            <span className="footer-name">Alexandros<br /><small>Hair Salon</small></span>
          </div>
          <p className="footer-blurb">{content.blurb}</p>
          <a
            href="https://www.facebook.com/alexandros.hairsalon"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social"
            aria-label="Facebook"
          >
            <FacebookOutlined /> Facebook
          </a>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">{content.contactTitle}</h3>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="footer-line">
            <EnvironmentOutlined aria-hidden="true" /> {content.address}
          </a>
          <a href="tel:+302103465554" className="footer-line">
            <PhoneOutlined aria-hidden="true" /> 210 346 5554
          </a>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">
            <ClockCircleOutlined aria-hidden="true" /> {content.hoursTitle}
          </h3>
          <ul className="footer-hours">
            {content.hours.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">{content.linksTitle}</h3>
          <ul className="footer-links">
            {content.links.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 Alexandros Hair Salon · alexandroshairsalon.gr
      </div>
    </footer>
  );
};

export default Footer;
