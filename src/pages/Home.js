import React from 'react';
import { Link } from 'react-router-dom';
import {
  CrownOutlined,
  TeamOutlined,
  ExperimentOutlined,
  SafetyCertificateOutlined,
  HistoryOutlined,
  BulbOutlined,
  SmileOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import CustomCarousel from '../components/Carousel';
import './Home.css';

const languageOptions = [
  { value: 'en', label: 'EN' },
  { value: 'el', label: 'EL' }
];

const carouselImages = [
    '/images/portfolio/01.jpg',
    '/images/portfolio/02.jpg',
    '/images/portfolio/03.jpg',
  '/images/portfolio/04.jpg',
  '/images/portfolio/hairdresser-grooming-their-client.jpg'
  ];

const homeContent = {
  en: {
    languageToggleLabel: 'Language selection',
    languageButtons: {
      en: 'View page in English',
      el: 'View page in Greek'
    },
    hero: {
      title: 'Excellence in Hairdressing Since 1992',
      lead:
        'For over three decades, Alexandros Hair Salon has been the trusted destination for hair care and styling in the heart of Thiseio, Athens.'
    },
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
    highlightsTitle: 'Why Choose Us?',
      highlights: [
        { icon: CrownOutlined, text: '32 years of excellence in professional hairdressing' },
        { icon: TeamOutlined, text: 'Family-owned business with personal attention to every client' },
        { icon: ExperimentOutlined, text: 'State-of-the-art facilities in a relaxing, welcoming atmosphere' },
        { icon: SafetyCertificateOutlined, text: 'Expert professionals continuously trained in the latest techniques' },
        { icon: BulbOutlined, text: 'Personalised consultations to achieve your perfect look' }
      ],
      ctaServices: 'View our services',
      ctaContact: 'Contact us',
      shopBanner: {
        label: 'NEW',
        title: 'Online Shop',
        body: 'EVOQUE professional hair care products — delivered to your door.',
        cta: 'Shop now'
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
    languageToggleLabel: 'Επιλογή γλώσσας',
    languageButtons: {
      en: 'Προβολή σε Αγγλικά',
      el: 'Προβολή σε Ελληνικά'
    },
    hero: {
      title: 'Υπεροχή στην κομμωτική από το 1992',
      lead:
        'Για πάνω από τρεις δεκαετίες, είμαστε σημείο αναφοράς για περιποίηση και styling στο Θησείο, κέντρο Αθήνας. Επαγγελματικό κομμωτήριο με προσωπική φροντίδα.'
    },
    story: {
      title: 'Η Ιστορία μας',
      paragraphs: [
        'Το 1992 η Γιώτα Λιακοπούλου δημιούργησε ένα χώρο επαγγελματικής, προσωπικής περιποίησης στο Θησείο, στο κέντρο της Αθήνας. Ένα κομμωτήριο που συνδυάζει την παράδοση με τη σύγχρονη τεχνολογία.',
        'Το 2004 ο Αλέξανδρος συνέχισε την παράδοση με νέες ιδέες και εκπαίδευση από καταξιωμένες ακαδημίες. Σήμερα, το Alexandros Hair Salon είναι ένα από τα πιο αξιόπιστα κομμωτήρια στο κέντρο της Αθήνας.'
      ],
      milestones: [
        { year: '1992', description: 'Ίδρυση του σαλονιού από τη Γιώτα Λιακοπούλου' },
        { year: '2004', description: 'Ο Αλέξανδρος εντάσσεται μετά από εκπαίδευση' },
        { year: 'Σήμερα', description: 'Χιλιάδες ευχαριστημένοι πελάτες με συνέπεια' }
      ]
    },
    highlightsTitle: 'Γιατί να μας επιλέξετε;',
      highlights: [
        { icon: CrownOutlined, text: '32 χρόνια υπεροχής στην επαγγελματική κομμωτική στο κέντρο Αθήνας' },
        { icon: TeamOutlined, text: 'Οικογενειακό κομμωτήριο στο Θησείο με προσωπική φροντίδα' },
        { icon: ExperimentOutlined, text: 'Σύγχρονες εγκαταστάσεις κομμωτηρίου, χαλαρωτική ατμόσφαιρα' },
        { icon: SafetyCertificateOutlined, text: 'Εξειδικευμένοι κομμωτές με συνεχή εκπαίδευση' },
        { icon: BulbOutlined, text: 'Εξατομικευμένες συμβουλές για το ιδανικό look' }
      ],
      ctaServices: 'Δείτε τις υπηρεσίες μας',
      ctaContact: 'Επικοινωνήστε μαζί μας',
      shopBanner: {
        label: 'ΝΕΟ',
        title: 'Online Shop',
        body: 'Επαγγελματικά προϊόντα μαλλιών EVOQUE — απευθείας στο σπίτι σας.',
        cta: 'Μπείτε στο Shop'
      },
    philosophy: {
      title: 'Η Φιλοσοφία μας',
      cards: [
        { title: 'Τεχνική Υπεροχή', body: 'Κλασικό κούρεμα με σύγχρονη γεωμετρική ακρίβεια.', icon: CheckCircleOutlined },
        { title: 'Προτεραιότητα στην Υγεία', body: 'Προϊόντα/θεραπείες που θρέφουν ενώ διαμορφώνουν.', icon: SafetyCertificateOutlined },
        { title: 'Προσωπική Σχέση', body: 'Ακούμε, κατανοούμε, παραδίδουμε.', icon: SmileOutlined },
        { title: 'Συνεχής Καινοτομία', body: 'Συνεχής εκπαίδευση και ανανέωση τεχνικών.', icon: BulbOutlined }
      ]
    }
  }
};

const Home = ({ language, setLanguage }) => {
  const content = homeContent[language];
  const isGreek = language === 'el';
  const languageToggleLabel = isGreek ? 'Επιλογή γλώσσας' : 'Language selection';
  const getToggleAria = (value) => {
    if (value === 'en') {
      return isGreek ? 'Αλλαγή γλώσσας στα Αγγλικά' : 'Switch language to English';
    }
    return isGreek ? 'Αλλαγή γλώσσας στα Ελληνικά' : 'Switch language to Greek';
  };

  return (
    <div className="homeA-container">
      <section className="heroA-banner" aria-label="Salon gallery">
        <CustomCarousel images={carouselImages} />
        <div className="heroA-overlay">
          <div className="heroA-text">
            <h1 className="heroA-title">{content.hero.title}</h1>
            <p className="heroA-lead">{content.hero.lead}</p>
          </div>
        </div>
      </section>

      <main className="homeA-content">
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
        <section className="cardA-section">
          <h2 className="section-title">
            <HistoryOutlined /> {content.story.title}
          </h2>
          {content.story.paragraphs.map((p, idx) => (
            <p key={`story-para-${idx}`} className="section-paragraph">{p}</p>
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

        <Link to="/shop" className="shop-home-banner">
          <span className="shop-home-badge">{content.shopBanner.label}</span>
          <div className="shop-home-text">
            <span className="shop-home-title">🛍️ {content.shopBanner.title}</span>
            <span className="shop-home-body">{content.shopBanner.body}</span>
          </div>
          <span className="shop-home-cta">{content.shopBanner.cta} →</span>
        </Link>

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
      </main>
    </div>
  );
};

export default Home;
