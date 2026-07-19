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
          { name: "Wash with L'Oréal shampoo (short)", price: '€5' },
          { name: "Wash with L'Oréal shampoo (medium)", price: '€6' },
          { name: "Wash with L'Oréal shampoo (long)", price: '€7' },
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
          { name: "Haircut only (women's)", price: '€21' },
          { name: "Wash & Haircut (women's, very thick or long hair)", price: '€30' },
          { name: "Haircut only (women's, very thick or long hair)", price: '€26' },
          { name: "Wash & Haircut (men's)", price: '€18' },
          { name: "Haircut only (men's)", price: '€16' },
          { name: 'Wash & Haircut (kids)', price: '€15' },
          { name: 'Haircut only (kids)', price: '€14' },
          { name: "Wash & Hair Trimming (men's)", price: '€13' },
          { name: "Hair Trimming only (men's)", price: '€11' },
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
          { name: 'Wash & Blow-dry (medium)', price: '€20' },
          { name: 'Wash & Blow-dry (long)', price: '€22' },
          { name: 'Wash & Blow-dry (very long & thick)', price: '€25' },
          { name: 'Curls with hot tool or straightener (medium)', price: '€19' },
          { name: 'Curls with hot tool or straightener (long)', price: '€23' },
          { name: 'Curls with Steampod (medium)', price: '€20' },
          { name: 'Curls with Steampod (long)', price: '€25' },
          { name: 'Wash & Styling (short)', price: '€14' },
          { name: 'Braids (without straightening)', price: '€15' },
          { name: 'Updo (evening)', price: 'from €39' },
          { name: 'Bridal styling (trials included)', price: 'from €120' }
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
          { name: 'Roots colour (monthly)', price: '€35' },
          { name: "Roots colour (L'Oréal Majirel)", price: '€39' },
          { name: 'Roots colour without ammonia (INOA)', price: '€40' },
          { name: 'Roots to ends, up to 50g extra colour (short)', price: '+€15' },
          { name: 'Roots to ends, up to 75g extra colour (medium)', price: '+€20' },
          { name: 'Roots to ends, up to 100g extra colour (long)', price: '+€30' },
          { name: 'Roots lightening (with Dia Light toner)', price: '€65' },
          { name: 'Roots to ends lightening with Dia Light toner (short)', price: '€75' },
          { name: 'Roots to ends lightening with Dia Light toner (medium)', price: '€90' },
          { name: 'Roots to ends lightening with Dia Light toner (long)', price: '€110' },
          { name: 'Colour gloss Dia Color (short)', price: '€45' },
          { name: 'Colour gloss Dia Color (medium)', price: '€55' },
          { name: 'Colour gloss Dia Color (long)', price: '€65' },
          { name: 'Toner Dia Light (short)', price: '€19' },
          { name: 'Toner Dia Light (medium)', price: '€25' },
          { name: 'Toner Dia Light (long)', price: '€31' },
          { name: 'Highlights (crown)', price: '€35' },
          { name: 'Highlights half head (short)', price: '€55' },
          { name: 'Highlights half head (medium)', price: '€65' },
          { name: 'Highlights half head (long)', price: '€75' },
          { name: 'Highlights full head (short)', price: '€60' },
          { name: 'Highlights full head (medium)', price: '€75' },
          { name: 'Highlights full head (long)', price: '€85' },
          { name: 'Baby lights half head (short)', price: '€75' },
          { name: 'Baby lights half head (medium)', price: '€85' },
          { name: 'Baby lights half head (long)', price: '€95' },
          { name: 'Foilyage (medium)', price: '€90' },
          { name: 'Foilyage (long)', price: '€100' },
          { name: 'Balayage (medium)', price: '€79' },
          { name: 'Balayage (long)', price: '€99' }
        ]
      },
      {
        key: 'perm',
        icon: SyncOutlined,
        heading: 'Perm',
        subtitle: 'Permanent waves',
        services: [
          { name: 'Perm (short)', price: '€50' },
          { name: 'Perm (medium)', price: '€65' },
          { name: 'Perm (long)', price: '€75' }
        ]
      },
      {
        key: 'packages',
        icon: GiftOutlined,
        heading: 'Packages',
        subtitle: 'Better together',
        services: [
          { name: 'Colour + Haircut + Blow-dry (short)', price: '€69 instead of €78' },
          { name: 'Colour + Haircut + Blow-dry (medium)', price: '€72 instead of €80' },
          { name: 'Colour + Haircut + Blow-dry (long)', price: '€75 instead of €82' },
          { name: 'Colour + Haircut + Styling', price: '€65 instead of €74' },
          { name: 'Colour + Haircut + Nourishment treatment + Blow-dry or Styling (short)', price: '€89 instead of €99' },
          { name: 'Colour + Haircut + Nourishment treatment + Blow-dry or Styling (medium)', price: '€92 instead of €101' },
          { name: 'Colour + Haircut + Nourishment treatment + Blow-dry or Styling (long)', price: '€95 instead of €103' },
          {
            name: 'Highlights / Balayage / Foilyage / Baby lights + Haircut + Blow-dry or Styling',
            price: '+€29'
          }
        ]
      },
      {
        key: 'other',
        icon: StarOutlined,
        heading: 'Additional Services',
        subtitle: 'Special treatments',
        services: [
          { name: 'Brow grooming', price: '€7' }
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
          { name: "Λούσιμο με σαμπουάν L'Oréal (κοντά)", price: '5 €' },
          { name: "Λούσιμο με σαμπουάν L'Oréal (μεσαία)", price: '6 €' },
          { name: "Λούσιμο με σαμπουάν L'Oréal (μακριά)", price: '7 €' },
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
          { name: 'Λούσιμο & Κούρεμα (γυναικείο)', price: '25 €' },
          { name: 'Κούρεμα σκέτο (γυναικείο)', price: '21 €' },
          {
            name: 'Λούσιμο & Κούρεμα (γυναικείο πυκνά, πολύ μακριά ή δύσκολα μαλλιά)',
            price: '30 €'
          },
          {
            name: 'Κούρεμα σκέτο (γυναικείο πυκνά, πολύ μακριά ή δύσκολα μαλλιά)',
            price: '26 €'
          },
          { name: 'Λούσιμο & Κούρεμα (ανδρικό)', price: '18 €' },
          { name: 'Κούρεμα σκέτο (ανδρικό)', price: '16 €' },
          { name: 'Λούσιμο & Κούρεμα (παιδικό)', price: '15 €' },
          { name: 'Κούρεμα σκέτο (παιδικό)', price: '14 €' },
          { name: 'Λούσιμο & Τριμάρισμα μαλλιών (ανδρικό)', price: '13 €' },
          { name: 'Τριμάρισμα μαλλιών σκέτο (ανδρικό)', price: '11 €' },
          { name: 'Τριμάρισμα μούσι - γενειάδα', price: '6 €' }
        ]
      },
      {
        key: 'styling',
        icon: HighlightOutlined,
        heading: 'Χτένισμα',
        subtitle: 'Styling',
        services: [
          { name: 'Λούσιμο & Χτένισμα (κοντά)', price: '18 €' },
          { name: 'Λούσιμο & Χτένισμα (μεσαία)', price: '20 €' },
          { name: 'Λούσιμο & Χτένισμα (μακριά)', price: '22 €' },
          { name: 'Λούσιμο & Χτένισμα (πάρα πολύ μακριά και πυκνά)', price: '25 €' },
          { name: 'Μπούκλες με θερμικό εργαλείο ή πρέσα (μεσαία)', price: '19 €' },
          { name: 'Μπούκλες με θερμικό εργαλείο ή πρέσα (μακριά)', price: '23 €' },
          { name: 'Μπούκλες με Steampod (μεσαία)', price: '20 €' },
          { name: 'Μπούκλες με Steampod (μακριά)', price: '25 €' },
          { name: 'Λούσιμο & Φορμάρισμα (κοντά)', price: '14 €' },
          { name: 'Πλεξούδες (χωρίς ίσιωμα)', price: '15 €' },
          { name: 'Χτένισμα (βραδινό)', price: 'από 39 €' },
          { name: 'Νυφικό χτένισμα (με τα δοκιμαστικά)', price: 'από 120 €' }
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
          { name: 'Βαφή / Ρίζες στον μήνα', price: '35 €' },
          { name: "Βαφή / Ρίζες (L'Oréal Majirel)", price: '39 €' },
          { name: 'Βαφή / Ρίζες χωρίς αμμωνία (INOA)', price: '40 €' },
          { name: 'Βαφή / Ρίζες - Άκρες, έως 50 γρ. υλικό (κοντά)', price: '+15 €' },
          { name: 'Βαφή / Ρίζες - Άκρες, έως 75 γρ. υλικό (μεσαία)', price: '+20 €' },
          { name: 'Βαφή / Ρίζες - Άκρες, έως 100 γρ. υλικό (μακριά)', price: '+30 €' },
          { name: 'Αποχρωματισμός / Ρίζες (με ρεφλέ Dia Light)', price: '65 €' },
          { name: 'Αποχρωματισμός / Ρίζες - Άκρες με ρεφλέ Dia Light (κοντά)', price: '75 €' },
          { name: 'Αποχρωματισμός / Ρίζες - Άκρες με ρεφλέ Dia Light (μεσαία)', price: '90 €' },
          { name: 'Αποχρωματισμός / Ρίζες - Άκρες με ρεφλέ Dia Light (μακριά)', price: '110 €' },
          { name: 'Χρωμογαλάκτωμα Dia Color (κοντά)', price: '45 €' },
          { name: 'Χρωμογαλάκτωμα Dia Color (μεσαία)', price: '55 €' },
          { name: 'Χρωμογαλάκτωμα Dia Color (μακριά)', price: '65 €' },
          { name: 'Ρεφλέ Dia Light (κοντά)', price: '19 €' },
          { name: 'Ρεφλέ Dia Light (μεσαία)', price: '25 €' },
          { name: 'Ρεφλέ Dia Light (μακριά)', price: '31 €' },
          { name: 'Ανταύγειες (στεφάνι)', price: '35 €' },
          { name: 'Ανταύγειες μισά 1/2 (κοντά)', price: '55 €' },
          { name: 'Ανταύγειες μισά 1/2 (μεσαία)', price: '65 €' },
          { name: 'Ανταύγειες μισά 1/2 (μακριά)', price: '75 €' },
          { name: 'Ανταύγειες όλα (κοντά)', price: '60 €' },
          { name: 'Ανταύγειες όλα (μεσαία)', price: '75 €' },
          { name: 'Ανταύγειες όλα (μακριά)', price: '85 €' },
          { name: 'Baby lights μισά (κοντά)', price: '75 €' },
          { name: 'Baby lights μισά (μεσαία)', price: '85 €' },
          { name: 'Baby lights μισά (μακριά)', price: '95 €' },
          { name: 'Foilyage (μεσαία)', price: '90 €' },
          { name: 'Foilyage (μακριά)', price: '100 €' },
          { name: 'Balayage (μεσαία)', price: '79 €' },
          { name: 'Balayage (μακριά)', price: '99 €' }
        ]
      },
      {
        key: 'perm',
        icon: SyncOutlined,
        heading: 'Περμανάντ',
        subtitle: 'Perm',
        services: [
          { name: 'Περμανάντ (κοντά)', price: '50 €' },
          { name: 'Περμανάντ (μεσαία)', price: '65 €' },
          { name: 'Περμανάντ (μακριά)', price: '75 €' }
        ]
      },
      {
        key: 'packages',
        icon: GiftOutlined,
        heading: 'Πακέτα',
        subtitle: 'Συνδυασμοί που συμφέρουν',
        services: [
          { name: 'Βαφή + Κούρεμα + Χτένισμα (κοντά)', price: '69 € αντί 78 €' },
          { name: 'Βαφή + Κούρεμα + Χτένισμα (μεσαία)', price: '72 € αντί 80 €' },
          { name: 'Βαφή + Κούρεμα + Χτένισμα (μακριά)', price: '75 € αντί 82 €' },
          { name: 'Βαφή + Κούρεμα + Φορμάρισμα', price: '65 € αντί 74 €' },
          { name: 'Βαφή + Κούρεμα + Θεραπεία θρέψης + Χτένισμα ή Φορμάρισμα (κοντά)', price: '89 € αντί 99 €' },
          { name: 'Βαφή + Κούρεμα + Θεραπεία θρέψης + Χτένισμα ή Φορμάρισμα (μεσαία)', price: '92 € αντί 101 €' },
          { name: 'Βαφή + Κούρεμα + Θεραπεία θρέψης + Χτένισμα ή Φορμάρισμα (μακριά)', price: '95 € αντί 103 €' },
          {
            name: 'Ανταύγειες / Balayage / Foilyage / Baby lights + Κούρεμα + Χτένισμα ή Φορμάρισμα',
            price: '+29 €'
          }
        ]
      },
      {
        key: 'other',
        icon: StarOutlined,
        heading: 'Άλλες Υπηρεσίες',
        subtitle: 'Additional services',
        services: [
          { name: 'Περιποίηση φρυδιών', price: '7 €' }
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
