import React from 'react';
import { Link } from 'react-router-dom';
import {
  ScissorOutlined,
  BgColorsOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  PhoneOutlined,
  StarOutlined,
  HighlightOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
  SyncOutlined,
  GiftOutlined
} from '@ant-design/icons';
import servicesContent from '../content/services.json';
import './Services.css';

// Services, prices and notes live in src/content/services.json — edit them
// there (name.el / name.en, price.el / price.en). This file only handles
// layout, icons and fixed UI labels.
const categoryIcons = {
  wash: HeartOutlined,
  haircuts: ScissorOutlined,
  styling: HighlightOutlined,
  therapies: MedicineBoxOutlined,
  color: BgColorsOutlined,
  perm: SyncOutlined,
  packages: GiftOutlined,
  other: StarOutlined
};

const uiText = {
  en: {
    columnHeaders: { service: 'Service', price: 'Price' },
    notesHeading: 'Notes',
    notesSubtitle: 'Helpful information',
    contactNote: 'For more information call us at ',
    phoneDisplay: '210 3465 554',
    phoneAriaLabel: 'Call Alexandros Hair Salon',
    ctaContact: 'View opening hours'
  },
  el: {
    columnHeaders: { service: 'Υπηρεσία', price: 'Τιμή' },
    notesHeading: 'Σημειώσεις',
    notesSubtitle: 'Χρήσιμες πληροφορίες',
    contactNote: 'Για περισσότερες πληροφορίες καλέστε μας στο ',
    phoneDisplay: '210 3465 554',
    phoneAriaLabel: 'Επικοινωνία με το Alexandros Hair Salon',
    ctaContact: 'Δείτε το ωράριο λειτουργίας'
  }
};

const Services = ({ language }) => {
  const ui = uiText[language];

  return (
    <div className="services-container">
      <h1 className="services-title">{servicesContent.title[language]}</h1>
      {servicesContent.intro[language] ? (
        <p className="services-intro">{servicesContent.intro[language]}</p>
      ) : null}
      {servicesContent.categories.map((category) => {
        const Icon = categoryIcons[category.key] || StarOutlined;
        const heading = category.heading[language];
        const subtitle = category.subtitle ? category.subtitle[language] : null;
        return (
          <section
            key={category.key}
            className="service-section"
            aria-labelledby={`${category.key}-heading`}
          >
            <h2 id={`${category.key}-heading`} className="service-heading">
              <span className="service-icon" aria-hidden="true">
                <Icon />
              </span>
              <span>
                {heading}
                {subtitle ? <span className="service-subtitle">{subtitle}</span> : null}
              </span>
            </h2>
            <div className="service-table-wrapper">
              <table className="service-table">
                <caption className="sr-only">{heading}</caption>
                <thead>
                  <tr>
                    <th scope="col">{ui.columnHeaders.service}</th>
                    <th scope="col">{ui.columnHeaders.price}</th>
                  </tr>
                </thead>
                <tbody>
                  {category.services.map((service) => (
                    <tr key={service.name.el}>
                      <th scope="row">{service.name[language]}</th>
                      <td data-label={ui.columnHeaders.price}>{service.price[language]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
      <section className="service-section notes-section" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="service-heading">
          <span className="service-icon" aria-hidden="true">
            <InfoCircleOutlined />
          </span>
          <span>
            {ui.notesHeading}
            <span className="service-subtitle">{ui.notesSubtitle}</span>
          </span>
        </h2>
        <div className="service-text">
          {servicesContent.notes.sections.map((section) => (
            <React.Fragment key={section.title.el}>
              <h3 className="notes-title">{section.title[language]}</h3>
              <p>{section.body[language]}</p>
            </React.Fragment>
          ))}
          <p className="notes-disclaimer">{servicesContent.notes.disclaimer[language]}</p>
        </div>
      </section>
      <p className="services-note">
        {ui.contactNote}
        <a className="services-phone" href="tel:+302103465554">
          <PhoneOutlined className="phone-icon" aria-hidden="true" /> {ui.phoneDisplay}
        </a>
        .
      </p>
      <div className="services-cta-links">
        <Link to="/hours" className="services-cta-link">
          {ui.ctaContact} <ArrowRightOutlined />
        </Link>
      </div>
      <div className="phone-icon-container">
        <a href="tel:+302103465554">
          <PhoneOutlined className="phone-icon" aria-label={ui.phoneAriaLabel} />
        </a>
      </div>
    </div>
  );
};

export default Services;
