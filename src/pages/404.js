import React from 'react';
import Seo from '../components/Seo';
import NhLayout from '../components/NhLayout';
import { Link } from '../lib/router';

const TXT = {
  el: { title: 'Η σελίδα δεν βρέθηκε.', lead: 'Ο σύνδεσμος μπορεί να άλλαξε. Δες τις υπηρεσίες μας ή το shop.', home: 'Αρχική', services: 'Υπηρεσίες & τιμές', shop: 'Shop' },
  en: { title: 'Page not found.', lead: 'The link may have changed. See our services or the shop.', home: 'Home', services: 'Services & prices', shop: 'Shop' }
};

export default function NotFound({ language = 'el', setLanguage = () => {} }) {
  const t = TXT[language] || TXT.el;
  return (
    <>
      <Seo path="/404" title="Η σελίδα δεν βρέθηκε | Alexandros Hair Salon" description="Alexandros Hair Salon, κομμωτήριο στο Θησείο." noindex />
      <NhLayout language={language} setLanguage={setLanguage}>
        <main className="nh-page">
          <section className="nh-page-hero">
            <span className="nh-eyebrow">404</span>
            <h1 className="nh-h1 nh-h1-page">{t.title}</h1>
            <p className="nh-lead">{t.lead}</p>
            <div className="nh-cta-row">
              <Link to="/" className="nh-btn nh-btn-gold">{t.home}</Link>
              <Link to="/services" className="nh-btn nh-btn-ghost">{t.services}</Link>
              <Link to="/shop" className="nh-btn nh-btn-ghost">{t.shop}</Link>
            </div>
          </section>
        </main>
      </NhLayout>
    </>
  );
}
