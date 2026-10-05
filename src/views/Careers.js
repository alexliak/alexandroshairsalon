import React, { useEffect, useState } from 'react';
import NhLayout from '../components/NhLayout';
import Pills from '../components/FormPills';
import useInView from '../components/useInView';

// "We are hiring" page. The form posts to FormSubmit (formsubmit.co), which emails
// every application, CV attached, to the salon inbox. No backend needed on GitHub Pages.
// The first application triggers a one-time activation email to the inbox: click it.
const FORM_ACTION = 'https://formsubmit.co/liakopoulosalex@gmail.com';
const THANKS_URL = 'https://alexandroshairsalon.gr/douleia#sent';

const text = {
  el: {
    eyebrow: 'We are hiring · Ζητείται βοηθός κομμωτηρίου',
    title: 'Ψάχνουμε νέο μέλος',
    titleEm: 'στην ομάδα μας.',
    lead: 'Ψάχνουμε βοηθό κομμωτηρίου με όρεξη για δουλειά και εκπαίδευση, σε οικογενειακό κομμωτήριο στο Θησείο που λειτουργεί από το 1992.',
    facts: ['Σταθερή θέση', 'Εκπαίδευση στη δουλειά', 'Και χωρίς εμπειρία'],
    cta: 'Κάνε αίτηση',
    barTop: 'Βοηθός κομμωτηρίου',
    barBottom: 'αίτηση σε 2 λεπτά',
    offerTitle: 'Τι προσφέρουμε',
    offer: [
      'Σταθερή εργασία',
      'Εκπαίδευση στη δουλειά, με L’Oréal Professionnel και Redken',
      'Οικογενειακό, ήρεμο περιβάλλον στο κέντρο της Αθήνας'
    ],
    lookTitle: 'Τι ψάχνουμε',
    look: [
      'Όρεξη για δουλειά και διάθεση να μάθεις',
      'Συνέπεια και ευγένεια με τους πελάτες',
      'Η εμπειρία είναι πλεονέκτημα αλλά όχι απαραίτητη'
    ],
    formTitle: 'Κάνε αίτηση',
    formLead: 'Συμπλήρωσε τα στοιχεία σου και ανέβασε το βιογραφικό σου. Θα σε καλέσουμε εμείς.',
    name: 'Ονοματεπώνυμο',
    phone: 'Τηλέφωνο',
    email: 'Email',
    experience: 'Εμπειρία σε κομμωτήριο',
    expOptions: ['Καμία', 'Έως 1 χρόνο', '1–3 χρόνια', 'Πάνω από 3 χρόνια'],
    availability: 'Από πότε μπορείς να ξεκινήσεις;',
    message: 'Πες μας λίγα λόγια για σένα',
    cv: 'Βιογραφικό (PDF, Word ή φωτογραφία από το κινητό)',
    consent: 'Συμφωνώ να χρησιμοποιηθούν τα στοιχεία μου μόνο για αυτή την αίτηση εργασίας.',
    submit: 'Αποστολή αίτησης',
    subject: 'Νέα αίτηση εργασίας: Βοηθός κομμωτηρίου',
    sentTitle: 'Ευχαριστούμε!',
    sentText: 'Λάβαμε την αίτησή σου. Θα επικοινωνήσουμε μαζί σου σύντομα.'
  },
  en: {
    eyebrow: 'We are hiring · Salon assistant',
    title: 'Join',
    titleEm: 'our team.',
    lead: 'We are looking for a salon assistant who is eager to work and learn, in a family salon in Thiseio open since 1992.',
    facts: ['Stable position', 'On-the-job training', 'No experience needed'],
    cta: 'Apply',
    barTop: 'Salon assistant',
    barBottom: 'apply in 2 minutes',
    offerTitle: 'What we offer',
    offer: [
      'Stable employment',
      'On-the-job training with L’Oréal Professionnel and Redken',
      'A calm, family environment in central Athens'
    ],
    lookTitle: 'What we look for',
    look: [
      'Eagerness to work and learn',
      'Reliability and kindness with clients',
      'Experience is a plus, not a requirement'
    ],
    formTitle: 'Apply',
    formLead: 'Fill in the form and attach your CV. We will call you.',
    name: 'Full name',
    phone: 'Phone',
    email: 'Email',
    experience: 'Salon experience',
    expOptions: ['None', 'Up to 1 year', '1–3 years', 'More than 3 years'],
    availability: 'When can you start?',
    message: 'Tell us a little about yourself',
    cv: 'CV (PDF, Word or a photo from your phone)',
    consent: 'I agree that my details are used only for this job application.',
    submit: 'Send application',
    subject: 'New job application: Salon assistant',
    sentTitle: 'Thank you!',
    sentText: 'We received your application and will contact you soon.'
  }
};

