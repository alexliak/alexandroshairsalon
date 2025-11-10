import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  AppstoreOutlined,
  MailOutlined,
  PhoneOutlined,
  FacebookOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Chatbot from './components/Chatbot';
import './App.css';
import BackgroundAnimation from './components/BackgroundAnimation'; // Import the new component

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

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
    hours: 'Opening Hours'
  },
  el: {
    findUs: 'Πού θα μας βρείτε',
    callUs: 'Τηλεφώνησέ μας',
    home: 'Αρχική',
    services: 'Υπηρεσίες',
    hours: 'Ωράριο'
  }
};

const AppContent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [language, setLanguage] = useState('en');
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

  return (
    <>
      <a className="skip-link" href="#main-content">{isGreek ? 'Μετάβαση στο περιεχόμενο' : 'Skip to main content'}</a>
      <BackgroundAnimation />
      <Layout className="fullscreen-layout">
        <Sider
          theme="dark"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          onBreakpoint={(broken) => {
            setCollapsed(broken);
          }}
          className="sidebar-robot"
        >
          <div className="logo">
            <img src={logoSrc} alt="Alexandros Hair Salon logo" className="logo-image" />
            {!collapsed && <span className="logo-text">Alexandros Hair Salon</span>}
          </div>
          <div className="language-toggle sidebar-language-toggle" role="group" aria-label={languageToggleLabel}>
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
          <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
            <Menu.Item key="/find-us" icon={<EnvironmentOutlined />}>
              <a
                href="https://www.google.com/maps/place/alexandroshairsalon/@37.976933,23.7162736,17z/data=!3m1!4b1!4m6!3m5!1s0x14a1bd200f79f18d:0x3024d28633f32b4!8m2!3d37.976933!4d23.7162736!16s%2Fg%2F11cm0h21cx?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
              >
                {labels.findUs}
              </a>
            </Menu.Item>
            <Menu.Item key="/call" icon={<PhoneOutlined />}>
              <a href="tel:+302103465554">{labels.callUs}</a>
            </Menu.Item>
            <Menu.Item key="/" icon={<HomeOutlined />}>
              <Link to="/">{labels.home}</Link>
            </Menu.Item>
            <Menu.Item key="/services" icon={<AppstoreOutlined />}>
              <Link to="/services">{labels.services}</Link>
            </Menu.Item>
            <Menu.Item key="/hours" icon={<MailOutlined />}>
              <Link to="/hours">{labels.hours}</Link>
            </Menu.Item>
            <SubMenu key="/social" icon={<FacebookOutlined />} title="Social">
              <Menu.Item key="/social/facebook">
                <a href="https://www.facebook.com/alexandros.hairsalon" target="_blank" rel="noopener noreferrer">Facebook</a>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="content-layout">
          <Content className="content-container">
            <main className="content" id="main-content" tabIndex="-1">
              <Routes>
                <Route path="/" element={<Home language={language} setLanguage={setLanguage} />} />
                <Route path="/services" element={<Services language={language} setLanguage={setLanguage} />} />
                <Route path="/hours" element={<Contact language={language} setLanguage={setLanguage} />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot language={language} />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
