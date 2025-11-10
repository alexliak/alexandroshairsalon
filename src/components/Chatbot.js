import React, { useMemo, useState, useRef, useEffect } from 'react';
import { SendOutlined, MessageOutlined, CloseOutlined } from '@ant-design/icons';
import './Chatbot.css';

const responseData = {
  en: {
    welcome: 'Hi! I am the Alexandros Hair Salon assistant. Ask me about opening hours, prices, or how to reach us.',
    placeholder: 'Type your question…',
    emptyWarning: 'Please type a question first.',
    defaultReply: "I'm not sure about that. Please check the menu or contact us on 210 3465 554.",
    keywordsMap: {
      hours: ['hours', 'opening', 'open', 'close', 'schedule', 'time'],
      address: ['address', 'location', 'where', 'map'],
      phone: ['phone', 'call', 'contact', 'number'],
      services: ['service', 'price', 'cost', 'menu', 'cut', 'color', 'treatment', 'styling'],
      appointment: ['appointment', 'book', 'reservation']
    },
    languageToggleLabel: 'Switch chatbot language',
    categories: [
      {
        keywords: ['hour', 'open', 'close', 'schedule', 'opening', 'time'],
        answer:
          'We are open Tuesday & Thursday 08:30–13:30 / 17:30–20:00, Wednesday 08:30–14:00, Friday 08:30–18:00, Saturday 08:30–15:00. Monday is closed.'
      },
      {
        keywords: ['price', 'cost', 'services', 'menu'],
        answer:
          'You can see all prices in the Services page. Highlights, cuts, treatments and more are listed there.'
      },
      {
        keywords: ['address', 'where', 'location', 'map', 'find'],
        answer: 'You can find us at Erysichthonos 3-5, Thiseio 11851, Athens. We are minutes away from Thiseio station.'
      },
      {
        keywords: ['contact', 'phone', 'call', 'facebook'],
        answer: 'Give us a call at 210 3465 554 or reach us through our Facebook page: facebook.com/alexandros.hairsalon.'
      },
      {
        keywords: ['appointment', 'book', 'reservation'],
        answer: 'Please call us at 210 3465 554 to arrange an appointment or discuss availability.'
      }
    ],
    userLabel: 'You',
    botLabel: 'Salon'
  },
  el: {
    welcome:
      'Γεια σας! Είμαι ο βοηθός του Alexandros Hair Salon. Ρωτήστε με για το ωράριο, τις τιμές ή πώς θα μας βρείτε.',
    placeholder: 'Γράψτε την ερώτησή σας…',
    emptyWarning: 'Πρώτα πληκτρολογήστε μια ερώτηση.',
    defaultReply:
      'Δεν είμαι σίγουρος για αυτό. Δείτε το μενού ή καλέστε μας στο 210 3465 554 για περισσότερες πληροφορίες.',
    keywordsMap: {
      hours: ['ωραριο', 'ωρες', 'δουλευετε', 'ανοιχτα', 'κλειστα', 'ωρα'],
      address: ['διευθυνση', 'που', 'βρισκεστε', 'χαρτης', 'θεση'],
      phone: ['τηλεφωνο', 'καλεσε', 'επικοινωνια', 'αριθμος'],
      services: ['υπηρεσιες', 'τιμες', 'κοστος', 'μενου', 'κουρεμα', 'χρωμα', 'θεραπεια', 'χτενισμα'],
      appointment: ['ραντεβου', 'κρατηση', 'κλεισω']
    },
    languageToggleLabel: 'Αλλαγή γλώσσας συνομιλητή',
    categories: [
      {
        keywords: ['ωραριο', 'δουλευετε', 'ανοιχτα', 'κλειστα', 'ωρες', 'ωρα'],
        answer:
          'Είμαστε ανοιχτά Τρίτη & Πέμπτη 08:30–13:30 / 17:30–20:00, Τετάρτη 08:30–14:00, Παρασκευή 08:30–18:00, Σάββατο 08:30–15:00. Τη Δευτέρα παραμένουμε κλειστά.'
      },
      {
        keywords: ['τιμες', 'κοστος', 'υπηρεσιες', 'τιμοκαταλογος'],
        answer:
          'Όλες οι υπηρεσίες και οι τιμές βρίσκονται στη σελίδα Υπηρεσίες. Εκεί θα βρείτε κούρεμα, χτένισμα, χρώμα και θεραπείες.'
      },
      {
        keywords: ['διευθυνση', 'που', 'βρισκεστε', 'χαρτης'],
        answer: 'Βρισκόμαστε στην Ερυσίχθονος 3-5, Θησείο 11851, Αθήνα, λίγα λεπτά από τον σταθμό Θησείο.'
      },
      {
        keywords: ['επικοινωνια', 'τηλεφωνο', 'καλεσε', 'facebook'],
        answer: 'Καλέστε μας στο 210 3465 554 ή βρείτε μας στο facebook.com/alexandros.hairsalon.'
      },
      {
        keywords: ['ραντεβου', 'κλεισω', 'κρατηση'],
        answer: 'Για ραντεβού καλέστε μας στο 210 3465 554 και θα σας εξυπηρετήσουμε άμεσα.'
      }
    ],
    userLabel: 'Εσείς',
    botLabel: 'Salon'
  }
};

