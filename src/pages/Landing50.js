import React, { useEffect } from 'react';
import { PhoneOutlined, CheckCircleOutlined, CalendarOutlined, GiftOutlined, ScissorOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Landing50.css';

const Landing50 = () => {
  useEffect(() => {
    // Track page view in Google Analytics
    if (window.gtag) {
      window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
        page_path: '/prosfora50',
      });
    }
  }, []);

  const handleCTAClick = () => {
    // Track conversion event for Google Ads
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': process.env.REACT_APP_GA_ADS_CONVERSION_ID || 'AW-CONVERSION_ID/CONVERSION_LABEL',
        'value': 1.0,
        'currency': 'EUR'
      });
    }
    
    // Track in Google Analytics
    if (window.gtag) {
      window.gtag('event', 'cta_click', {
        'event_category': 'Landing Page',
        'event_label': '50% Offer - Phone Call',
        'value': 1
      });
    }
  };

  return (
    <div className="landing50-container" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      zIndex: 9999,
      backgroundColor: '#120f18',
      color: '#ffffff'
    }}>
      {/* Hero Section */}
      <section 
        className="landing50-hero"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/prosfora50.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#120f18'
        }}
      >
        <div className="landing50-hero-overlay">
          <div className="landing50-badge">
            <GiftOutlined /> Αποκλειστική Προσφορά
          </div>
          <h1 className="landing50-title">
            50% <span className="landing50-highlight">ΕΚΠΤΩΣΗ</span>
          </h1>
          <h2 className="landing50-subtitle">
            Αποκλειστική Προσφορά Καλωσορίσματος<br />
            <span className="landing50-subtitle-small">(Για Νέους Πελάτες!)</span>
          </h2>
          <p className="landing50-description">
            Κούρεμα (Ανδρικό/Γυναικείο/Παιδικό), Βαφή & Ανταύγειες στη <strong>μισή τιμή</strong>.
            <br />
            <span className="landing50-validity">Ισχύει όλο τον Δεκέμβριο & Ιανουάριο</span>
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="landing50-benefits">
        <h3 className="landing50-benefits-title">Τι Περιλαμβάνει:</h3>
        <ul className="landing50-benefits-list">
          <li>
            <CheckCircleOutlined className="landing50-check-icon" />
            <span>Ισχύει <strong>μόνο για την ΠΡΩΤΗ επίσκεψη</strong> κάθε νέου πελάτη</span>
          </li>
          <li>
            <CheckCircleOutlined className="landing50-check-icon" />
            <span>Καλύπτει <strong>όλες τις βασικές υπηρεσίες</strong> μας</span>
          </li>
          <li>
            <CheckCircleOutlined className="landing50-check-icon" />
            <span>Απαραίτητη η <strong>κράτηση ΜΟΝΟ με ραντεβού</strong></span>
          </li>
          <li>
            <CheckCircleOutlined className="landing50-check-icon" />
            <span>Διάρκεια: <strong>Έως 31 Ιανουαρίου 2026</strong></span>
          </li>
        </ul>
      </section>

      {/* CTA Section - Sticky on Mobile */}
      <section className="landing50-cta-section">
        <div className="landing50-cta-container">
          <a
            href="tel:+302103465554"
            className="landing50-cta-button"
            onClick={handleCTAClick}
            aria-label="Κλείστε ραντεβού με 50% έκπτωση"
          >
            <PhoneOutlined className="landing50-cta-icon" />
            <span className="landing50-cta-text">
              ΚΛΕΙΣΕ ΤΩΡΑ ΤΟ ΡΑΝΤΕΒΟΥ ΣΟΥ
              <span className="landing50-cta-discount"> (50% OFF)</span>
            </span>
            <CalendarOutlined className="landing50-cta-icon" />
          </a>
          <p className="landing50-cta-note">
            Κάλεσε μας στο <strong>210 34 65 554</strong> για να κλείσεις το ραντεβού σου
          </p>
        </div>
      </section>

      {/* Trust Section */}
      <section className="landing50-trust">
        <div className="landing50-trust-item">
          <strong>32+ Χρόνια</strong> Εμπειρίας
        </div>
        <div className="landing50-trust-item">
          <strong>Θησείο</strong> Κέντρο Αθήνας
        </div>
        <div className="landing50-trust-item">
          <strong>Επαγγελματίες</strong> Κομμωτές
        </div>
      </section>

      {/* Additional CTA Buttons */}
      <section className="landing50-secondary-cta">
        <Link to="/services" className="landing50-secondary-button">
          <ScissorOutlined className="landing50-secondary-icon" />
          <span>Δείτε τις Υπηρεσίες μας</span>
        </Link>
        <a
          href="https://www.google.com/maps/place/alexandroshairsalon/@37.976933,23.7162736,17z/data=!3m1!4b1!4m6!3m5!1s0x14a1bd200f79f18d:0x3024d28633f32b4!8m2!3d37.976933!4d23.7162736!16s%2Fg%2F11cm0h21cx?entry=ttu"
          target="_blank"
          rel="noopener noreferrer"
          className="landing50-secondary-button"
        >
          <EnvironmentOutlined className="landing50-secondary-icon" />
          <span>Βρείτε μας στο Χάρτη</span>
        </a>
      </section>

      {/* Footer Link */}
      <section className="landing50-footer-link">
        <Link to="/" className="landing50-home-link">
          ← Επιστροφή στην Αρχική
        </Link>
      </section>
    </div>
  );
};

export default Landing50;

