import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CrownOutlined,
  TeamOutlined,
  ExperimentOutlined,
  SafetyCertificateOutlined,
  BulbOutlined,
  SmileOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  PhoneOutlined,
  ShoppingOutlined,
  StarFilled
} from '@ant-design/icons';
import './Home.css';

const heroImage = '/images/portfolio/hairdresser-grooming-their-client.jpg';

const galleryImages = [
  { src: '/images/portfolio/01.jpg', alt: 'Δουλειά του κομμωτηρίου Alexandros Hair Salon 1' },
  { src: '/images/portfolio/02.jpg', alt: 'Δουλειά του κομμωτηρίου Alexandros Hair Salon 2' },
  { src: '/images/portfolio/03.jpg', alt: 'Δουλειά του κομμωτηρίου Alexandros Hair Salon 3' },
  { src: '/images/portfolio/04.jpg', alt: 'Δουλειά του κομμωτηρίου Alexandros Hair Salon 4' },
  {
    src: '/images/portfolio/beauty-fashion-portrait-young-blond-woman-model-with-natural-makeup-perfect-skin-posing.jpg',
    alt: 'Styling μαλλιών από το Alexandros Hair Salon'
  }
];

/* Animated counter that runs once when visible */
const AnimatedStat = ({ target, decimals = 0, suffix = '', label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            current = Math.min(increment * step, target);
            setCount(parseFloat(current.toFixed(decimals)));
            if (step >= steps) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, decimals]);

  return (
    <div ref={ref} className="stat-item">
      <span className="stat-num">
        {decimals > 0 ? count.toFixed(decimals) : count}{suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const homeContent = {
  en: {
    hero: {
      eyebrow: 'Since 1992 · Thiseio, Athens',
      title: 'Excellence in Hairdressing',
      lead: 'Professional hair care & styling in the heart of Thiseio, Athens.',
      cta: 'Book Appointment',
      ctaSecondary: 'Services & prices'
    },
    stats: [
      { target: 30, suffix: '+', label: 'Years of excellence' },
      { target: 4.5, decimals: 1, suffix: '★', label: 'Google Reviews' },
      { target: 1000, suffix: '+', label: 'Happy clients' }
    ],
    gallery: {
      title: 'Our Work',
      lead: 'A glimpse of what leaves our salon every day.'
    },
    reviews: {
      title: 'What our clients say',
      body: '4.5 out of 5 stars across 22 Google reviews.',
      cta: 'Read the reviews on Google'
    },
    shopBanner: {
      label: 'NEW',
      title: 'Online Shop',
      body: 'EVOQUE professional hair care products — delivered to your door.',
      cta: 'Shop now'
    },
    highlightsTitle: 'Why Choose Us?',
    highlights: [
      { icon: CrownOutlined, text: '32 years of excellence in professional hairdressing' },
      { icon: TeamOutlined, text: 'Family-owned salon with personal attention to every client' },
      { icon: ExperimentOutlined, text: 'Modern facilities in a relaxing, welcoming atmosphere' },
      { icon: SafetyCertificateOutlined, text: 'Experts continuously trained in the latest techniques' },
      { icon: BulbOutlined, text: 'Personalised consultations to achieve your perfect look' }
    ],
    ctaServices: 'View services & prices',
    ctaContact: 'Opening hours',
    story: {
      title: 'Our Story',
      paragraphs: [
        'Founded in 1992 by master stylist Giota Liakopoulou, our salon began as a vision to bring professional, personalised hair care to the Thiseio community.',
        'In 2004, Alexandros Liakopoulou joined the family tradition, bringing fresh perspectives and advanced training from prestigious academies.'
      ],
      milestones: [
        { year: '1992', description: 'Salon founded by master stylist Giota Liakopoulou' },
        { year: '2004', description: 'Alexandros joins after extensive training' },
        { year: 'Today', description: 'Serving thousands of satisfied clients with consistent excellence' }
      ]
    },
    philosophy: {
      title: 'Our Philosophy',
      cards: [
        { title: 'Technical Excellence', body: 'Classic cutting with modern geometric precision.', icon: CheckCircleOutlined },
        { title: 'Health First', body: 'Premium products and treatments that nourish while styling.', icon: SafetyCertificateOutlined },
        { title: 'Personal Connection', body: 'We listen, understand, and deliver with care.', icon: SmileOutlined },
        { title: 'Continuous Innovation', body: 'We keep our techniques fresh with ongoing training.', icon: BulbOutlined }
      ]
    }
  },
  el: {
    hero: {
      eyebrow: 'Από το 1992 · Θησείο, Αθήνα',
      title: 'Υπεροχή στην κομμωτική',
      lead: 'Επαγγελματική περιποίηση & styling στο Θησείο, κέντρο Αθήνας.',
      cta: 'Κλείσε Ραντεβού',
      ctaSecondary: 'Υπηρεσίες & τιμές'
    },
    stats: [
      { target: 30, suffix: '+', label: 'Χρόνια εμπειρίας' },
      { target: 4.5, decimals: 1, suffix: '★', label: 'στο Google' },
      { target: 1000, suffix: '+', label: 'Ευχαριστημένοι πελάτες' }
    ],
    gallery: {
      title: 'Η Δουλειά μας',
      lead: 'Μια ματιά σε όσα φεύγουν καθημερινά από το σαλόνι μας.'
    },
    reviews: {
      title: 'Τι λένε οι πελάτες μας',
      body: '4.5 στα 5 αστέρια σε 22 κριτικές στο Google.',
      cta: 'Διαβάστε τις κριτικές στο Google'
    },
    shopBanner: {
      label: 'ΝΕΟ',
      title: 'Online Shop',
      body: 'Επαγγελματικά προϊόντα μαλλιών EVOQUE — απευθείας στο σπίτι σας.',
      cta: 'Μπείτε στο Shop'
    },
    highlightsTitle: 'Γιατί να μας επιλέξετε;',
    highlights: [
      { icon: CrownOutlined, text: '32 χρόνια υπεροχής στην επαγγελματική κομμωτική στο κέντρο Αθήνας' },
      { icon: TeamOutlined, text: 'Οικογενειακό κομμωτήριο στο Θησείο με προσωπική φροντίδα' },
      { icon: ExperimentOutlined, text: 'Σύγχρονες εγκαταστάσεις, χαλαρωτική ατμόσφαιρα' },
      { icon: SafetyCertificateOutlined, text: 'Εξειδικευμένοι κομμωτές με συνεχή εκπαίδευση' },
      { icon: BulbOutlined, text: 'Εξατομικευμένες συμβουλές για το ιδανικό look σας' }
    ],
    ctaServices: 'Υπηρεσίες & τιμές',
    ctaContact: 'Ωράριο λειτουργίας',
    story: {
      title: 'Η Ιστορία μας',
      paragraphs: [
        'Το 1992 η Γιώτα Λιακοπούλου δημιούργησε ένα χώρο επαγγελματικής, προσωπικής περιποίησης στο Θησείο. Ένα κομμωτήριο που συνδυάζει την παράδοση με τη σύγχρονη τεχνολογία.',
        'Το 2004 ο Αλέξανδρος συνέχισε την παράδοση με νέες ιδέες και εκπαίδευση από καταξιωμένες ακαδημίες. Σήμερα, ένα από τα πιο αξιόπιστα κομμωτήρια στο κέντρο της Αθήνας.'
      ],
      milestones: [
        { year: '1992', description: 'Ίδρυση από τη Γιώτα Λιακοπούλου' },
        { year: '2004', description: 'Ο Αλέξανδρος εντάσσεται μετά από εκπαίδευση' },
        { year: 'Σήμερα', description: 'Χιλιάδες ευχαριστημένοι πελάτες με συνέπεια' }
      ]
    },
    philosophy: {
      title: 'Η Φιλοσοφία μας',
      cards: [
        { title: 'Τεχνική Υπεροχή', body: 'Κλασικό κούρεμα με σύγχρονη γεωμετρική ακρίβεια.', icon: CheckCircleOutlined },
        { title: 'Προτεραιότητα στην Υγεία', body: 'Προϊόντα και θεραπείες που θρέφουν ενώ διαμορφώνουν.', icon: SafetyCertificateOutlined },
        { title: 'Προσωπική Σχέση', body: 'Ακούμε, κατανοούμε και παραδίδουμε με φροντίδα.', icon: SmileOutlined },
        { title: 'Συνεχής Καινοτομία', body: 'Συνεχής εκπαίδευση και ανανέωση τεχνικών.', icon: BulbOutlined }
      ]
    }
  }
};

const Home = ({ language }) => {
  const content = homeContent[language];

  return (
    <div className="homeA-container">

      {/* Static hero with booking CTA */}
      <section
        className="heroA-banner"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${heroImage})` }}
      >
        <div className="heroA-overlay">
          <div className="heroA-text">
            <span className="heroA-eyebrow">{content.hero.eyebrow}</span>
            <h1 className="heroA-title">{content.hero.title}</h1>
            <p className="heroA-lead">{content.hero.lead}</p>
            <div className="heroA-actions">
              <a href="tel:+302103465554" className="hero-cta-btn">
                <PhoneOutlined aria-hidden="true" /> {content.hero.cta}
              </a>
              <Link to="/services" className="hero-cta-ghost">
                {content.hero.ctaSecondary} <ArrowRightOutlined aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="homeA-content">

        {/* Stats strip — animated counters */}
        <div className="stats-strip">
          {content.stats.map((s) => (
            <AnimatedStat
              key={s.label}
              target={s.target}
              decimals={s.decimals || 0}
              suffix={s.suffix}
              label={s.label}
            />
          ))}
        </div>

        {/* Portfolio gallery */}
        <section className="gallery-section">
          <h2 className="section-title centered">{content.gallery.title}</h2>
          <p className="section-lead">{content.gallery.lead}</p>
          <div className="gallery-grid">
            {galleryImages.map((img) => (
              <figure key={img.src} className="gallery-item">
                <img src={`${process.env.PUBLIC_URL}${img.src}`} alt={img.alt} loading="lazy" />
              </figure>
            ))}
          </div>
        </section>

        {/* Google reviews */}
        <section className="reviews-section">
          <span className="reviews-stars" aria-hidden="true">
            <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled />
          </span>
          <h2 className="reviews-title">{content.reviews.title}</h2>
          <p className="reviews-body">{content.reviews.body}</p>
          <a
            href="https://www.google.com/maps/place/alexandroshairsalon/@37.976933,23.7162736,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="reviews-cta-btn"
          >
            {content.reviews.cta} <ArrowRightOutlined aria-hidden="true" />
          </a>
        </section>

        {/* Why choose us */}
        <section className="cardA-section">
          <h2 className="section-title">{content.highlightsTitle}</h2>
          <div className="highlights-grid">
            {content.highlights.map(({ icon: Icon, text }) => (
              <div key={text} className="highlight-card">
                <span className="highlight-icon" aria-hidden="true"><Icon /></span>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <div className="home-cta-links">
            <Link to="/services" className="home-cta-link">
              {content.ctaServices} <ArrowRightOutlined />
            </Link>
            <Link to="/hours" className="home-cta-link">
              {content.ctaContact} <ArrowRightOutlined />
            </Link>
          </div>
        </section>

        {/* Shop banner */}
        <Link to="/shop" className="shop-home-banner">
          <span className="shop-home-badge">{content.shopBanner.label}</span>
          <div className="shop-home-text">
            <span className="shop-home-title">
              <ShoppingOutlined aria-hidden="true" /> {content.shopBanner.title}
            </span>
            <span className="shop-home-body">{content.shopBanner.body}</span>
          </div>
          <span className="shop-home-cta">{content.shopBanner.cta} →</span>
        </Link>

        {/* Our story */}
        <section className="cardA-section">
          <h2 className="section-title">{content.story.title}</h2>
          {content.story.paragraphs.map((p, idx) => (
            <p key={`story-${idx}`} className="section-paragraph">{p}</p>
          ))}
          <ul className="timeline">
            {content.story.milestones.map((m) => (
              <li key={`${m.year}-${m.description}`}>
                <span className="timeline-year">{m.year}</span>
                <span className="timeline-desc">{m.description}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Philosophy */}
        <section className="cardA-section">
          <h2 className="section-title">{content.philosophy.title}</h2>
          <div className="philosophy-grid">
            {content.philosophy.cards.map(({ title, body, icon: Icon }) => (
              <div key={title} className="philosophy-card">
                <span className="philosophy-icon" aria-hidden="true"><Icon /></span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
