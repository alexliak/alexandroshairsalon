import React, { useEffect, useState } from 'react';
import NhLayout from '../components/NhLayout';

// "Hair models" page. Same delivery as the hiring form: FormSubmit emails each
// application (photo attached, if given) to the salon owner. No phone field on purpose:
// the salon replies by email or Instagram only when an appointment fits.
const FORM_ACTION = 'https://formsubmit.co/liakopoulosalex@gmail.com';
const THANKS_URL = 'https://alexandroshairsalon.gr/montela#sent';

const text = {
  el: {
    eyebrow: 'Γίνε μοντέλο μας',
    title: 'Ψάχνουμε μοντέλα',
    titleEm: 'για κούρεμα και χρώμα.',
    lead: 'Κυρίως γυναίκες, κάθε ηλικίας. Δεν χρειάζεται εμπειρία ως μοντέλο: ψάχνουμε αληθινά μαλλιά και αληθινούς ανθρώπους. Δουλεύουμε νέες τεχνικές χρώματος και κουρέματος και φωτογραφίζουμε το αποτέλεσμα για την εκπαίδευσή μας και για την παρουσίαση της δουλειάς μας.',
    howTitle: 'Πώς γίνεται',
    how: [
      'Ξεκινάμε πάντα με συζήτηση: τι θέλεις, τι σου ταιριάζει, τι δεν θέλεις να αλλάξει.',
      'Τίποτα ακραίο. Το αποτέλεσμα το αποφασίζουμε μαζί και πρέπει να αρέσει πρώτα σε σένα.',
      'Τη δουλειά την κάνουν έμπειροι κομμωτές του κομμωτηρίου, με L’Oréal Professionnel και Redken.'
    ],
    youTitle: 'Τι κερδίζεις',
    you: [
      'Κούρεμα ή χρώμα δωρεάν ή σε πολύ χαμηλότερη τιμή, ανάλογα με την τεχνική.',
      'Επαγγελματικές φωτογραφίες του νέου σου look.',
      'Εσύ αποφασίζεις αν θα φαίνεται το πρόσωπό σου ή μόνο τα μαλλιά.'
    ],
    formTitle: 'Δήλωσε συμμετοχή',
    formLead: 'Συμπλήρωσε τη φόρμα. Όταν προγραμματίσουμε τεχνική που ταιριάζει στα μαλλιά σου, θα σου στείλουμε μήνυμα.',
    name: 'Όνομα',
    email: 'Email',
    instagram: 'Instagram (προαιρετικά)',
    ageGroup: 'Ηλικία',
    ageOptions: ['18–29', '30–44', '45–59', '60+'],
    length: 'Μήκος μαλλιών',
    lengthOptions: ['Κοντά', 'Έως τους ώμους', 'Κάτω από τους ώμους', 'Πολύ μακριά'],
    colour: 'Χρώμα μαλλιών σήμερα',
    colourOptions: ['Φυσικό, χωρίς βαφή', 'Βαμμένα', 'Με ανταύγειες ή ντεκαπάζ', 'Με χένα ή φυτική βαφή'],
    lastColour: 'Πότε βάφτηκαν τελευταία φορά; (αν ισχύει)',
    open: 'Σε τι είσαι ανοιχτή;',
    openOptions: ['Κούρεμα', 'Χρώμα', 'Ανταύγειες / balayage', 'Χτένισμα'],
    change: 'Πόση αλλαγή θέλεις;',
    changeOptions: ['Μικρή, φρεσκάρισμα', 'Αισθητή αλλαγή', 'Είμαι ανοιχτή σε προτάσεις'],
    photos: 'Φωτογραφίες',
    photosOptions: ['Με το πρόσωπό μου', 'Μόνο τα μαλλιά, χωρίς πρόσωπο'],
    days: 'Ποιες μέρες σε βολεύουν;',
    photo: 'Φωτογραφία των μαλλιών σου όπως είναι σήμερα (προαιρετικά, έως 10MB)',
    message: 'Κάτι άλλο που θέλεις να ξέρουμε;',
    adult: 'Είμαι 18 ετών και άνω.',
    consent: 'Συμφωνώ να χρησιμοποιηθούν τα στοιχεία μου μόνο για να επικοινωνήσετε μαζί μου γι’ αυτό. Για οποιαδήποτε φωτογράφιση θα υπογράψω ξεχωριστή συγκατάθεση στο κομμωτήριο.',
    submit: 'Αποστολή',
    subject: 'Νέα δήλωση: Μοντέλο μαλλιών',
    sentTitle: 'Ευχαριστούμε!',
    sentText: 'Λάβαμε τα στοιχεία σου. Θα σου γράψουμε όταν έχουμε ραντεβού που ταιριάζει στα μαλλιά σου.'
  },
  en: {
    eyebrow: 'Be our model',
    title: 'We are looking for models',
    titleEm: 'for cuts and colour.',
    lead: 'Mostly women, of any age. No modelling experience needed: we are looking for real hair and real people. We work on new colour and cutting techniques and photograph the result for our training and to show our work.',
    howTitle: 'How it works',
    how: [
      'We always start with a chat: what you want, what suits you, what you don’t want to change.',
      'Nothing extreme. We decide the result together, and it has to please you first.',
      'The work is done by the salon’s experienced stylists, with L’Oréal Professionnel and Redken.'
    ],
    youTitle: 'What you get',
    you: [
      'A cut or colour for free or at a much lower price, depending on the technique.',
      'Professional photos of your new look.',
      'You decide whether your face is shown or just your hair.'
    ],
    formTitle: 'Sign up',
    formLead: 'Fill in the form. When we schedule a technique that suits your hair, we will message you.',
    name: 'Name',
    email: 'Email',
    instagram: 'Instagram (optional)',
    ageGroup: 'Age',
    ageOptions: ['18–29', '30–44', '45–59', '60+'],
    length: 'Hair length',
    lengthOptions: ['Short', 'Shoulder length', 'Below the shoulders', 'Very long'],
    colour: 'Your hair colour today',
    colourOptions: ['Natural, never coloured', 'Coloured', 'Highlights or bleach', 'Henna or plant dye'],
    lastColour: 'When was it last coloured? (if relevant)',
    open: 'What are you open to?',
    openOptions: ['Haircut', 'Colour', 'Highlights / balayage', 'Styling'],
    change: 'How much change do you want?',
    changeOptions: ['Small, a refresh', 'A noticeable change', 'Open to suggestions'],
    photos: 'Photos',
    photosOptions: ['With my face', 'Hair only, no face'],
    days: 'Which days suit you?',
    photo: 'A photo of your hair as it is today (optional, up to 10MB)',
    message: 'Anything else we should know?',
    adult: 'I am 18 or older.',
    consent: 'I agree that my details are used only to contact me about this. For any photo shoot I will sign a separate consent at the salon.',
    submit: 'Send',
    subject: 'New sign-up: Hair model',
    sentTitle: 'Thank you!',
    sentText: 'We received your details. We will write to you when we have an appointment that suits your hair.'
  }
};