const greekKeywordMap = {
  hours: ['ωραριο', 'ωρες', 'δουλευετε', 'ανοιχτα', 'κλειστα', 'ωρα', 'λειτουργια'],
  address: ['διευθυνση', 'που', 'βρισκεστε', 'χαρτης', 'θεση', 'τοποθεσια'],
  phone: ['τηλεφωνο', 'καλεσε', 'επικοινωνια', 'αριθμος', 'τηλ'],
  services: ['υπηρεσιες', 'τιμες', 'κοστος', 'μενου', 'κουρεμα', 'κουρεματα', 'χρωμα', 'βαφη', 'θεραπεια', 'χτενισμα', 'κτενισμα'],
  appointment: ['ραντεβου', 'κρατηση', 'κλεισω', 'κλεισιμο']
};

const greekServiceMap = {
  haircut: ['κουρεμα', 'κουρεματα', 'κουρευω', 'κοπη'],
  blowdry: ['χτενισμα', 'κτενισμα', 'χτενιστα', 'fτενισμα'],
  color: ['βαφη', 'βαφες', 'χρωμα', 'χρωματα', 'ανταυγειες', 'ρεφλε'],
  treatment: ['θεραπεια', 'θεραπειες', 'μασκα', 'κερατινη'],
  styling: ['στηλαρισμα', 'στιλ', 'πλεξιδες', 'βραδινο']
};

const serviceDetails = {
  en: {
    haircut: 'Haircuts start at €20 for women, €15 for men, €15 for kids, beard trim €5.',
    blowdry: 'Blow-dry styling starts at €14 for short hair, €15 for medium/long, €20 for curls.',
    color: 'Colour services: roots €30, ammonia-free roots €33, roots-to-ends €38-45, highlights from €20.',
    treatment: 'Treatments range from €5 (mask) to €49 (anti-frizz) and keratin €120-€180.',
    styling: 'Styling options include updos and braids from €10. For more, check the Services page.',
    default:
      'Cuts from €20, blow-dry from €14, colour services from €30, treatments from €5. Visit the Services page for full details.'
  },
  el: {
    haircut: 'Τα κουρέματα ξεκινούν από €20 (γυναικείο), €15 (ανδρικό), €15 (παιδικό), περιποίηση γενειάδας €5.',
    blowdry: 'Τα χτενίσματα ξεκινούν από €14 (κοντά), €15 (μεσαία/μακριά), €20 για μπούκλες.',
    color: 'Οι βαφές: ρίζες από €30, ρίζες χωρίς αμμωνία €33, ρίζες-άκρες €38-45, ανταύγειες από €20.',
    treatment: 'Θεραπείες από €5 (μάσκα) έως €49 (anti-frizz) και κερατίνη €120-180.',
    styling: 'Για styling/βραδινό/πλεξίδες ξεκινάμε από €10. Δείτε αναλυτικά στη σελίδα Υπηρεσίες.',
    default:
      'Ενδεικτικά: κούρεμα από €20, χτένισμα από €14, βαφή ρίζες από €30, θεραπείες από €5. Δείτε όλες τις τιμές στη σελίδα Υπηρεσίες.'
  }
};

