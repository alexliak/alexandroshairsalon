import React from 'react';
import { Link } from '../lib/router';
import NhLayout, { BOOK, DIRECTIONS_URL, REVIEWS_URL, mapLinkProps } from '../components/NhLayout';
import SalonGallery from '../components/SalonGallery';

// /fotografies: οι φωτογραφίες του χώρου, για όσους ψάχνουν «alexandros hair salon photos / φωτογραφίες»,
// με σύνδεσμο σε τιμές, κριτικές Google, χάρτη και κράτηση.

const content = {
  el: {
    eyebrow: 'Θησείο · Ερυσίχθονος 3-5',
    titleA: 'Φωτογραφίες του ',
    titleEm: 'κομμωτηρίου.',
    lead: 'Το Alexandros Hair Salon από μέσα, όπως είναι: οι θέσεις κουρέματος, το λούσιμο, η υποδοχή και ο χώρος αναμονής. Βρισκόμαστε στην Ερυσίχθονος 3-5, πέντε λεπτά με τα πόδια από το μετρό Θησείο.',
    book: 'Κλείσε ραντεβού',
    prices: 'Τιμές',
    reviews: 'Κριτικές στο Google (4,6 ★)',
    map: 'Οδηγίες στον χάρτη',
    team: 'Ο Αλέξανδρος Λιακόπουλος και η ομάδα του κομμωτηρίου σάς περιμένουν στο Θησείο.',
    license: '© Alexandros Hair Salon. Οι φωτογραφίες ανήκουν στο κομμωτήριο. Για χρήση τους ζήτησε άδεια από την '
  },
  en: {
    eyebrow: 'Thiseio · Erisichthonos 3-5',
    titleA: 'Photos of the ',
    titleEm: 'salon.',
    lead: 'Alexandros Hair Salon from the inside, as it is: the cutting stations, backwash, reception and waiting area. We are at Erisichthonos 3-5, a five-minute walk from Thiseio metro.',
    book: 'Book an appointment',
    prices: 'Prices',
    reviews: 'Google reviews (4.6 ★)',
    map: 'Directions on the map',
    team: 'Alexandros Liakopoulos and the salon team look forward to seeing you in Thiseio.',
    license: '© Alexandros Hair Salon. The photos belong to the salon. To use them, ask for permission via the '
  }
};

export default function Photos({ language, setLanguage }) {
  const t = content[language] || content.el;
  return (
    <NhLayout language={language} setLanguage={setLanguage}>
      <main id="top" className="nh-page nh-photos">
        <header className="nh-page-hero">
          <span className="nh-eyebrow">{t.eyebrow}</span>
          <h1 className="nh-h1 nh-h1-page">{t.titleA}<em>{t.titleEm}</em></h1>
          <p className="nh-lead">{t.lead}</p>
          <div className="nh-cta-row">
            <a href={BOOK} className="nh-btn nh-btn-gold">{t.book}</a>
            <Link to="/services" className="nh-btn nh-btn-ghost">{t.prices}</Link>
          </div>
        </header>

        <SalonGallery language={language} />

        <section className="nh-photos-foot">
          <p>{t.team}</p>
          <div className="nh-photos-links">
            <a className="nh-underline" {...mapLinkProps(REVIEWS_URL)}>{t.reviews}</a>
            <a className="nh-underline" {...mapLinkProps(DIRECTIONS_URL)}>{t.map}</a>
          </div>
          <p id="adeia" className="nh-photos-license">
            {t.license}<Link to="/hours">{language === 'en' ? 'contact page' : 'σελίδα επικοινωνίας'}</Link>.
          </p>
        </section>
      </main>
    </NhLayout>
  );
}