const Careers = ({ language, setLanguage }) => {
  const t = text[language] || text.el;
  const [sent, setSent] = useState(false);
  const formInView = useInView('aitisi');

  useEffect(() => {
    setSent(window.location.hash === '#sent');
  }, []);

  return (
    <NhLayout
      language={language}
      setLanguage={setLanguage}
      mobileBar={sent ? null : formInView ? <></> : (
        <div className="nh-mobile-bar">
          <span className="nh-mobile-bar-text">
            <span>{t.barTop}</span>
            <strong>{t.barBottom}</strong>
          </span>
          <a href="#aitisi" className="nh-btn nh-btn-gold nh-btn-sm">{t.cta}</a>
        </div>
      )}
    >
      <main className="nh-page">
        <section className="nh-page-hero">
          <h1 className="nh-h1 nh-h1-page">
            <span className="nh-eyebrow nh-h1-kicker">{t.eyebrow}</span>
            {t.title} <em>{t.titleEm}</em>
          </h1>
          <p className="nh-lead">{t.lead}</p>
          <ul className="nh-reassure">{t.facts.map((f) => <li key={f}>{f}</li>)}</ul>
          {!sent && <a href="#aitisi" className="nh-btn nh-btn-gold nh-page-cta">{t.cta}</a>}
        </section>

        <section className="nh-info-grid">
          <article className="nh-info-card">
            <h2 className="nh-info-title">{t.offerTitle}</h2>
            <ul className="nh-job-list">
              {t.offer.map((o) => <li key={o}>{o}</li>)}
            </ul>
          </article>
          <article className="nh-info-card">
            <h2 className="nh-info-title">{t.lookTitle}</h2>
            <ul className="nh-job-list">
              {t.look.map((o) => <li key={o}>{o}</li>)}
            </ul>
          </article>
        </section>

        <section className="nh-job-form-wrap" id="aitisi" aria-labelledby="job-form-title">
          {sent ? (
            <div className="nh-info-card nh-info-card-gold" role="status">
              <h2 id="job-form-title" className="nh-info-title">{t.sentTitle}</h2>
              <p>{t.sentText}</p>
            </div>
          ) : (
            <>
              <h2 id="job-form-title" className="nh-h2">{t.formTitle}</h2>
              <p className="nh-lead">{t.formLead}</p>
              <form className="nh-job-form" action={FORM_ACTION} method="POST" encType="multipart/form-data">
                <input type="hidden" name="_subject" value={t.subject} />
                <input type="hidden" name="_next" value={THANKS_URL} />
                <input type="hidden" name="_template" value="table" />
                {/* No FormSubmit captcha step: that extra page re-posts the form without the file, so the CV was lost. The _honey field still blocks spam bots. */}
                <input type="hidden" name="_captcha" value="false" />
                <input type="text" name="_honey" className="nh-hp" tabIndex="-1" autoComplete="off" aria-hidden="true" />

                <label>
                  <span>{t.name} *</span>
                  <input type="text" name="name" required autoComplete="name" />
                </label>
                <label>
                  <span>{t.phone} *</span>
                  <input type="tel" name="phone" required autoComplete="tel" inputMode="tel" />
                </label>
                <label>
                  <span>{t.email} *</span>
                  <input type="email" name="email" required autoComplete="email" />
                </label>
                <Pills label={t.experience} name="experience" options={t.expOptions} required />
                <label>
                  <span>{t.availability}</span>
                  <input type="text" name="availability" />
                </label>
                <label className="nh-job-full">
                  <span>{t.message}</span>
                  <textarea name="message" rows="4" />
                </label>
                <label className="nh-job-full">
                  <span>{t.cv} *</span>
                  <input type="file" name="attachment" required accept=".pdf,.doc,.docx,image/*,.heic" />
                </label>
                <label className="nh-job-full nh-job-consent">
                  <input type="checkbox" name="consent" value="yes" required />
                  <span>{t.consent}</span>
                </label>
                <button type="submit" className="nh-btn nh-btn-gold nh-job-full">{t.submit}</button>
              </form>
            </>
          )}
        </section>
      </main>
    </NhLayout>
  );
};

export default Careers;
