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
  ArrowRightOutlined
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
    categories: [
      {
        key: 'wash',
        icon: HeartOutlined,
        heading: 'Wash Station',
        subtitle: 'Wash & treatment',
        services: [
          { name: "Wash (with L'Oréal products)", price: '€6' },
          { name: "L'Oréal Mask (short)", price: '€5' },
          { name: "L'Oréal Mask (medium)", price: '€6' },
          { name: "L'Oréal Mask (long)", price: '€7' }
        ]
      },
      {
        key: 'haircuts',
        icon: ScissorOutlined,
        heading: 'Haircuts',
        subtitle: 'Cuts & trims',
        services: [
          { name: "Wash & Haircut (women's)", price: '€25' },
          { name: "Wash & Haircut (women's, very thick or long hair)", price: '€27' },
          { name: "Wash & Haircut (men's)", price: '€18' },
          { name: "Wash & Hair Trimming (men's)", price: '€13' },
          { name: 'Wash & Haircut (kids)', price: '€15' },
          { name: 'Beard trim', price: '€6' }
        ]
      },
      {
        key: 'styling',
        icon: HighlightOutlined,
        heading: 'Styling',
        subtitle: 'Blow-dry & styling',
        services: [
          { name: 'Wash & Blow-dry (short)', price: '€18' },
          { name: 'Wash & Blow-dry (medium)', price: '€19' },
          { name: 'Wash & Blow-dry (long)', price: '€20' },
          { name: 'Wash & Blow-dry (curls)', price: '€25' },
          { name: 'Wash & Styling (short)', price: '€14' },
          { name: 'Wash & Updo (evening)', price: 'Upon consultation' },
          { name: 'Braids', price: '€13' }
        ]
      },
      {
        key: 'therapies',
        icon: MedicineBoxOutlined,
        heading: 'Hair Treatments',
        subtitle: 'Care & repair',
        services: [
          { name: 'Intensive nourishment treatment', price: '€21' },
          { name: 'Hair-loss treatment', price: '€7' },
          { name: 'Anti-frizz treatment', price: '€49' },
          { name: 'Keratin treatment (short/medium)', price: '€120' },
          { name: 'Keratin treatment (long)', price: '€150' }
        ]
      },
      {
        key: 'color',
        icon: BgColorsOutlined,
        heading: 'Colour Services',
        subtitle: 'Colour & lightening',
        services: [
          { name: "Roots colour (L'Oréal Majirel)", price: '€39' },
          { name: 'Roots colour without ammonia (INOA)', price: '€40' },
          { name: 'Roots to ends colour', price: '€38-€45' },
          { name: 'Roots lightening (with toner)', price: '€65' },
          { name: 'Roots to ends lightening (short)', price: '€75' },
          { name: 'Roots to ends lightening (medium)', price: '€90' },
          { name: 'Roots to ends lightening (long)', price: '€110' },
          { name: 'Colour gloss Dia Color (short)', price: '€45' },
          { name: 'Colour gloss Dia Color (medium)', price: '€55' },
          { name: 'Colour gloss Dia Color (long)', price: '€65' },
          { name: 'Wash & Toner Dia Light (short)', price: '€19' },
          { name: 'Wash & Toner Dia Light (medium)', price: '€25' },
          { name: 'Wash & Toner Dia Light (long)', price: 'Upon consultation' },
          { name: 'Wash & Highlights (crown)', price: '€35' },
          { name: 'Wash & Highlights half head (short)', price: '€55' },
          { name: 'Wash & Highlights half head (medium or long)', price: 'Upon consultation' },
          { name: 'Wash & Highlights full head (short)', price: '€60' },
          { name: 'Wash & Highlights full head (medium or long)', price: 'Upon consultation' },
          { name: 'Wash & Baby lights half head (short)', price: '€75' },
          { name: 'Wash & Baby lights (medium or long)', price: 'Upon consultation' },
          { name: 'Wash & Balayage', price: 'Upon consultation' }
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
      ctaContact: 'Δείτε το ωράριο λειτουργίας',
    categories: [
      {
        key: 'wash',
        icon: HeartOutlined,
        heading: 'Λουτήρας',
        subtitle: 'Wash station',
        services: [
          { name: "Λούσιμο (με προϊόντα L'Oréal)", price: '6 €' },
          { name: "Μάσκα L'Oréal (κοντά)", price: '5 €' },
          { name: "Μάσκα L'Oréal (μεσαία)", price: '6 €' },
          { name: "Μάσκα L'Oréal (μακριά)", price: '7 €' }
        ]
      },
      {
        key: 'haircuts',
        icon: ScissorOutlined,
        heading: 'Κούρεμα',
        subtitle: 'Haircuts',
        services: [
          { name: 'Λούσιμο / Κούρεμα (γυναικείο)', price: '25 €' },
          {
            name: 'Λούσιμο / Κούρεμα (γυναικείο πυκνά, πολύ μακριά ή δύσκολα μαλλιά)',
            price: '27 €'
          },
          { name: 'Λούσιμο / Κούρεμα (ανδρικό)', price: '18 €' },
          { name: 'Λούσιμο / Τριμάρισμα μαλλιών (ανδρικό)', price: '13 €' },
          { name: 'Λούσιμο / Κούρεμα (παιδικό)', price: '15 €' },
          { name: 'Τριμάρισμα μούσι - γενειάδα', price: '6 €' }
        ]
      },
      {
        key: 'styling',
        icon: HighlightOutlined,
        heading: 'Χτένισμα',
        subtitle: 'Styling',
        services: [
          { name: 'Λούσιμο / Χτένισμα (κοντά)', price: '18 €' },
          { name: 'Λούσιμο / Χτένισμα (μεσαία)', price: '19 €' },
          { name: 'Λούσιμο / Χτένισμα (μακριά)', price: '20 €' },
          { name: 'Λούσιμο / Χτένισμα (μπούκλες)', price: '25 €' },
          { name: 'Λούσιμο / Φόρμαρισμα (κοντά)', price: '14 €' },
          { name: 'Λούσιμο / Χτένισμα (βραδινό)', price: 'Κατόπιν συνεννόησης' },
          { name: 'Πλεξούδες', price: '13 €' }
        ]
      },
      {
        key: 'therapies',
        icon: MedicineBoxOutlined,
        heading: 'Θεραπείες Μαλλιών',
        subtitle: 'Hair treatments',
        services: [
          { name: 'Θεραπεία εντατικής θρέψης', price: '21 €' },
          { name: 'Θεραπεία τριχόπτωσης', price: '7 €' },
          { name: 'Θεραπεία Anti-Frizz', price: '49 €' },
          { name: 'Θεραπεία κερατίνης (κοντά/μεσαία)', price: '120 €' },
          { name: 'Θεραπεία κερατίνης (μακριά)', price: '150 €' }
        ]
      },
      {
        key: 'color',
        icon: BgColorsOutlined,
        heading: 'Χρώμα',
        subtitle: 'Colour services',
        services: [
          { name: "Βαφή / Ρίζες (L'Oréal Majirel)", price: '39 €' },
          { name: 'Βαφή / Ρίζες χωρίς αμμωνία (INOA)', price: '40 €' },
          { name: 'Βαφή / Ρίζες - Άκρες', price: '38-45 €' },
          { name: 'Αποχρωματισμός / Ρίζες (με ρεφλέ)', price: '65 €' },
          { name: 'Αποχρωματισμός / Ρίζες - Άκρες (κοντά)', price: '75 €' },
          { name: 'Αποχρωματισμός / Ρίζες - Άκρες (μεσαία)', price: '90 €' },
          { name: 'Αποχρωματισμός / Ρίζες - Άκρες (μακριά)', price: '110 €' },
          { name: 'Χρωμογαλάκτωμα Dia Color (κοντά)', price: '45 €' },
          { name: 'Χρωμογαλάκτωμα Dia Color (μεσαία)', price: '55 €' },
          { name: 'Χρωμογαλάκτωμα Dia Color (μακριά)', price: '65 €' },
          { name: 'Λούσιμο / Ρεφλέ Dia Light (κοντά)', price: '19 €' },
          { name: 'Λούσιμο / Ρεφλέ Dia Light (μεσαία)', price: '25 €' },
          { name: 'Λούσιμο / Ρεφλέ Dia Light (μακριά)', price: 'Κατόπιν συνεννόησης' },
          { name: 'Λούσιμο / Ανταύγειες (στεφάνι)', price: '35 €' },
          { name: 'Λούσιμο / Ανταύγειες μισά 1/2 (κοντά)', price: '55 €' },
          { name: 'Λούσιμο / Ανταύγειες μισά 1/2 (μεσαία ή μακριά)', price: 'Κατόπιν συνεννόησης' },
          { name: 'Λούσιμο / Ανταύγειες όλα (κοντά)', price: '60 €' },
          { name: 'Λούσιμο / Ανταύγειες όλα (μεσαία ή μακριά)', price: 'Κατόπιν συνεννόησης' },
          { name: 'Λούσιμο / Baby lights μισά (κοντά)', price: '75 €' },
          { name: 'Λούσιμο / Baby lights (μεσαία ή μακριά)', price: 'Κατόπιν συνεννόησης' },
          { name: 'Λούσιμο / Balayage', price: 'Κατόπιν συνεννόησης' }
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

const Services = ({ language }) => {
  const content = serviceContent[language];

  return (
    <div className="services-container">
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
      <div className="services-cta-links">
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