const Select = ({ label, name, options, required }) => (
  <label>
    <span>{label}</span>
    <select name={name} defaultValue="" required={required}>
      <option value="" disabled>—</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </label>
);

const Checks = ({ label, name, options }) => (
  <fieldset className="nh-job-full nh-job-checks">
    <legend>{label}</legend>
    {options.map((o, i) => (
      <label key={o}>
        <input type="checkbox" name={`${name}_${i + 1}`} value={o} />
        <span>{o}</span>
      </label>
    ))}
  </fieldset>
);

const Models = ({ language, setLanguage }) => {
  const t = text[language] || text.el;
  const [sent, setSent] = useState(false);
  const dayNames = language === 'en'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];

  useEffect(() => {
    setSent(window.location.hash === '#sent');
  }, []);

  return (
    <NhLayout language={language} setLanguage={setLanguage}>
      <main className="nh-page">
        <section className="nh-page-hero">
          <span className="nh-eyebrow">{t.eyebrow}</span>
          <h1 className="nh-h1 nh-h1-page">
            {t.title} <em>{t.titleEm}</em>
          </h1>
          <p className="nh-lead">{t.lead}</p>
        </section>

        <section className="nh-info-grid">
          <article className="nh-info-card">
            <h2 className="nh-info-title">{t.howTitle}</h2>
            <ul className="nh-job-list">{t.how.map((o) => <li key={o}>{o}</li>)}</ul>
          </article>
          <article className="nh-info-card">
            <h2 className="nh-info-title">{t.youTitle}</h2>
            <ul className="nh-job-list">{t.you.map((o) => <li key={o}>{o}</li>)}</ul>
          </article>
        </section>

        <section className="nh-job-form-wrap" aria-labelledby="model-form-title">
          {sent ? (
            <div className="nh-info-card nh-info-card-gold" role="status">
              <h2 id="model-form-title" className="nh-info-title">{t.sentTitle}</h2>
              <p>{t.sentText}</p>
            </div>
          ) : (
            <>
              <h2 id="model-form-title" className="nh-h2">{t.formTitle}</h2>
              <p className="nh-lead">{t.formLead}</p>
              <form className="nh-job-form" action={FORM_ACTION} method="POST" encType="multipart/form-data">
                <input type="hidden" name="_subject" value={t.subject} />
                <input type="hidden" name="_next" value={THANKS_URL} />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="text" name="_honey" className="nh-hp" tabIndex="-1" autoComplete="off" aria-hidden="true" />

                <label>
                  <span>{t.name} *</span>
                  <input type="text" name="name" required autoComplete="given-name" />
                </label>
                <label>
                  <span>{t.email} *</span>
                  <input type="email" name="email" required autoComplete="email" />
                </label>
                <label>
                  <span>{t.instagram}</span>
                  <input type="text" name="instagram" placeholder="@" />
                </label>
                <Select label={t.ageGroup} name="age" options={t.ageOptions} />
                <Select label={`${t.length} *`} name="length" options={t.lengthOptions} required />
                <Select label={`${t.colour} *`} name="colour" options={t.colourOptions} required />
                <label className="nh-job-full">
                  <span>{t.lastColour}</span>
                  <input type="text" name="last_colour" />
                </label>
                <Checks label={t.open} name="open_to" options={t.openOptions} />
                <Select label={t.change} name="change" options={t.changeOptions} />
                <Select label={t.photos} name="photos" options={t.photosOptions} />
                <Checks label={t.days} name="day" options={dayNames} />
                <label className="nh-job-full">
                  <span>{t.photo}</span>
                  <input type="file" name="attachment" accept=".jpg,.jpeg,.png,.heic,.webp" />
                </label>
                <label className="nh-job-full">
                  <span>{t.message}</span>
                  <textarea name="message" rows="3" />
                </label>
                <label className="nh-job-full nh-job-consent">
                  <input type="checkbox" name="adult" value="yes" required />
                  <span>{t.adult}</span>
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

export default Models;
