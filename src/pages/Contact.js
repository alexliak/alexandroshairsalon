import React from 'react';
import NhLayout, { BOOK, PHONE, PHONE_DISPLAY, GOOGLE_PROFILE_URL, MAP_EMBED_URL, MOBILE, WHATSAPP_URL, VIBER_URL, FACETIME_URL } from '../components/NhLayout';

// Hours & contact (2026 design). The opening hours are NOT written here on purpose:
// the owner keeps them up to date on the Google Business Profile, so we link there.
const text = {
  el: {
    eyebrow: 'Ωράριο & επικοινωνία',
    title: 'Σε περιμένουμε',
    titleEm: 'στο Θησείο.',
    hoursTitle: 'Ωράριο λειτουργίας',
    hoursText: 'Το ωράριό μας ενημερώνεται πάντα στο Google, μαζί με αργίες και αλλαγές της εβδομάδας.',
    hoursCta: 'Δες το ωράριο στο Google',
    bookTitle: 'Κλείσε ραντεβού online',
    bookText: 'Δες ελεύθερες ώρες, τιμές και χρόνους και κλείσε σε ένα λεπτό. Πληρώνεις online ή στο κομμωτήριο.',
    bookCta: 'Κλείσε online',
    addressTitle: 'Διεύθυνση',
    address: 'Ερυσίχθονος 3-5, Θησείο, Αθήνα 118\u00a051',
    directions: 'Οδηγίες στον χάρτη',
    phoneTitle: 'Τηλέφωνα',
    salonLabel: 'Κομμωτήριο',
    call: 'Κλήση κομμωτηρίου',
    mobileTitle: 'Κινητό',
    mobileCall: 'Κλήση κινητού',
    mapTitle: 'Χάρτης: Alexandros Hair Salon'
  },
  en: {
    eyebrow: 'Hours & contact',
    title: 'See you',
    titleEm: 'in Thiseio.',
    hoursTitle: 'Opening hours',
    hoursText: 'Our opening hours are always up to date on Google, including holidays and changes during the week.',
    hoursCta: 'See opening hours on Google',
    bookTitle: 'Book online',
    bookText: 'See free times, prices and durations and book in a minute. Pay online or at the salon.',
    bookCta: 'Book online',
    addressTitle: 'Address',
    address: 'Erysichthonos 3-5, Thiseio, Athens 118\u00a051',
    directions: 'Directions on the map',
    phoneTitle: 'Phone',
    salonLabel: 'Salon',
    call: 'Call salon',
    mobileTitle: 'Mobile',
    mobileCall: 'Call mobile',
    mapTitle: 'Map: Alexandros Hair Salon'
  }
};

const Contact = ({ language, setLanguage }) => {
  const t = text[language] || text.el;

  return (
    <NhLayout language={language} setLanguage={setLanguage}>
      <main className="nh-page">
        <section className="nh-page-hero">
          <span className="nh-eyebrow">{t.eyebrow}</span>
          <h1 className="nh-h1 nh-h1-page">
            {t.title} <em>{t.titleEm}</em>
          </h1>
        </section>

        <section className="nh-info-grid">
          <article className="nh-info-card nh-info-card-gold">
            <h2 className="nh-info-title">{t.hoursTitle}</h2>
            <p>{t.hoursText}</p>
            <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="nh-btn nh-btn-dark">
              {t.hoursCta}
            </a>
          </article>
          <article className="nh-info-card">
            <h2 className="nh-info-title">{t.bookTitle}</h2>
            <p>{t.bookText}</p>
            <a href={BOOK} className="nh-btn nh-btn-gold">{t.bookCta}</a>
          </article>
          <article className="nh-info-card">
            <h2 className="nh-info-title">{t.addressTitle}</h2>
            <p>{t.address}</p>
            <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="nh-underline">
              {t.directions}
            </a>
          </article>
          <article className="nh-info-card">
            <h2 className="nh-info-title">{t.phoneTitle}</h2>
            <p>{t.salonLabel}: {PHONE_DISPLAY}</p>
            <div className="nh-contact-row">
              <a href={`tel:${PHONE}`} className="nh-btn nh-btn-ghost nh-btn-sm">{t.call}</a>
            </div>
            <p>{t.mobileTitle}</p>
            <div className="nh-contact-row">
              <a href={`tel:${MOBILE}`} className="nh-btn nh-btn-ghost nh-btn-sm">{t.mobileCall}</a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nh-btn nh-btn-ghost nh-btn-sm">WhatsApp</a>
              <a href={VIBER_URL} className="nh-btn nh-btn-ghost nh-btn-sm">Viber</a>
              <a href={FACETIME_URL} className="nh-btn nh-btn-ghost nh-btn-sm">FaceTime</a>
            </div>
          </article>
        </section>

        <section className="nh-map nh-map-wide">
          <iframe title={t.mapTitle} src={MAP_EMBED_URL} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </section>
      </main>
    </NhLayout>
  );
};

export default Contact;
