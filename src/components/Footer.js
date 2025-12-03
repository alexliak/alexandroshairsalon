import React from 'react';
import './Footer.css';

const Footer = () => {
  const logoSrc = `${process.env.PUBLIC_URL}/images/logo.jpg`;

  return (
    <footer className="footer">
      <img src={logoSrc} alt="Alexandros Hair Salon - Κομμωτήριο κέντρο Αθήνας, Θησείο" className="footer-logo" />
      <span>© 2025 alexandroshairsalon.gr</span>
    </footer>
  );
};

export default Footer;
