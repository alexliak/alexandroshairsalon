import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneOutlined, FacebookOutlined, EnvironmentOutlined, ClockCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './Contact.css';

const languageOptions = [
  { value: 'en', label: 'EN' },
  { value: 'el', label: 'EL' }
];

const hoursContent = {
  en: {
    title: 'Opening Hours',
    subtitle: 'We look forward to welcoming you to the salon.',
    scheduleHeading: 'Opening hours',
    schedule: [
      { day: 'Monday', closed: true },
      { day: 'Tuesday', hours: '08:30 – 13:30 / 17:30 – 20:00' },
      { day: 'Wednesday', hours: '08:30 – 14:00' },
      { day: 'Thursday', hours: '08:30 – 13:30 / 17:30 – 20:00' },
      { day: 'Friday', hours: '08:30 – 18:00' },
      { day: 'Saturday', hours: '08:30 – 15:00' }
    ],
    contactHeading: 'Contact',
    addressLabel: 'Address',
    address: 'Erysichthonos 3-5, Thiseio 11851',
    phoneLabel: 'Phone',
    phoneDisplay: '210 3465 554',
    callCta: 'Call us',
    facebookCta: 'Facebook Page',
    closedLabel: 'Closed',
    ctaServices: 'View our services'
  },
  el: {
    title: 'Ωράριο Λειτουργίας',
    subtitle: 'Σας περιμένουμε στο σαλόνι μας.',
    scheduleHeading: 'Ωράριο',
    schedule: [
      { day: 'Δευτέρα', closed: true },
      { day: 'Τρίτη', hours: '08:30 - 13:30 / 17:30 - 20:00' },
      { day: 'Τετάρτη', hours: '08:30 - 14:00' },
      { day: 'Πέμπτη', hours: '08:30 - 13:30 / 17:30 - 20:00' },
      { day: 'Παρασκευή', hours: '08:30 - 18:00' },
      { day: 'Σάββατο', hours: '08:30 - 15:00' }
    ],
    contactHeading: 'Επικοινωνία',
    addressLabel: 'Διεύθυνση',
    address: 'Ερυσίχθονος 3 - 5, Θησείο 11851',
    phoneLabel: 'Τηλέφωνο',
    phoneDisplay: '210 34 65 554',
    callCta: 'Κάλεσέ μας',
    facebookCta: 'Σελίδα στο Facebook',
    closedLabel: 'Κλειστά',
    ctaServices: 'Δείτε τις υπηρεσίες μας'
  }
};

const ContactForm = ({ language, setLanguage }) => {
  const content = hoursContent[language];
  const isGreek = language === 'el';
  const languageToggleLabel = isGreek ? 'Επιλογή γλώσσας' : 'Language selection';
  const getToggleAria = (value) => {
    if (value === 'en') {
      return isGreek ? 'Αλλαγή γλώσσας στα Αγγλικά' : 'Switch language to English';
    }
    return isGreek ? 'Αλλαγή γλώσσας στα Ελληνικά' : 'Switch language to Greek';
  };

  return (
    <div className="contact-card">
      <div className="language-toggle-wrapper">
        <div className="language-toggle" role="group" aria-label={languageToggleLabel}>
          {languageOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`language-button ${language === opt.value ? 'active' : ''}`}
              onClick={() => setLanguage(opt.value)}
              aria-pressed={language === opt.value}
              aria-label={getToggleAria(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <h1 className="contact-title">
        <ClockCircleOutlined aria-hidden="true" /> {content.title}
      </h1>
      <p className="contact-description">{content.subtitle}</p>
      <div className="hours-table" role="list" aria-label={content.scheduleHeading}>
        {content.schedule.map((entry) => (
          <div
            key={`${entry.day}-${entry.hours || 'closed'}`}
            className={`hours-row${entry.closed ? ' closed' : ''}`}
            role="listitem"
          >
            <span className="hours-day">{entry.day}</span>
            <span className="hours-time">{entry.closed ? content.closedLabel : entry.hours}</span>
          </div>
        ))}
      </div>
      <div className="contact-details">
        <p>
          <EnvironmentOutlined aria-hidden="true" /> <strong>{content.addressLabel}:</strong> {content.address}
        </p>
        <p>
          <PhoneOutlined aria-hidden="true" /> <strong>{content.phoneLabel}:</strong> {content.phoneDisplay}
        </p>
      </div>
      <div className="contact-actions">
        <a href="tel:+302103465554" className="contact-button call">
          <PhoneOutlined aria-hidden="true" /> <span>{content.callCta}</span>
        </a>
        <a
          href="https://www.facebook.com/alexandros.hairsalon"
          className="contact-button social"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookOutlined aria-hidden="true" /> <span>{content.facebookCta}</span>
        </a>
      </div>
      <div className="contact-cta-links">
        <Link to="/services" className="contact-cta-link">
          {content.ctaServices} <ArrowRightOutlined />
        </Link>
      </div>
    </div>
  );
};

export default ContactForm;
