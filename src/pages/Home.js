import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import NhLayout, { BOOK, PHONE, GOOGLE_PROFILE_URL, MAP_EMBED_URL } from '../components/NhLayout';

// Μαθηματικά animation «Κομμωτική 2050»: φορτώνονται σε ξεχωριστό, μικρό αρχείο μετά την αρχική σελίδα.
const MathArt = lazy(() => import('../components/MathArt'));
const Art = (props) => (
  <Suspense fallback={null}>
    <MathArt {...props} />
  </Suspense>
);

// New homepage (2026). Header, footer and mobile booking bar come from NhLayout.

const content = {
  el: {
    eyebrow: 'Κομμωτήριο στο Θησείο, κέντρο Αθήνας · από το 1992',
    titleA: 'Κούρεμα που σου ',
    titleEm: 'μοιάζει.',
    titleB: ' Χρώμα που λάμπει.',
    lead:
      'Τρεις δεκαετίες σε κούρεμα, χρώμα και χτένισμα, με L’Oréal Professionnel και Redken. Διάλεξε υπηρεσία, δες τιμή και ώρα, κλείσε σε ένα λεπτό.',
    bookOnline: 'Κλείσε online',
    seePrices: 'Δες τιμές',
    reassure: ['Πληρωμή online ή στο κομμωτήριο', 'Δωρεάν τεστ ευαισθησίας'],
    artCaption: 'Θησείο · Αθήνα',
    stats: [
      { big: '1992', small: 'οικογενειακό κομμωτήριο' },
      { big: '4,6 ★', small: 'βαθμολογία στο Google' },
      { big: '24/7', small: 'online κράτηση, χωρίς τηλέφωνο' },
      { big: '5′', small: 'με τα πόδια από τον σταθμό Θησείο' }
    ],
    popularEyebrow: 'Οι πιο δημοφιλείς',
    popularTitle: 'Διάλεξε & κλείσε',
    allServices: 'Όλες οι τιμές →',
    services: [
      { tone: 'cut', cat: 'Κουρέματα', name: 'Γυναικείο κούρεμα', desc: 'Pixie, mullet, butterfly, curtain bangs, φιλάρισμα ή κλασικό, με εμπειρία τριών δεκαετιών.', time: '30–45′', price: 'από €28' },
      { tone: 'style', cat: 'Χτένισμα', name: 'Blowout', desc: 'Όγκος και λάμψη με πιστολάκι ή πρέσα. Πρόσθεσε SteamPod για διάρκεια.', time: '25–40′', price: 'από €24' },
      { tone: 'colour', cat: 'Χρώμα', name: 'Βαφή ρίζας + ρεφλέ', desc: 'Κάλυψη λευκών στη ρίζα και ξεχωριστό gloss για λάμψη σε όλο το μαλλί.', time: '1 ώρα', price: 'από €52' },
      { tone: 'light', cat: 'Ανταύγειες', name: 'Balayage', desc: 'Φυσικό, φωτεινό αποτέλεσμα με εύκολη συντήρηση.', time: '1:35–2:45', price: 'από €55' },
      { tone: 'light', cat: 'Ανταύγειες', name: 'No-Bleach ανταύγειες', desc: 'Απαλό φως χωρίς ντεκαπάζ, ιδανικό για πρώτη φορά.', time: '1:20–1:50', price: 'από €51' },
      { tone: 'pack', cat: 'Πακέτα', name: 'Κούρεμα & Blowout', desc: 'Κούρεμα και χτένισμα σε ένα ραντεβού.', time: '45–55′', price: 'από €38' }
    ],
    brandsEyebrow: 'Χρώμα με υπογραφή',
    brandsTitleA: 'Δουλεύουμε με ',
    brandsTitleB: ' και ',
    brandsRows: [
      ['Ρίζα', 'Majirel, INOA χωρίς αμμωνία ή Redken'],
      ['Μήκη', 'ρεφλέ χωρίς αμμωνία: Dia Color, Dia Light, Shades EQ'],
      ['Ξάνοιγμα', 'ντεκαπάζ με ενσωματωμένο bonder ή, όπου γίνεται, χωρίς ντεκαπάζ']
    ],
    brandsText: 'Εκπαιδευόμαστε συνεχώς στις νέες τεχνικές τους.',
    brandsCta: 'Κλείσε χρώμα',
    colorList: [
      ['Βαφή ρίζας – κάλυψη λευκών', 'από €35'],
      ['Βαφή ρίζας + ρεφλέ (gloss)', 'από €52'],
      ['Face framing', '€46'],
      ['Balayage – μερικές', 'από €55']
    ],
    promiseEyebrow: 'Η ματιά μας',
    promiseTitleA: 'Κάθε πρόσωπο έχει όμορφα χαρακτηριστικά. ',
    promiseTitleEm: 'Αρκεί να τα βρεις.',
    promiseText: [
      'Το κούρεμα είναι σχήμα πάνω στο πρόσωπο: μπορεί να το αναδείξει ή να το κρύψει. Γι’ αυτό πρώτα κοιτάμε το πρόσωπο, τα χαρακτηριστικά, την υφή και τη δομή των μαλλιών σου.',
      'Μετά σχεδιάζουμε κούρεμα, χρώμα και χτένισμα μαζί, ως ένα ολοκληρωμένο αποτέλεσμα που σου ταιριάζει και στέκεται στην καθημερινότητά σου.'
    ],
    promiseSign: 'Αλέξανδρος',
    promises: ['Πρώτα ακούμε.', 'Ό,τι δεν σου ταιριάζει, θα σου το πούμε.'],
    joinTitle: 'Έλα στο κομμωτήριο',
    modelsEyebrow: 'Γίνε μοντέλο',
    modelsText: 'Κούρεμα ή χρώμα με νέες τεχνικές, δωρεάν ή σε χαμηλότερη τιμή. Κυρίως γυναίκες, κάθε ηλικίας.',
    modelsCta: 'Δήλωσε συμμετοχή →',
    jobsEyebrow: 'We are hiring',
    jobsText: 'Βοηθός κομμωτηρίου: σταθερή θέση, με εκπαίδευση στη δουλειά.',
    jobsCta: 'Κάνε αίτηση →',
    visitTitleA: 'Σε περιμένουμε',
    visitTitleEm: 'στο Θησείο.',
    address: 'Ερυσίχθονος 3-5, Θησείο, Αθήνα 118\u00a051',
    hours: 'Δες το ωράριο στο Google',
    call: 'Κάλεσε 210 346 5554',
    directions: 'Οδηγίες στον χάρτη',
  },
  en: {
    eyebrow: 'Hair salon in Thiseio, central Athens · since 1992',
    titleA: 'A cut that feels ',
    titleEm: 'like you.',
    titleB: ' Colour that shines.',
    lead:
      'Three decades of cutting, colour and styling, with L’Oréal Professionnel and Redken. Pick a service, see price and time, book in a minute.',
    bookOnline: 'Book online',
    seePrices: 'See prices',
    reassure: ['Pay online or at the salon', 'Free sensitivity test'],
    artCaption: 'Thiseio · Athens',
    stats: [
      { big: '1992', small: 'family-run salon' },
      { big: '4.6 ★', small: 'rating on Google' },
      { big: '24/7', small: 'online booking, no phone call needed' },
      { big: '5′', small: 'walk from Thiseio station' }
    ],
    popularEyebrow: 'Most popular',
    popularTitle: 'Pick & book',
    allServices: 'All prices →',
    services: [
      { tone: 'cut', cat: 'Haircuts', name: 'Women’s haircut', desc: 'Pixie, mullet, butterfly, curtain bangs, texturising or classic, with thirty years of experience.', time: '30–45′', price: 'from €28' },
      { tone: 'style', cat: 'Styling', name: 'Blowout', desc: 'Volume and shine with brush or iron. Add SteamPod for long-lasting results.', time: '25–40′', price: 'from €24' },
      { tone: 'colour', cat: 'Colour', name: 'Root colour + gloss', desc: 'Grey coverage at the root plus a separate gloss for shine throughout.', time: '1 h', price: 'from €52' },
      { tone: 'light', cat: 'Highlights', name: 'Balayage', desc: 'Natural, luminous result that is easy to maintain.', time: '1:35–2:45', price: 'from €55' },
      { tone: 'light', cat: 'Highlights', name: 'No-bleach highlights', desc: 'Soft brightness without bleach, ideal for a first time.', time: '1:20–1:50', price: 'from €51' },
      { tone: 'pack', cat: 'Packages', name: 'Cut & blowout', desc: 'Haircut and styling in one appointment.', time: '45–55′', price: 'from €38' }
    ],
    brandsEyebrow: 'Signature colour',
    brandsTitleA: 'We work with ',
    brandsTitleB: ' and ',
    brandsRows: [
      ['Roots', 'Majirel, ammonia-free INOA or Redken'],
      ['Lengths', 'ammonia-free gloss: Dia Color, Dia Light, Shades EQ'],
      ['Lightening', 'lightener with built-in bonder or, where possible, no bleach at all']
    ],
    brandsText: 'We train continuously in their latest techniques.',
    brandsCta: 'Book colour',
    colorList: [
      ['Root colour & grey coverage', 'from €35'],
      ['Root colour + gloss', 'from €52'],
      ['Face-frame highlights', '€46'],
      ['Partial balayage', 'from €55']
    ],
    promiseEyebrow: 'Our approach',
    promiseTitleA: 'Every face has beautiful features. ',
    promiseTitleEm: 'You just have to find them.',
    promiseText: [
      'A haircut is a shape around the face: it can bring it out or hide it. So we start by looking at your face, your features and the texture and structure of your hair.',
      'Then we design cut, colour and styling together, as one complete result that suits you and works in your everyday life.'
    ],
    promiseSign: 'Alexandros',
    promises: ['We listen first.', 'If something doesn’t suit you, we’ll tell you.'],
    joinTitle: 'Join us at the salon',
    modelsEyebrow: 'Be our model',
    modelsText: 'A cut or colour with new techniques, free or at a lower price. Mostly women, of any age.',
    modelsCta: 'Sign up →',
    jobsEyebrow: 'We are hiring',
    jobsText: 'Salon assistant: a stable position with on-the-job training.',
    jobsCta: 'Apply →',
    visitTitleA: 'See you',
    visitTitleEm: 'in Thiseio.',
    address: 'Erysichthonos 3-5, Thiseio, Athens 118\u00a051',
    hours: 'See opening hours on Google',
    call: 'Call 210 346 5554',
    directions: 'Directions on the map',
  }
};

