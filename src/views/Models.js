import React, { useEffect, useState } from 'react';
import NhLayout, { BOOK } from '../components/NhLayout';
import Pills from '../components/FormPills';
import useInView from '../components/useInView';

// "Hair models" page. Same delivery as the hiring form: FormSubmit emails each
// application (photo attached, if given) to the salon owner. No phone field on purpose:
// the salon replies by email or Instagram only when an appointment fits.
const FORM_ACTION = 'https://formsubmit.co/liakopoulosalex@gmail.com';
const THANKS_URL = 'https://alexandroshairsalon.gr/montela#sent';

const text = {
  el: {
    eyebrow: 'Ζητούνται μοντέλα μαλλιών · Θησείο',
    title: 'Ψάχνουμε μοντέλα',
    titleEm: 'για κούρεμα και χρώμα.',
    lead: 'Κούρεμα, βαφή, balayage ή ανταύγειες δωρεάν ή σε πολύ χαμηλή τιμή, στο Θησείο. Κυρίως γυναίκες, κάθε ηλικίας, χωρίς εμπειρία ως μοντέλο. Δουλεύουμε νέες τεχνικές και φωτογραφίζουμε το αποτέλεσμα για την εκπαίδευσή μας και για να δείξουμε τη δουλειά μας.',
    facts: ['Δωρεάν ή σε πολύ χαμηλή τιμή', 'Τίποτα ακραίο', 'Φόρμα ενός λεπτού', '5′ από το μετρό Θησείο'],
    cta: 'Δήλωσε συμμετοχή',
    barTop: 'Μοντέλο μαλλιών',
    barBottom: 'φόρμα 1 λεπτού',
    more: 'Περισσότερα για σένα (προαιρετικά)',
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
    formLead: 'Όταν προγραμματίσουμε τεχνική που ταιριάζει στα μαλλιά σου, θα σου στείλουμε μήνυμα.',
    faqTitle: 'Συχνές ερωτήσεις',
    faq: [
      ['Είναι πραγματικά δωρεάν;', 'Κούρεμα και χτένισμα για φωτογράφιση είναι συνήθως δωρεάν. Στο χρώμα, στις ανταύγειες και στο balayage πληρώνεις συνήθως μόνο ένα μικρό μέρος της κανονικής τιμής, για τα υλικά. Το ποσό το ξέρεις πάντα πριν ξεκινήσουμε.'],
      ['Ποιος κάνει τη δουλειά;', 'Έμπειροι κομμωτές του κομμωτηρίου, που δουλεύουν από το 1992, με προϊόντα L’Oréal Professionnel και Redken.'],
      ['Πρέπει να φαίνεται το πρόσωπό μου στις φωτογραφίες;', 'Όχι. Διαλέγεις εσύ αν θα φαίνεται το πρόσωπό σου ή μόνο τα μαλλιά, και υπογράφεις τη συγκατάθεση στο κομμωτήριο πριν από τη φωτογράφιση.'],
      ['Πόση ώρα χρειάζεται;', 'Ένα κούρεμα με χτένισμα περίπου μία ώρα. Χρώμα ή balayage δύο έως τρεις ώρες, μαζί με τη φωτογράφιση.'],
      ['Πού είναι το κομμωτήριο;', 'Ερυσίχθονος 3-5, Θησείο, Αθήνα, πέντε λεπτά με τα πόδια από τον σταθμό του μετρό Θησείο.']
    ],
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
    photo: 'Φωτογραφία των μαλλιών σου σήμερα (προαιρετικά, βοηθά πολύ)',
    message: 'Κάτι άλλο που θέλεις να ξέρουμε;',
    adult: 'Είμαι 18 ετών και άνω.',
    consent: 'Συμφωνώ να χρησιμοποιηθούν τα στοιχεία μου μόνο για να επικοινωνήσετε μαζί μου γι’ αυτό. Για οποιαδήποτε φωτογράφιση θα υπογράψω ξεχωριστή συγκατάθεση στο κομμωτήριο.',
    submit: 'Αποστολή',
    subject: 'Νέα δήλωση: Μοντέλο μαλλιών',
    sentTitle: 'Ευχαριστούμε!',
    sentText: 'Λάβαμε τα στοιχεία σου. Θα σου γράψουμε όταν έχουμε ραντεβού που ταιριάζει στα μαλλιά σου.'
  },
  en: {
    eyebrow: 'Hair models wanted · Thiseio',
    title: 'We are looking for models',
    titleEm: 'for cuts and colour.',
    lead: 'A haircut, colour, balayage or highlights for free or at a very low price, in Thiseio, Athens. Mostly women, of any age, no modelling experience needed. We work on new techniques and photograph the result for our training and to show our work.',
    facts: ['Free or at a very low price', 'Nothing extreme', 'One-minute form', '5′ from Thiseio metro'],
    cta: 'Sign up',
    barTop: 'Hair model',
    barBottom: 'one-minute form',
    more: 'More about you (optional)',
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
    formLead: 'When we schedule a technique that suits your hair, we will message you.',
    faqTitle: 'Questions',
    faq: [
      ['Is it really free?', 'Haircuts and styling for a photo shoot are usually free. For colour, highlights and balayage you usually pay only a small part of the normal price, to cover materials. You always know the amount before we start.'],
      ['Who does the work?', 'The salon’s experienced stylists, working since 1992, with L’Oréal Professionnel and Redken products.'],
      ['Does my face have to be in the photos?', 'No. You choose whether your face is shown or just your hair, and you sign the consent at the salon before any photos.'],
      ['How long does it take?', 'A haircut with styling takes about an hour. Colour or balayage takes two to three hours, photos included.'],
      ['Where is the salon?', 'Erisichthonos 3-5, Thiseio, Athens, a five-minute walk from Thiseio metro station.']
    ],
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
    photo: 'A photo of your hair today (optional, it helps a lot)',
    message: 'Anything else we should know?',
    adult: 'I am 18 or older.',
    consent: 'I agree that my details are used only to contact me about this. For any photo shoot I will sign a separate consent at the salon.',
    submit: 'Send',
    subject: 'New sign-up: Hair model',
    sentTitle: 'Thank you!',
    sentText: 'We received your details. We will write to you when we have an appointment that suits your hair.'
  }
};

