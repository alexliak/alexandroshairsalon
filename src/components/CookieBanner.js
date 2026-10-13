import React, { useEffect, useState } from 'react';
import { Link } from '../lib/router';
import { getConsent, setConsent } from '../lib/consent';

const TXT = {
  el: {
    title: 'Cookies',
    body: 'Χρησιμοποιούμε cookies του Google Analytics για ανώνυμα στατιστικά επισκεψιμότητας και τον χάρτη Google, μόνο αν συμφωνήσεις. Το καλάθι και οι ρυθμίσεις σου λειτουργούν και χωρίς αυτά.',
    more: 'Λεπτομέρειες',
    accept: 'Αποδοχή',
    reject: 'Απόρριψη'
  },
  en: {
    title: 'Cookies',
    body: 'We use Google Analytics cookies for anonymous visit statistics and the Google map, only if you agree. Your bag and settings work without them.',
    more: 'Details',
    accept: 'Accept',
    reject: 'Reject'
  }
};

// Ίδιο μέγεθος, χρώμα και θέση για «Αποδοχή» και «Απόρριψη» (συστάσεις ΑΠΔΠΧ).
export default function CookieBanner({ language }) {
  const t = TXT[language] || TXT.el;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!getConsent()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener('ahs-consent-open', reopen);
    return () => window.removeEventListener('ahs-consent-open', reopen);
  }, []);

  if (!open) return null;
  const choose = (v) => { setConsent(v); setOpen(false); };
  return (
    <div className="nh ck-banner" role="dialog" aria-live="polite" aria-label={t.title}>
      <p className="ck-text">
        {t.body} <Link to="/aporrito#cookies">{t.more}</Link>
      </p>
      <div className="ck-actions">
        <button type="button" className="ck-btn" onClick={() => choose('denied')}>{t.reject}</button>
        <button type="button" className="ck-btn" onClick={() => choose('granted')}>{t.accept}</button>
      </div>
    </div>
  );
}