const Strands = ({ className }) => (
  <svg className={className} viewBox="0 0 760 760" fill="none" aria-hidden="true">
    <path d="M120 740 C 180 520, 420 560, 380 360 S 560 80, 700 20" stroke="currentColor" strokeWidth="1.2" opacity="0.9" />
    <path d="M150 760 C 210 540, 450 580, 410 380 S 590 100, 730 40" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    <path d="M180 780 C 240 560, 480 600, 440 400 S 620 120, 760 60" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    <path d="M90 720 C 150 500, 390 540, 350 340 S 530 60, 670 0" stroke="#f3eee6" strokeWidth="0.6" opacity="0.25" />
    <path d="M210 800 C 270 580, 510 620, 470 420 S 650 140, 790 80" stroke="#f3eee6" strokeWidth="0.6" opacity="0.18" />
  </svg>
);

const Home = ({ language, setLanguage }) => {
  const t = content[language] || content.el;

  return (
    <NhLayout language={language} setLanguage={setLanguage}>

      <main id="top">
        <section className="nh-hero">
          <Strands className="nh-strands" />
          <div className="nh-hero-text">
            <h1 className="nh-h1">
              <span className="nh-eyebrow nh-h1-kicker">{t.eyebrow}</span>
              {t.titleA}
              <em>{t.titleEm}</em>
              {t.titleB}
            </h1>
            <p className="nh-lead">{t.lead}</p>
            <div className="nh-cta-row">
              <a href={BOOK} className="nh-btn nh-btn-gold">{t.bookOnline}</a>
              <Link to="/services" className="nh-btn nh-btn-ghost">{t.seePrices}</Link>
            </div>
            <ul className="nh-reassure">
              {t.reassure.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <div className="nh-hero-art" aria-hidden="true">
            <Art scene="origin" lang={language} className="nh-art-fill" />
          </div>
        </section>

        <section className="nh-stats" aria-label={language === 'el' ? 'Γιατί εμάς' : 'Why us'}>
          {t.stats.map((s) => (
            <div key={s.small} className="nh-stat">
              <span className={`nh-stat-big${s.brand ? ' nh-stat-brand' : ''}`}>{s.big}</span>
              <span className="nh-stat-small">{s.small}</span>
            </div>
          ))}
        </section>

        <section className="nh-section" id="services">
          <div className="nh-section-head">
            <div className="nh-head-with-mark">
              <div className="nh-art-mark" aria-hidden="true">
                <Art scene="harmony" lang={language} className="nh-art-fill" />
              </div>
              <div>
                <span className="nh-eyebrow">{t.popularEyebrow}</span>
                <h2 className="nh-h2">{t.popularTitle}</h2>
              </div>
            </div>
            <Link to="/services" className="nh-underline">{t.allServices}</Link>
          </div>
          <div className="nh-cards">
            {t.services.map((s) => (
              <a key={s.name} href={BOOK} className={`nh-card nh-card--${s.tone}`}>
                <span className="nh-card-cat">{s.cat}</span>
                <span className="nh-card-name">{s.name}</span>
                <span className="nh-card-desc">{s.desc}</span>
                <span className="nh-card-foot">
                  <span className="nh-card-time">{s.time}</span>
                  <span className="nh-card-price">{s.price}</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="nh-brands" id="brands" data-tone-host>
          <div className="nh-brands-text">
            <span className="nh-eyebrow">{t.brandsEyebrow}</span>
            <h2 className="nh-h2">
              {t.brandsTitleA}
              <em>L’Oréal Professionnel</em>
              {t.brandsTitleB}
              <em>Redken</em>.
            </h2>
            <dl className="nh-brands-rows">
              {t.brandsRows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p>{t.brandsText}</p>
          </div>
          <div className="nh-brands-side">
            <div className="nh-art-planet" aria-hidden="true">
              <Art scene="colour" lang={language} legend className="nh-art-fill" />
            </div>
            <ul className="nh-brands-list">
              {t.colorList.map(([name, price]) => (
                <li key={name}>
                  <span>{name}</span>
                  <strong>{price}</strong>
                </li>
              ))}
            </ul>
            <a href={BOOK} className="nh-btn nh-btn-gold">{t.brandsCta}</a>
          </div>
        </section>

        <section className="nh-section nh-promise" aria-labelledby="promise-title">
          <span className="nh-eyebrow">{t.promiseEyebrow}</span>
          <h2 id="promise-title" className="nh-h2 nh-promise-title">
            {t.promiseTitleA}<em>{t.promiseTitleEm}</em>
          </h2>
          <div className="nh-promise-body">
            <div className="nh-promise-text">
              {t.promiseText.map((p) => <p key={p}>{p}</p>)}
              <span className="nh-promise-sign">— {t.promiseSign}</span>
            </div>
            <div className="nh-promise-side">
              <div className="nh-art-chaos" aria-hidden="true">
                <Art scene="chaos" lang={language} className="nh-art-fill" />
              </div>
              <ul className="nh-promise-lines">
                {t.promises.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="nh-join" aria-labelledby="join-title">
          <h2 id="join-title" className="nh-visually-hidden">{t.joinTitle}</h2>
          <Link to="/montela" className="nh-join-tile nh-join-tile--model">
            <span className="nh-join-eyebrow">{t.modelsEyebrow}</span>
            <span className="nh-join-text">{t.modelsText}</span>
            <span className="nh-join-cta">{t.modelsCta}</span>
          </Link>
          <Link to="/douleia" className="nh-join-tile nh-join-tile--job">
            <span className="nh-join-eyebrow">{t.jobsEyebrow}</span>
            <span className="nh-join-text">{t.jobsText}</span>
            <span className="nh-join-cta">{t.jobsCta}</span>
          </Link>
        </section>

        <section className="nh-section nh-visit" id="visit">
          <div className="nh-visit-text">
            <h2 className="nh-h2 nh-h2-xl">
              {t.visitTitleA}
              <br />
              <em>{t.visitTitleEm}</em>
            </h2>
            <p className="nh-visit-info">
              {t.address}
              <br />
              <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">{t.hours}</a>
            </p>
            <div className="nh-cta-row">
              <a href={BOOK} className="nh-btn nh-btn-gold">{t.bookOnline}</a>
              <a href={`tel:${PHONE}`} className="nh-btn nh-btn-ghost">{t.call}</a>
            </div>
            <a href={GOOGLE_PROFILE_URL} className="nh-underline" target="_blank" rel="noopener noreferrer">{t.directions}</a>
          </div>
          <div className="nh-map">
            <iframe
              title={language === 'el' ? 'Χάρτης: Alexandros Hair Salon' : 'Map: Alexandros Hair Salon'}
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </main>

    </NhLayout>
  );
};

export default Home;
