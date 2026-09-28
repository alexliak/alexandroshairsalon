import React from 'react';
import { Link } from 'react-router-dom';
import {
  ScissorOutlined,
  BgColorsOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  StarOutlined,
  HighlightOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
  GiftOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import './Services.css';

const serviceContent = {
  en: {
    languageToggleLabel: 'Language selection',
    languageButtons: {
      en: 'View services in English',
      el: 'View services in Greek'
    },
    title: 'Services',
    intro:
      'A clear list of our core services and prices. For bespoke requests we are happy to help.',
    columnHeaders: { service: 'Service', price: 'Price' },
    contactNote: 'For more information call us at ',
    phoneDisplay: '210 3465 554',
    phoneAriaLabel: 'Call Alexandros Hair Salon',
    ctaContact: 'View opening hours',
    bookCta: 'Book online',
    bookNote: 'Pick a service and time in a minute and pay at the salon. Off-peak and last-minute: up to −15% online.',
    categories: [
      {
        key: "haircuts",
        icon: ScissorOutlined,
        heading: "Haircuts",
        subtitle: "",
        services: [
          { name: "Women’s haircut · up to shoulders (30′)", price: "€28" },
          { name: "Women’s haircut · below shoulders or thick (35′)", price: "€31" },
          { name: "Women’s haircut · long & thick or extensions (45′)", price: "€38" },
          { name: "Men’s haircut (30′)", price: "€24" },
          { name: "Kids’ haircut (30′)", price: "€20" },
          { name: "Beard trim (10′)", price: "€9" }
        ]
      },
      {
        key: "styling",
        icon: HighlightOutlined,
        heading: "Blowout & Styling",
        subtitle: "",
        services: [
          { name: "Wash & quick style (20′)", price: "€20" },
          { name: "Blowout · short (25′)", price: "€24" },
          { name: "Blowout · medium or long, or thick short (30′)", price: "€28" },
          { name: "Blowout · long & thick or extensions (40′)", price: "€35" },
          { name: "+ SteamPod flat iron (10′)", price: "€9" },
          { name: "Event hair & waves · up to shoulders (45′)", price: "€38" },
          { name: "Event hair & waves · below shoulders (1 h)", price: "€49" },
          { name: "Bridal trial (1 h 15′)", price: "€59" }
        ]
      },
      {
        key: "color",
        icon: BgColorsOutlined,
        heading: "Hair Colour",
        subtitle: "",
        services: [
          { name: "Root colour & grey coverage · up to 6 weeks · Farcom (40′)", price: "€35" },
          { name: "Root colour & grey coverage · Express 10′ · Redken (40′)", price: "€39" },
          { name: "Root colour & grey coverage · up to 6 weeks · Majirel (40′)", price: "€42" },
          { name: "Root colour & grey coverage · ammonia-free · INOA / Redken (50′)", price: "€44" },
          { name: "Root colour & grey coverage · long regrowth 6+ weeks · Majirel (50′)", price: "€59" },
          { name: "Root colour & grey coverage · ammonia-free · long regrowth (50′)", price: "€65" },
          { name: "+ Extra long / thick hair (15′)", price: "€19" },
          { name: "Root colour + gloss · short (1 h)", price: "€52" },
          { name: "Root colour + gloss · up to shoulders (1 h)", price: "€64" },
          { name: "Root colour + gloss · below shoulders (1 h 05′)", price: "€79" },
          { name: "Hair gloss & toner · short (45′)", price: "€31" },
          { name: "Hair gloss & toner · up to shoulders (50′)", price: "€43" },
          { name: "Hair gloss & toner · below shoulders (1 h)", price: "€53" },
          { name: "Colour correction consultation (1 h 20′)", price: "€40" }
        ]
      },
      {
        key: "highlights",
        icon: StarOutlined,
        heading: "Highlights & Balayage",
        subtitle: "",
        services: [
          { name: "Face-frame highlights (1 h 15′)", price: "€46" },
          { name: "Partial balayage & highlights · short (1 h 35′)", price: "€55" },
          { name: "Partial balayage & highlights · up to shoulders (1 h 50′)", price: "€79" },
          { name: "Partial balayage & highlights · below shoulders (2 h)", price: "€104" },
          { name: "Full balayage & highlights · short (2 h 10′)", price: "€76" },
          { name: "Full balayage & highlights · up to shoulders (2 h 25′)", price: "€100" },
          { name: "Full balayage & highlights · below shoulders (2 h 45′)", price: "€126" },
          { name: "No-bleach highlights · face frame · 9–15 foils (1 h 20′)", price: "€51" },
          { name: "No-bleach highlights · partial · 15–25 foils · up to shoulders (1 h 50′)", price: "€85" }
        ]
      },
      {
        key: "therapies",
        icon: MedicineBoxOutlined,
        heading: "Hair Treatments",
        subtitle: "",
        services: [
          { name: "Shampoo & scalp massage (10′)", price: "€11" },
          { name: "+ Hair treatment (10′)", price: "€10" },
          { name: "Intensive ampoule treatment (30′)", price: "€17" },
          { name: "Keratin smoothing · short to medium (1 h 45′)", price: "€120" },
          { name: "Keratin smoothing · medium to long (2 h)", price: "€150" },
          { name: "Keratin smoothing · long (3 h)", price: "€170" }
        ]
      },
      {
        key: "packages",
        icon: GiftOutlined,
        heading: "Hair Packages",
        subtitle: "",
        services: [
          { name: "Cut & blowout · up to shoulders (45′)", price: "€38" },
          { name: "Cut & blowout · below shoulders or thick (55′)", price: "€45" },
          { name: "Colour, cut & blowout · up to shoulders (1 h 30′)", price: "€63" },
          { name: "Colour, cut & blowout · below shoulders or thick (1 h 40′)", price: "€70" },
          { name: "Root colour & blowout (1 h 15′)", price: "€52" },
          { name: "Balayage, cut & blowout · partial · up to shoulders (2 h 40′)", price: "€100" },
          { name: "Balayage, cut & blowout · partial · below shoulders (3 h 10′)", price: "€133" }
        ]
      }
    ],
    notes: {
      heading: 'Notes',
      subtitle: 'Helpful information',
      sections: [
        {
          title: 'Long or thick hair',
          body:
            'Prices are shown by hair length. For colour on very thick or very long hair there is a +€19 add-on for the extra product and time. Tell us about extensions when you book.'
        },
        {
          title: 'Free consultation & sensitivity test',
          body:
            'Ask us for personal advice. Before your first colour we do a free sensitivity test.'
        }
      ],
      disclaimer: 'Prices may change without prior notice.'
    }
  },
  el: {
    languageToggleLabel: 'Επιλογή γλώσσας',
    languageButtons: {
      en: 'Εμφάνιση υπηρεσιών στα Αγγλικά',
      el: 'Εμφάνιση υπηρεσιών στα Ελληνικά'
    },
    title: 'Υπηρεσίες',
    intro:
      'Ένας κατανοητός κατάλογος με τις βασικές υπηρεσίες και τις τιμές μας. Για εξατομικευμένες ανάγκες είμαστε πάντα διαθέσιμοι να συζητήσουμε.',
    columnHeaders: { service: 'Υπηρεσία', price: 'Τιμή' },
      contactNote: 'Για περισσότερες πληροφορίες καλέστε μας στο ',
      phoneDisplay: '210 3465 554',
      phoneAriaLabel: 'Επικοινωνία με το Alexandros Hair Salon',
      ctaContact: 'Δείτε το ωράριο λειτουργίας',
    bookCta: 'Κλείσε online',
    bookNote: 'Διάλεξε υπηρεσία και ώρα σε 1 λεπτό και πλήρωσε στο κομμωτήριο. Κενές ώρες και τελευταία στιγμή: έως −15% online.',
    categories: [
      {
        key: "haircuts",
        icon: ScissorOutlined,
        heading: "Κουρέματα",
        subtitle: "Haircuts",
        services: [
          { name: "Γυναικείο κούρεμα · έως τους ώμους (30′)", price: "28 €" },
          { name: "Γυναικείο κούρεμα · κάτω από τους ώμους ή πυκνά έως τους ώμους (35′)", price: "31 €" },
          { name: "Γυναικείο κούρεμα · μακριά & πυκνά ή extensions (45′)", price: "38 €" },
          { name: "Ανδρικό κούρεμα (30′)", price: "24 €" },
          { name: "Παιδικό κούρεμα (30′)", price: "20 €" },
          { name: "Γενειάδα (10′)", price: "9 €" }
        ]
      },
      {
        key: "styling",
        icon: HighlightOutlined,
        heading: "Χτένισμα",
        subtitle: "Blowout & Styling",
        services: [
          { name: "Λούσιμο & γρήγορο φορμάρισμα (20′)", price: "20 €" },
          { name: "Blowout · χτένισμα με πιστολάκι ή πρέσα · κοντά (25′)", price: "24 €" },
          { name: "Blowout · χτένισμα με πιστολάκι ή πρέσα · μεσαία ή μακριά, ή πυκνά κοντά (30′)", price: "28 €" },
          { name: "Blowout · χτένισμα με πιστολάκι ή πρέσα · μακριά & πυκνά ή extensions (40′)", price: "35 €" },
          { name: "+ Πρέσα SteamPod (10′)", price: "9 €" },
          { name: "Βραδινό χτένισμα & μπούκλες · έως τους ώμους (45′)", price: "38 €" },
          { name: "Βραδινό χτένισμα & μπούκλες · κάτω από τους ώμους (1 ώρα)", price: "49 €" },
          { name: "Νυφικό δοκιμαστικό (1 ώρα 15′)", price: "59 €" }
        ]
      },
      {
        key: "color",
        icon: BgColorsOutlined,
        heading: "Χρώμα & Gloss",
        subtitle: "Hair Colour",
        services: [
          { name: "Βαφή ρίζας – κάλυψη λευκών · έως 6 εβδομάδες · Farcom (40′)", price: "35 €" },
          { name: "Βαφή ρίζας – κάλυψη λευκών · Express 10′ · Redken (40′)", price: "39 €" },
          { name: "Βαφή ρίζας – κάλυψη λευκών · έως 6 εβδομάδες · Majirel (40′)", price: "42 €" },
          { name: "Βαφή ρίζας – κάλυψη λευκών · χωρίς αμμωνία · INOA / Redken (50′)", price: "44 €" },
          { name: "Βαφή ρίζας – κάλυψη λευκών · μεγάλη ρίζα 6+ εβδομάδες · Majirel (50′)", price: "59 €" },
          { name: "Βαφή ρίζας – κάλυψη λευκών · χωρίς αμμωνία · μεγάλη ρίζα (50′)", price: "65 €" },
          { name: "+ Πολύ πυκνά ή πολύ μακριά μαλλιά (15′)", price: "19 €" },
          { name: "Βαφή ρίζας + ρεφλέ (gloss) · κοντά (1 ώρα)", price: "52 €" },
          { name: "Βαφή ρίζας + ρεφλέ (gloss) · έως τους ώμους (1 ώρα)", price: "64 €" },
          { name: "Βαφή ρίζας + ρεφλέ (gloss) · κάτω από τους ώμους (1 ώρα 05′)", price: "79 €" },
          { name: "Ρεφλέ / Gloss – λάμψη & τόνος · κοντά (45′)", price: "31 €" },
          { name: "Ρεφλέ / Gloss – λάμψη & τόνος · έως τους ώμους (50′)", price: "43 €" },
          { name: "Ρεφλέ / Gloss – λάμψη & τόνος · κάτω από τους ώμους (1 ώρα)", price: "53 €" },
          { name: "Διόρθωση χρώματος – διάγνωση (1 ώρα 20′)", price: "40 €" }
        ]
      },
      {
        key: "highlights",
        icon: StarOutlined,
        heading: "Ανταύγειες & Balayage",
        subtitle: "Highlights & Balayage",
        services: [
          { name: "Face framing – φως στο πρόσωπο (1 ώρα 15′)", price: "46 €" },
          { name: "Balayage ή ανταύγειες – μερικές · κοντά (1 ώρα 35′)", price: "55 €" },
          { name: "Balayage ή ανταύγειες – μερικές · έως τους ώμους (1 ώρα 50′)", price: "79 €" },
          { name: "Balayage ή ανταύγειες – μερικές · κάτω από τους ώμους (2 ώρες)", price: "104 €" },
          { name: "Balayage ή ανταύγειες – ολόκληρες · κοντά (2 ώρες 10′)", price: "76 €" },
          { name: "Balayage ή ανταύγειες – ολόκληρες · έως τους ώμους (2 ώρες 25′)", price: "100 €" },
          { name: "Balayage ή ανταύγειες – ολόκληρες · κάτω από τους ώμους (2 ώρες 45′)", price: "126 €" },
          { name: "No-Bleach ανταύγειες – χωρίς ντεκαπάζ · φωτισμός προσώπου · 9–15 τούφες (1 ώρα 20′)", price: "51 €" },
          { name: "No-Bleach ανταύγειες – χωρίς ντεκαπάζ · μερικές · 15–25 τούφες · έως τους ώμους (1 ώρα 50′)", price: "85 €" }
        ]
      },
      {
        key: "therapies",
        icon: MedicineBoxOutlined,
        heading: "Θεραπείες",
        subtitle: "Hair Treatments",
        services: [
          { name: "Λούσιμο με μασάζ (10′)", price: "11 €" },
          { name: "+ Θεραπεία ενυδάτωσης ή αναδόμησης (10′)", price: "10 €" },
          { name: "Εντατική θεραπεία με αμπούλα (30′)", price: "17 €" },
          { name: "Κερατίνη – ίσιωμα · κοντό έως μεσαίο μήκος (1 ώρα 45′)", price: "120 €" },
          { name: "Κερατίνη – ίσιωμα · μεσαίο έως μακρύ μήκος (2 ώρες)", price: "150 €" },
          { name: "Κερατίνη – ίσιωμα · μακρύ μήκος (3 ώρες)", price: "170 €" }
        ]
      },
      {
        key: "packages",
        icon: GiftOutlined,
        heading: "Πακέτα",
        subtitle: "Hair Packages",
        services: [
          { name: "Κούρεμα & Blowout · έως τους ώμους (45′)", price: "38 €" },
          { name: "Κούρεμα & Blowout · κάτω από τους ώμους ή πυκνά (55′)", price: "45 €" },
          { name: "Βαφή ρίζας, κούρεμα & Blowout · έως τους ώμους (1 ώρα 30′)", price: "63 €" },
          { name: "Βαφή ρίζας, κούρεμα & Blowout · κάτω από τους ώμους ή πυκνά (1 ώρα 40′)", price: "70 €" },
          { name: "Βαφή ρίζας & Blowout (1 ώρα 15′)", price: "52 €" },
          { name: "Balayage, κούρεμα & Blowout · μερικές · έως τους ώμους (2 ώρες 40′)", price: "100 €" },
          { name: "Balayage, κούρεμα & Blowout · μερικές · κάτω από τους ώμους (3 ώρες 10′)", price: "133 €" }
        ]
      }
    ],
    notes: {
      heading: 'Σημειώσεις',
      subtitle: 'Χρήσιμες πληροφορίες',
      sections: [
        {
          title: 'Μακριά ή πυκνά μαλλιά',
          body:
            'Οι τιμές δίνονται ανάλογα με το μήκος. Στη βαφή για πολύ πυκνά ή πολύ μακριά μαλλιά υπάρχει η προσθήκη +19 € για την επιπλέον ποσότητα και τον χρόνο. Αν έχεις extensions, γράψ\' το στην κράτηση.'
        },
        {
          title: 'Δωρεάν συμβουλή & τεστ ευαισθησίας',
          body:
            'Ρώτησέ μας για προσωπική συμβουλή. Πριν από την πρώτη σου βαφή κάνουμε δωρεάν τεστ ευαισθησίας.'
        }
      ],
      disclaimer: 'Οι τιμές δύναται να αναπροσαρμοσθούν χωρίς προηγουμένη ενημέρωση.'
    }
  }
};

const languageOptions = [
  { value: 'en', label: 'EN' },
  { value: 'el', label: 'EL' }
];

const Services = ({ language, setLanguage }) => {
  const content = serviceContent[language];
  const isGreek = language === 'el';
  const languageToggleLabel = isGreek ? 'Επιλογή γλώσσας' : 'Language selection';
  const getAria = (value) => {
    if (value === 'en') {
      return isGreek ? 'Αλλαγή γλώσσας στα Αγγλικά' : 'Switch language to English';
    }
    return isGreek ? 'Αλλαγή γλώσσας στα Ελληνικά' : 'Switch language to Greek';
  };

  return (
    <div className="services-container">
      <div className="language-toggle" role="group" aria-label={languageToggleLabel}>
        {languageOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`language-button ${language === option.value ? 'active' : ''}`}
            onClick={() => setLanguage(option.value)}
            aria-pressed={language === option.value}
            aria-label={getAria(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <h1 className="services-title">{content.title}</h1>
      {content.intro ? <p className="services-intro">{content.intro}</p> : null}
      <div className="services-book">
        <a href="/kratisi/" className="services-book-btn">
          <CalendarOutlined aria-hidden="true" /> {content.bookCta}
        </a>
        <p className="services-book-note">{content.bookNote}</p>
      </div>
      {content.categories.map((category) => {
        const Icon = category.icon;
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
                {category.heading}
                {category.subtitle ? (
                  <span className="service-subtitle">{category.subtitle}</span>
                ) : null}
              </span>
            </h2>
            <div className="service-table-wrapper">
              <table className="service-table">
                <caption className="sr-only">{category.heading}</caption>
                <thead>
                  <tr>
                    <th scope="col">{content.columnHeaders.service}</th>
                    <th scope="col">{content.columnHeaders.price}</th>
                  </tr>
                </thead>
                <tbody>
                  {category.services.map((service) => (
                    <tr key={service.name}>
                      <th scope="row">{service.name}</th>
                      <td data-label={content.columnHeaders.price}>{service.price}</td>
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
            {content.notes.heading}
            <span className="service-subtitle">{content.notes.subtitle}</span>
          </span>
        </h2>
        <div className="service-text">
          {content.notes.sections.map((section) => (
            <React.Fragment key={section.title}>
              <h3 className="notes-title">{section.title}</h3>
              <p>{section.body}</p>
            </React.Fragment>
          ))}
          <p className="notes-disclaimer">{content.notes.disclaimer}</p>
        </div>
      </section>
      <p className="services-note">
        {content.contactNote}
        <a className="services-phone" href="tel:+302103465554">
          <PhoneOutlined className="phone-icon" aria-hidden="true" /> {content.phoneDisplay}
        </a>
        .
      </p>
      <div className="services-cta-links">
        <a href="/kratisi/" className="services-book-btn">
          <CalendarOutlined aria-hidden="true" /> {content.bookCta}
        </a>
        <Link to="/hours" className="services-cta-link">
          {content.ctaContact} <ArrowRightOutlined />
        </Link>
      </div>
      <div className="phone-icon-container">
        <a href="tel:+302103465554">
          <PhoneOutlined className="phone-icon" aria-label={content.phoneAriaLabel} />
        </a>
      </div>
    </div>
  );
};

export default Services;
