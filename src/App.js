import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  ScissorOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  MenuOutlined,
  CloseOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Landing50 from './pages/Landing50';
import Shop from './pages/Shop';
import Chatbot from './components/Chatbot';
import AccessibilityControls from './components/AccessibilityControls';
import { trackPageView } from './utils/analytics';
import './App.css';

const { Sider, Content } = Layout;

const languageOptions = [
  { value: 'en', label: 'EN' },
  { value: 'el', label: 'EL' }
];

const navLabels = {
  en: {
    findUs: 'Find Us',
    callUs: 'Call Us',
    home: 'Home',
    services: 'Services',
    hours: 'Opening Hours',
    shop: 'Online Shop'
  },
  el: {
    findUs: 'Πού θα μας βρείτε',
    callUs: 'Τηλεφώνησέ μας',
    home: 'Αρχική',
    services: 'Υπηρεσίες',
    hours: 'Ωράριο',
    shop: 'Online Shop'
  }
};

const AppContent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [language, setLanguage] = useState('el');
  const [accessibility, setAccessibility] = useState({
    largeText: false,
    highContrast: false
  });
  const location = useLocation();
  const logoSrc = `${process.env.PUBLIC_URL}/images/logo.jpg`;
  const labels = navLabels[language];
  const isGreek = language === 'el';
  const languageToggleLabel = isGreek ? 'Επιλογή γλώσσας' : 'Language selection';
  const getAria = (value) => {
    if (value === 'en') {
      return isGreek ? 'Αλλαγή γλώσσας στα Αγγλικά' : 'Switch language to English';
    }
    return isGreek ? 'Αλλαγή γλώσσας στα Ελληνικά' : 'Switch language to Greek';
  };

  // Check if current route is landing page (standalone, no sidebar/footer)
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

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleMenuClick = () => {
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Landing page renders standalone (no sidebar/footer/chatbot)
  // To remove later: delete Landing50.js, Landing50.css, this route, and sitemap entry
  if (isLandingPage) {
    return <Landing50 />;
  }

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={handleSkipToMain}>
        {isGreek ? 'Μετάβαση στο περιεχόμενο' : 'Skip to main content'}
      </a>
      <button
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label={isGreek ? 'Άνοιγμα μενού' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-sidebar"
      >
        {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
      </button>
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu} aria-hidden="true" />
      )}
      <Layout className="fullscreen-layout">
        <Sider
          theme="dark"
          collapsible={!isMobile}
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          collapsedWidth={64}
          onBreakpoint={(broken) => {
            setIsMobile(broken);
            if (broken) {
              setCollapsed(false);
              setMobileMenuOpen(false);
            }
          }}
          className={`sidebar-robot ${mobileMenuOpen ? 'mobile-open' : ''}`}
          id="mobile-sidebar"
        >
          <div className="logo">
            <img src={logoSrc} alt="Alexandros Hair Salon - Κομμωτήριο κέντρο Αθήνας, Θησείο" className="logo-image" />
            {(!collapsed || isMobile) && <span className="logo-text">Alexandros Hair Salon</span>}
          </div>
          <div
            className={`language-toggle sidebar-language-toggle${collapsed && !isMobile ? ' compact' : ''}`}
            role="group"
            aria-label={languageToggleLabel}
          >
            {languageOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`language-button ${language === option.value ? 'active' : ''}`}
                onClick={() => setLanguage(option.value)}
                aria-pressed={language === option.value}
                aria-label={getAria(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
            items={[
              {
                key: '/',
                icon: <HomeOutlined />,
                label: <Link to="/">{labels.home}</Link>
              },
              {
                key: '/services',
                icon: <ScissorOutlined />,
                label: <Link to="/services">{labels.services}</Link>
              },
              {
                key: '/hours',
                icon: <ClockCircleOutlined />,
                label: <Link to="/hours">{labels.hours}</Link>
              },
              {
                key: '/shop',
                icon: <ShoppingOutlined style={{ color: '#c4a46a', fontSize: '1.1rem' }} />,
                label: (
                  <Link to="/shop" style={{ fontWeight: 800, color: '#c4a46a', fontSize: '1rem', letterSpacing: '0.02em' }}>
                    {labels.shop}
                  </Link>
                ),
                className: 'menu-shop-highlight'
              },
              {
                key: '/find-us',
                icon: <EnvironmentOutlined />,
                label: (
                  <a
                    href="https://www.google.com/maps/place/alexandroshairsalon/@37.976933,23.7162736,17z/data=!3m1!4b1!4m6!3m5!1s0x14a1bd200f79f18d:0x3024d28633f32b4!8m2!3d37.976933!4d23.7162736!16s%2Fg%2F11cm0h21cx?entry=ttu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {labels.findUs}
                  </a>
                )
              },
              {
                key: '/call',
                icon: <PhoneOutlined />,
                label: <a href="tel:+302103465554">{labels.callUs}</a>
              },
              {
                key: '/social',
                icon: <FacebookOutlined />,
                label: 'Social',
                children: [
                  {
                    key: '/social/facebook',
                    label: (
                      <a href="https://www.facebook.com/alexandros.hairsalon" target="_blank" rel="noopener noreferrer">
                        Facebook
                      </a>
                    )
                  }
                ]
              }
            ]}
          />
          <div className="sidebar-accessibility">
            <AccessibilityControls
              language={language}
              settings={accessibility}
              onToggle={toggleAccessibility}
              inline
              collapsed={collapsed && !isMobile}
            />
          </div>
        </Sider>
        <Layout className="content-layout">
          <Content className="content-container">
            <main className="content" id="main-content" tabIndex="-1">
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
            <Footer />
            <Chatbot language={language} setLanguage={setLanguage} />
          </Content>
        </Layout>
      </Layout>
    </>
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
