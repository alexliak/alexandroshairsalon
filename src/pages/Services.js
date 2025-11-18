import React from 'react';
import {
  ScissorOutlined,
  BgColorsOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  PhoneOutlined,
  StarOutlined,
  HighlightOutlined,
  InfoCircleOutlined
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
    categories: [
      {
        key: 'wash',
        icon: HeartOutlined,
        heading: 'Wash Station',
        subtitle: 'Wash & treatment',
        services: [
          { name: 'Wash', price: '€5' },
          { name: 'Mask', price: '€5' }
        ]
      },
      {
        key: 'haircuts',
        icon: ScissorOutlined,
        heading: 'Haircuts',
        subtitle: 'Cuts & trims',
        services: [
          { name: "Wash & Haircut (women's)", price: '€20' },
          { name: "Wash & Haircut (women's, very thick or long hair)", price: '€23' },
          { name: "Wash & Haircut (men's)", price: '€15' },
          { name: 'Wash & Hair Trimming', price: '€10' },
          { name: 'Wash & Haircut (kids)', price: '€15' },
          { name: 'Beard trim', price: '€5' }
        ]
      },
      {
        key: 'styling',
        icon: HighlightOutlined,
        heading: 'Styling',
        subtitle: 'Blow-dry & styling',
        services: [
          { name: 'Wash & Blow-dry (short)', price: '€14' },
          { name: 'Wash & Blow-dry (medium or long)', price: '€15' },
          { name: 'Wash & Blow-dry (long with curls)', price: '€20' },
          { name: 'Wash & Styling (short)', price: '€10' },
          { name: 'Wash & Updo (evening)', price: 'Upon consultation' },
          { name: 'Braids', price: '€10' }
        ]
      },
      {
        key: 'therapies',
        icon: MedicineBoxOutlined,
        heading: 'Hair Treatments',
        subtitle: 'Care & repair',
        services: [
          { name: 'Intensive nourishment treatment', price: '€19' },
          { name: 'Mask treatment', price: '€5' },
          { name: 'Hair-loss treatment', price: '€5' },
          { name: 'Anti-frizz treatment', price: '€49' },
          { name: 'Keratin treatment', price: '€120-€180' }
        ]
      },
      {
        key: 'color',
        icon: BgColorsOutlined,
        heading: 'Colour Services',
        subtitle: 'Colour & lightening',
        services: [
          { name: 'Roots colour', price: '€30' },
          { name: 'Roots colour without ammonia (INOA)', price: '€33' },
          { name: 'Roots to ends colour', price: '€38-€45' },
          { name: 'Roots lightening (with toner)', price: '€50' },
          { name: 'Roots lightening to ends', price: 'Upon consultation' },
          { name: 'Highlights (partial)', price: '€20-€35' },
          { name: 'Highlights (half head)', price: '€35-€55' },
          { name: 'Highlights (full head)', price: '€55-€80' },
          { name: 'Balayage', price: '€35-€90' },
          { name: 'Toner', price: '€20-€30' }
        ]
      },
      {
        key: 'other',
        icon: StarOutlined,
        heading: 'Additional Services',
        subtitle: 'Special treatments',
        services: [
          { name: 'Perm', price: '€50-€65' },
          { name: 'Bridal package', price: 'Upon consultation' },
          { name: 'Brow grooming', price: '€5' }
        ]
      }
    ],
    notes: {
      heading: 'Notes',
      subtitle: 'Helpful information',
      sections: [
        {
          title: 'Additional charge for long hair',
          body:
            'Colour services and treatments on long or very dense hair require more product and time, so an extra charge may apply. The same goes for lightening dark hair to blonde or for intensive treatments.'
        },
        {
          title: 'Consultations (complimentary & required)',
          body:
            'Speak with us for personalised recommendations. We will work together to find the best possible result.'
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
    categories: [
      {
        key: 'wash',
        icon: HeartOutlined,
        heading: 'Λουτήρας',
        subtitle: 'Wash station',
        services: [
          { name: 'Λούσιμο', price: '5 €' },
          { name: 'Μάσκα', price: '5 €' }
        ]
      },
      {
        key: 'haircuts',
        icon: ScissorOutlined,
        heading: 'Κούρεμα',
        subtitle: 'Haircuts',
        services: [
          { name: 'Λούσιμο / Κούρεμα (γυναικείο)', price: '20 €' },
          {
            name: 'Λούσιμο / Κούρεμα (γυναικείο πυκνά, πολύ μακριά ή δύσκολα μαλλιά)',
            price: '23 €'
          },
          { name: 'Λούσιμο / Κούρεμα (ανδρικό)', price: '15 €' },
          { name: 'Λούσιμο / Τριμάρισμα μαλλιών (ανδρικό)', price: '10 €' },
          { name: 'Λούσιμο / Κούρεμα (παιδικό)', price: '15 €' },
          { name: 'Τριμάρισμα μούσι - γενειάδα', price: '5 €' }
        ]
      },
      {
        key: 'styling',
        icon: HighlightOutlined,
        heading: 'Χτένισμα',
        subtitle: 'Styling',
        services: [
          { name: 'Λούσιμο / Χτένισμα (κοντά)', price: '14 €' },
          { name: 'Λούσιμο / Χτένισμα (μεσαία ή μακριά)', price: '15 €' },
          { name: 'Λούσιμο / Χτένισμα (μακριά με μπούκλες)', price: '20 €' },
          { name: 'Λούσιμο / Φόρμαρισμα (κοντά)', price: '10 €' },
          { name: 'Λούσιμο / Χτένισμα (βραδινό)', price: 'Κατόπιν συνεννόησης' },
          { name: 'Πλεξούδες', price: '10 €' }
        ]
      },
      {
        key: 'therapies',
        icon: MedicineBoxOutlined,
        heading: 'Θεραπείες Μαλλιών',
        subtitle: 'Hair treatments',
        services: [
          { name: 'Θεραπεία εντατικής θρέψης', price: '19 €' },
          { name: 'Θεραπεία μάσκας', price: '5 €' },
          { name: 'Θεραπεία τριχόπτωσης', price: '5 €' },
          { name: 'Θεραπεία Anti-Frizz', price: '49 €' },
          { name: 'Θεραπεία κερατίνης', price: '120-180 €' }
        ]
      },
      {
        key: 'color',
        icon: BgColorsOutlined,
        heading: 'Χρώμα',
        subtitle: 'Colour services',
        services: [
          { name: 'Βαφή / Ρίζες', price: '30 €' },
          { name: 'Βαφή / Ρίζες χωρίς αμμωνία (INOA)', price: '33 €' },
          { name: 'Βαφή / Ρίζες - Άκρες', price: '38-45 €' },
          { name: 'Αποχρωματισμός / Ρίζες (με ρεφλέ)', price: '50 €' },
          { name: 'Αποχρωματισμός / Ρίζες - Άκρες', price: 'Κατόπιν συνεννόησης' },
          { name: 'Ανταύγειες οπτικές', price: '20-35 €' },
          { name: 'Ανταύγειες μισά (1/2)', price: '35-55 €' },
          { name: 'Ανταύγειες όλα', price: '55-80 €' },
          { name: 'Balayage', price: '35-90 €' },
          { name: 'Ρεφλέ', price: '20-30 €' }
        ]
      },
      {
        key: 'other',
        icon: StarOutlined,
        heading: 'Άλλες Υπηρεσίες',
        subtitle: 'Additional services',
        services: [
          { name: 'Περμανάντ', price: '50-65 €' },
          { name: 'Νυφικό πακέτο', price: 'Κατόπιν συνεννόησης' },
          { name: 'Περιποίηση φρυδιών', price: '5 €' }
        ]
      }
    ],
    notes: {
      heading: 'Σημειώσεις',
      subtitle: 'Χρήσιμες πληροφορίες',
      sections: [
        {
          title: 'Επιπλέον χρέωση σε μακριά μαλλιά',
          body:
            'Το χρώμα και γενικά οι εργασίες, ιδιαίτερα αυτές που περιλαμβάνουν προϊόντα σε μακριά ή/και πυκνά μαλλιά, απαιτούν περισσότερο προϊόν και χρόνο, επομένως πιθανόν να υπάρχει πρόσθετη χρέωση. Το ίδιο συμβαίνει και στο χρώμα από σκούρο σε ξανθό ή σε εντατικές θεραπείες.'
        },
        {
          title: 'Συμβουλές (υποχρεωτικές & δωρεάν)',
          body:
            'Για προσωπικές συμβουλές μπορείτε να συζητήσετε μαζί μας. Θα συνεργαστούμε για να βρούμε το καλύτερο δυνατόν.'
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
      <div className="phone-icon-container">
        <a href="tel:+302103465554">
          <PhoneOutlined className="phone-icon" aria-label={content.phoneAriaLabel} />
        </a>
      </div>
    </div>
  );
};

export default Services;