const Chatbot = ({ language = 'el', setLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const content = useMemo(() => responseData[language] || responseData.el, [language]);
  const langKeyMap = useMemo(
    () => (language === 'el' ? greekKeywordMap : content.keywordsMap),
    [language, content]
  );

  const normalizeQuery = (value) => {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ς/g, 'σ')
      .replace(/[^a-z0-9α-ω\s/:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const normalizedCategories = useMemo(
    () =>
      content.categories.map((category) => ({
        ...category,
        normalizedKeywords: category.keywords.map((keyword) => normalizeQuery(keyword))
      })),
    [content]
  );

  const detectIntent = (normalized) => {
    for (const [intent, keywords] of Object.entries(langKeyMap)) {
      if (keywords.some((kw) => normalized.includes(kw))) {
        return intent;
      }
    }
    return null;
  };

  const detectServiceType = (normalized) => {
    const map = language === 'el'
      ? greekServiceMap
      : {
          haircut: ['cut', 'haircut', 'trim'],
          blowdry: ['blowdry', 'blow-dry', 'styling'],
          color: ['color', 'colour', 'dye', 'highlight', 'balayage'],
          treatment: ['treatment', 'mask', 'keratin'],
          styling: ['style', 'updo', 'braid']
        };

    for (const [type, keywords] of Object.entries(map)) {
      if (keywords.some((kw) => normalized.includes(kw))) {
        return type;
      }
    }
    return null;
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setMessages([{ from: 'bot', text: content.welcome }]);
    }
  }, [isOpen, content]);

  const getReply = (question) => {
    const normalized = normalizeQuery(question);
    const intent = detectIntent(normalized);

    if (intent === 'services') {
      const serviceType = detectServiceType(normalized);
      const details = serviceDetails[language] || serviceDetails.el;
      if (serviceType && details[serviceType]) {
        return `${details[serviceType]} ${language === 'el' ? 'Δείτε τη σελίδα Υπηρεσίες για περισσότερα.' : 'See the Services page for more details.'}`;
      }
      return details.default;
    }

    for (const category of normalizedCategories) {
      if (category.normalizedKeywords.some((keyword) => normalized.includes(keyword))) {
        return category.answer;
      }
    }
    return content.defaultReply;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    const reply = getReply(trimmed);
    setMessages((prev) => [
      ...prev,
      { from: 'user', text: trimmed },
      { from: 'bot', text: reply }
    ]);
    setInputValue('');
  };

  return (
    <div className={`chatbot ${isOpen ? 'open' : ''}`}>
      {isOpen ? (
        <div className="chatbot-window" aria-label="Website assistant">
          <header className="chatbot-header">
            <div>Alexandros Hair Salon</div>
            <div className="chatbot-actions">
              {typeof setLanguage === 'function' ? (
                <div className="chatbot-lang-toggle" role="group" aria-label={content.languageToggleLabel}>
                  <button
                    type="button"
                    className={`chatbot-lang-btn ${language === 'en' ? 'active' : ''}`}
                    onClick={() => setLanguage('en')}
                    aria-pressed={language === 'en'}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    className={`chatbot-lang-btn ${language === 'el' ? 'active' : ''}`}
                    onClick={() => setLanguage('el')}
                    aria-pressed={language === 'el'}
                  >
                    EL
                  </button>
                </div>
              ) : null}
              <button
                type="button"
                className="chatbot-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
              >
                <CloseOutlined />
              </button>
            </div>
          </header>
          <div className="chatbot-messages" role="log" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.from}-${index}`} className={`chatbot-message ${message.from}`}>
                <span className="chatbot-label">
                  {message.from === 'user' ? content.userLabel : content.botLabel}
                </span>
                <p>{message.text}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              placeholder={content.placeholder}
              onChange={(event) => setInputValue(event.target.value)}
              aria-label={content.placeholder}
            />
            <button type="submit" aria-label="Send">
              <SendOutlined />
            </button>
          </form>
        </div>
      ) : null}
      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Open salon assistant"
      >
        <MessageOutlined />
      </button>
    </div>
  );
};

export default Chatbot;