// Ερωτήσεις & απαντήσεις και ως δομημένα δεδομένα (FAQPage) για το Google και τους βοηθούς AI.
export const MODELS_FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: text.el.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
};

const Models = ({ language, setLanguage }) => {
  const t = text[language] || text.el;
  const [sent, setSent] = useState(false);
  const formInView = useInView('dilosi');
  const dayNames = language === 'en'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];

  useEffect(() => {
    setSent(window.location.hash === '#sent');
  }, []);

  return (
    <NhLayout
      language={language}
      setLanguage={setLanguage}
      mobileBar={formInView && !sent ? <></> : (
        <div className="nh-mobile-bar">
          <span className="nh-mobile-bar-text">
            <span>{sent ? t.sentTitle : t.barTop}</span>
            <strong>{sent ? '✓' : t.barBottom}</strong>
          </span>
          {sent
            ? <a href={BOOK} className="nh-btn nh-btn-gold nh-btn-sm">{language === 'en' ? 'Book now' : 'Κλείσε ραντεβού'}</a>
            : <a href="#dilosi" className="nh-btn nh-btn-gold nh-btn-sm">{t.cta}</a>}
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
          {!sent && <a href="#dilosi" className="nh-btn nh-btn-gold nh-page-cta">{t.cta}</a>}
        </section>

        <section className="nh-info-grid">
          <article className="nh-info-card nh-info-card--rose">
            <h2 className="nh-info-title">{t.youTitle}</h2>
            <ul className="nh-job-list">{t.you.map((o) => <li key={o}>{o}</li>)}</ul>
          </article>
          <article className="nh-info-card">
            <h2 className="nh-info-title">{t.howTitle}</h2>
            <ul className="nh-job-list">{t.how.map((o) => <li key={o}>{o}</li>)}</ul>
          </article>
        </section>

        <section className="nh-job-form-wrap" id="dilosi" aria-labelledby="model-form-title">
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
                <Pills label={t.length} name="length" options={t.lengthOptions} required />
                <Pills label={t.colour} name="colour" options={t.colourOptions} required />
                <Pills label={t.open} name="open_to" options={t.openOptions} type="checkbox" />
                <label className="nh-job-full">
                  <span>{t.photo}</span>
                  <input type="file" name="attachment" accept="image/*,.heic" />
                </label>
                <details className="nh-job-full nh-more">
                  <summary>{t.more}</summary>
                  <div className="nh-more-body">
                    <label>
                      <span>{t.instagram}</span>
                      <input type="text" name="instagram" placeholder="@" autoCapitalize="none" />
                    </label>
                    <Pills label={t.ageGroup} name="age" options={t.ageOptions} />
                    <label className="nh-job-full">
                      <span>{t.lastColour}</span>
                      <input type="text" name="last_colour" />
                    </label>
                    <Pills label={t.change} name="change" options={t.changeOptions} />
                    <Pills label={t.photos} name="photos" options={t.photosOptions} />
                    <Pills label={t.days} name="day" options={dayNames} type="checkbox" />
                    <label className="nh-job-full">
                      <span>{t.message}</span>
                      <textarea name="message" rows="3" />
                    </label>
                  </div>
                </details>
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

        <section className="nh-menu-section" aria-labelledby="model-faq-title">
          <h2 id="model-faq-title" className="nh-h2 nh-menu-title">{t.faqTitle}</h2>
          <div className="nh-faq">
            {t.faq.map(([q, a]) => (
              <details key={q} className="nh-more">
                <summary>{q}</summary>
                <p className="nh-faq-a">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </NhLayout>
  );
};

export default Models;
