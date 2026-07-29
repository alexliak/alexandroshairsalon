import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Landing50 from './pages/Landing50';
import Shop from './pages/Shop';
import Chatbot from './components/Chatbot';
import { trackPageView } from './utils/analytics';
import './App.css';

const AppContent = () => {
  const [language, setLanguage] = useState('el');
  const [accessibility, setAccessibility] = useState({
    largeText: false,
    highContrast: false
  });
  const location = useLocation();
  const isGreek = language === 'el';

  // Check if current route is landing page (standalone, no nav/footer)
  const isLandingPage = location.pathname === '/prosfora50';

  useEffect(() => {
    const classMap = {
      largeText: 'accessibility-large-text',
      highContrast: 'accessibility-high-contrast'
    };

    Object.entries(classMap).forEach(([key, className]) => {
      if (accessibility[key]) {
        document.documentElement.classList.add(className);
      } else {
        document.documentElement.classList.remove(className);
      }
    });

    return () => {
      Object.values(classMap).forEach((className) => document.documentElement.classList.remove(className));
    };
  }, [accessibility]);

  // Dynamic canonical URL and title based on route
  useEffect(() => {
    const baseUrl = 'https://alexandroshairsalon.gr';
    const canonicalMap = {
      '/': `${baseUrl}/`,
      '/services': `${baseUrl}/services`,
      '/hours': `${baseUrl}/hours`,
      '/prosfora50': `${baseUrl}/prosfora50`
    };

    const titleMap = {
      '/': 'Alexandros Hair Salon | Κομμωτήριο Κέντρο Αθήνας - Θησείο | Από το 1992',
      '/services': 'Υπηρεσίες & Τιμές | Alexandros Hair Salon | Κομμωτήριο Θησείο',
      '/hours': 'Ωράριο Λειτουργίας | Alexandros Hair Salon | Κομμωτήριο Θησείο',
      '/prosfora50': 'Προσφορά 50% Καλωσορίσματος - Alexandros Hair Salon',
      '/shop': 'Επαγγελματικά Προϊόντα Μαλλιών EVOQUE | Κερατίνη, Frizz Control | Alexandros Hair Salon'
    };

    const descriptionMap = {
      '/': 'Alexandros Hair Salon – Κομμωτήριο στο κέντρο της Αθήνας, Θησείο. Επαγγελματική κομμωτική από το 1992.',
      '/services': 'Υπηρεσίες & Τιμές | Alexandros Hair Salon | Κομμωτήριο Θησείο',
      '/hours': 'Ωράριο Λειτουργίας | Alexandros Hair Salon | Κομμωτήριο Θησείο',
      '/prosfora50': 'Κλείσε ραντεβού για κούρεμα, βαφή, ανταύγειες με 50% έκπτωση στην πρώτη σου επίσκεψη. Θησείο, Αθήνα.',
      '/shop': 'Επαγγελματικά προϊόντα μαλλιών EVOQUE για χρήση στο σπίτι. Σαμπουάν κερατίνης, μάσκες για φριζαρισμένα & σγουρά μαλλιά, styling. Αποστολή πανελλαδικά.'
    };

    const canonicalUrl = canonicalMap[location.pathname] || `${baseUrl}${location.pathname}`;
    const pageTitle = titleMap[location.pathname] || 'Alexandros Hair Salon';
    const pageDescription = descriptionMap[location.pathname] || 'Alexandros Hair Salon – Κομμωτήριο στο κέντρο της Αθήνας, Θησείο.';

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Update page title
    document.title = pageTitle;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', pageDescription);

    // Track page view in Google Analytics
    trackPageView(location.pathname);
  }, [location.pathname]);

  // Scroll back to top on navigation (body scroll, no inner scroll container)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleAccessibility = (key) => {
    setAccessibility((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSkipToMain = (event) => {
    event.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
      window.scrollTo({ top: main.offsetTop, behavior: 'smooth' });
    }
  };

  // Landing page renders standalone (no nav/footer/chatbot)
  // To remove later: delete Landing50.js, Landing50.css, this route, and sitemap entry
  if (isLandingPage) {
    return <Landing50 />;
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content" onClick={handleSkipToMain}>
        {isGreek ? 'Μετάβαση στο περιεχόμενο' : 'Skip to main content'}
      </a>
      <TopNav
        language={language}
        setLanguage={setLanguage}
        accessibility={accessibility}
        onToggleAccessibility={toggleAccessibility}
      />
      <main className="site-main" id="main-content" tabIndex="-1">
        <Routes>
          <Route
            path="/"
            element={(
              <Home
                language={language}
                setLanguage={setLanguage}
              />
            )}
          />
          <Route
            path="/services"
            element={<Services language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/hours"
            element={<Contact language={language} setLanguage={setLanguage} />}
          />
          <Route
            path="/prosfora50"
            element={<Landing50 />}
          />
          <Route
            path="/shop"
            element={<Shop language={language} />}
          />
        </Routes>
      </main>
      <Footer language={language} />
      <Chatbot language={language} setLanguage={setLanguage} />
    </div>
  );
};

const App = () => (
  <Router
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}
  >
    <AppContent />
  </Router>
);

export default App;
