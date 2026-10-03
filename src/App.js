import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Models from './pages/Models';
import { trackPageView } from './utils/analytics';
import './App.css';

// Φορτώνονται μόνο όταν χρειαστούν, ώστε το κινητό να κατεβάζει λιγότερα στην πρώτη επίσκεψη
const ShopApp = lazy(() => import('./shop/ShopApp'));
const Landing50 = lazy(() => import('./pages/Landing50'));
const LegacyLayout = lazy(() => import('./LegacyLayout'));

const blank = <div style={{ minHeight: '100vh', background: '#12100e' }} />;

const AppContent = () => {
  const [language, setLanguage] = useState('el');
  const location = useLocation();

  // Initialize Google Analytics on mount
  // Note: The gtag script is already loaded in index.html with G-S7ZQL4YMJ7
  // This useEffect is kept for compatibility but gtag should already be available
  useEffect(() => {
    // gtag is already initialized in index.html, so tracking will work automatically
    // The trackPageView calls will use the measurement ID from analytics.js fallback
  }, []);

  // Dynamic canonical URL and title based on route
  useEffect(() => {
    const baseUrl = 'https://alexandroshairsalon.gr';
    const canonicalMap = {
      '/': `${baseUrl}/`,
      '/services': `${baseUrl}/services`,
      '/hours': `${baseUrl}/hours`,
      '/prosfora50': `${baseUrl}/prosfora50`,
      '/douleia': `${baseUrl}/douleia`,
      '/montela': `${baseUrl}/montela`
    };

    const titleMap = {
      '/': 'Κομμωτήριο Αθήνα, Θησείο | Κούρεμα, Βαφή, Balayage | Alexandros Hair Salon',
      '/services': 'Τιμές Κομμωτηρίου Αθήνα | Κούρεμα, Βαφή, Balayage | Alexandros Hair Salon',
      '/hours': 'Ωράριο & Επικοινωνία | Κομμωτήριο Θησείο, Αθήνα | Alexandros Hair Salon',
      '/prosfora50': 'Προσφορά 50% Καλωσορίσματος - Alexandros Hair Salon',
      '/shop': 'Shop Επαγγελματικών Προϊόντων Μαλλιών | L’Oréal Professionnel | Alexandros Hair Salon',
      '/douleia': 'Θέση εργασίας: Βοηθός κομμωτηρίου στο Θησείο | Alexandros Hair Salon',
      '/montela': 'Ζητούνται μοντέλα μαλλιών για κούρεμα και χρώμα | Alexandros Hair Salon, Θησείο'
    };

    const descriptionMap = {
      '/': 'Κομμωτήριο στο κέντρο της Αθήνας, Θησείο, από το 1992. Γυναικείο κούρεμα από €28, βαφή L’Oréal & Redken από €35, balayage από €55. 4,6★ στο Google. Κλείσε online.',
      '/services': 'Όλες οι τιμές του κομμωτηρίου στο Θησείο: κουρέματα, Blowout, βαφή ρίζας, ρεφλέ, balayage, κερατίνη και πακέτα, με χρόνους. Online κράτηση, πληρωμή online ή στο κομμωτήριο.',
      '/hours': 'Ωράριο, διεύθυνση και τηλέφωνο του Alexandros Hair Salon, Ερυσίχθονος 3-5, Θησείο, Αθήνα. Κλείσε ραντεβού online.',
      '/prosfora50': 'Κλείσε ραντεβού για κούρεμα, βαφή, ανταύγειες με 50% έκπτωση στην πρώτη σου επίσκεψη. Θησείο, Αθήνα.',
      '/shop': 'Επαγγελματικά προϊόντα μαλλιών L’Oréal Professionnel. Για τιμή και διαθεσιμότητα ρώτα μας. Κομμωτήριο στο Θησείο, Αθήνα.',
      '/douleia': 'Ψάχνουμε βοηθό κομμωτηρίου με όρεξη για δουλειά και εκπαίδευση. Σταθερή εργασία στο Θησείο. Στείλε αίτηση και βιογραφικό online.',
      '/montela': 'Ψάχνουμε μοντέλα μαλλιών, κυρίως γυναίκες κάθε ηλικίας, για νέες τεχνικές χρώματος και κουρέματος και φωτογράφιση. Τίποτα ακραίο, το αποτέλεσμα το αποφασίζουμε μαζί.'
    };

    // Product, cart and admin pages of the shop set their own title, description and canonical
    if (/^\/shop\/.+/.test(location.pathname)) {
      trackPageView(location.pathname);
      return;
    }

    const path = location.pathname.length > 1 ? location.pathname.replace(/\/$/, '') : location.pathname;
    const canonicalUrl = canonicalMap[path] || `${baseUrl}${path}`;
    const pageTitle = titleMap[path] || 'Alexandros Hair Salon';
    const pageDescription = descriptionMap[path] || 'Alexandros Hair Salon – Κομμωτήριο στο κέντρο της Αθήνας, Θησείο.';

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

  // Landing page renders standalone (no sidebar/footer/chatbot)
  // To remove later: delete Landing50.js, Landing50.css, this route, and sitemap entry
  if (location.pathname === '/prosfora50') {
    return <Suspense fallback={blank}><Landing50 /></Suspense>;
  }

  // New 2026 pages render standalone with their own header and footer (NhLayout)
  if (location.pathname === '/') {
    return <Home language={language} setLanguage={setLanguage} />;
  }
  if (location.pathname === '/services') {
    return <Services language={language} setLanguage={setLanguage} />;
  }
  if (location.pathname === '/hours') {
    return <Contact language={language} setLanguage={setLanguage} />;
  }
  if (location.pathname === '/montela') {
    return <Models language={language} setLanguage={setLanguage} />;
  }
  if (location.pathname === '/douleia') {
    return <Careers language={language} setLanguage={setLanguage} />;
  }
  if (location.pathname === '/shop' || location.pathname.startsWith('/shop/')) {
    return (
      <Suspense fallback={blank}>
        <ShopApp language={language} setLanguage={setLanguage} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={blank}>
      <LegacyLayout language={language} setLanguage={setLanguage} />
    </Suspense>
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
