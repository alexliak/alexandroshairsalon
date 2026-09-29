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
          'Our up-to-date opening hours are always on our Google profile (search “Alexandros Hair Salon”). You can also book online at alexandroshairsalon.gr/kratisi.'
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
          'Το ενημερωμένο ωράριο είναι πάντα στο προφίλ μας στο Google (αναζήτησε «Alexandros Hair Salon»). Μπορείς και να κλείσεις online στο alexandroshairsalon.gr/kratisi.'
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
    haircut: 'Haircuts: women’s from €28, men’s €24, kids’ €20. Book online at alexandroshairsalon.gr/kratisi.',
    blowdry: 'Blowout: short €24, medium/long €28, long & thick €35. Event hair & waves from €38.',
    color: 'Root colour from €35, root colour + gloss from €52, gloss from €31, face framing €46, balayage from €55.',
    treatment: 'Hair treatment €10, ampoule €17, keratin smoothing €120–€170.',
    styling: 'Event hair & waves from €38, bridal trial €59. See the Services page for everything.',
    default:
      'Cuts from €20 (kids) / €28 (women), blowout from €24, root colour from €35, treatments from €10. Book online at alexandroshairsalon.gr/kratisi.'
  },
  el: {
    haircut: 'Κουρέματα: γυναικείο από €28, ανδρικό €24, παιδικό €20. Κλείσε online στο alexandroshairsalon.gr/kratisi.',
    blowdry: 'Blowout: κοντά €24, μεσαία/μακριά €28, μακριά & πυκνά €35. Βραδινό χτένισμα & μπούκλες από €38.',
    color: 'Βαφή ρίζας από €35, βαφή ρίζας + ρεφλέ από €52, ρεφλέ από €31, face framing €46, balayage από €55.',
    treatment: 'Θεραπεία €10, αμπούλα €17, κερατίνη €120–170.',
    styling: 'Βραδινό χτένισμα & μπούκλες από €38, νυφικό δοκιμαστικό €59. Δείτε αναλυτικά στη σελίδα Υπηρεσίες.',
    default:
      'Ενδεικτικά: γυναικείο κούρεμα από €28, Blowout από €24, βαφή ρίζας από €35, θεραπείες από €10. Κλείσε online στο alexandroshairsalon.gr/kratisi.'
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
