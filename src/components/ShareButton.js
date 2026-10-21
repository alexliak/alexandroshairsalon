import React, { useEffect, useRef, useState } from 'react';
import { FaWhatsapp, FaViber, FaFacebookF, FaEnvelope, FaLink, FaShareAlt } from 'react-icons/fa';
import { SITE } from './Seo';

// Κουμπί «Αποστολή σε φίλη»: στο κινητό ανοίγει τη λίστα κοινοποίησης του τηλεφώνου
// (WhatsApp, Viber, Messenger, Instagram). Αλλού δείχνει σύνδεσμους WhatsApp, Viber,
// Facebook, email και αντιγραφή. Χωρίς εξωτερικά scripts. Ο σύνδεσμος έχει UTM για το Analytics.
const LABELS = {
  el: { open: 'Επιλογές αποστολής', copy: 'Αντιγραφή συνδέσμου', copied: 'Ο σύνδεσμος αντιγράφηκε', email: 'Email' },
  en: { open: 'Sharing options', copy: 'Copy link', copied: 'Link copied', email: 'Email' }
};

const track = (method, campaign) => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'share', { method, content_type: 'page', item_id: campaign });
    }
  } catch (e) { /* χωρίς analytics */ }
};

const ShareButton = ({ path, campaign, title, text, label, language = 'el' }) => {
  const l = LABELS[language] || LABELS.el;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [native, setNative] = useState(false);
  const boxRef = useRef(null);
  const url = `${SITE}${path}?utm_source=share&utm_medium=referral&utm_campaign=${encodeURIComponent(campaign)}`;
  const message = `${text} ${url}`;

  // Μόνο σε κινητά/tablet: στον υπολογιστή η λίστα του συστήματος είναι φτωχή, οπότε δείχνουμε τα κουμπιά
  useEffect(() => {
    const coarse = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    setNative(Boolean(navigator.share) && coarse);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('click', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('click', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  const onMain = async (e) => {
    e.stopPropagation();
    if (native) {
      try {
        await navigator.share({ title, text, url });
        track('native', campaign);
      } catch (err) {
        if (err && err.name !== 'AbortError') setOpen(true);
      }
      return;
    }
    setOpen((o) => !o);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (err) { /* τίποτα */ }
      ta.remove();
    }
    setCopied(true); track('copy', campaign);
    setTimeout(() => setCopied(false), 2500);
  };

  const links = [
    { k: 'whatsapp', name: 'WhatsApp', icon: <FaWhatsapp />, href: `https://wa.me/?text=${encodeURIComponent(message)}`, blank: true },
    { k: 'viber', name: 'Viber', icon: <FaViber />, href: `viber://forward?text=${encodeURIComponent(message)}` },
    { k: 'facebook', name: 'Facebook', icon: <FaFacebookF />, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, blank: true },
    { k: 'email', name: l.email, icon: <FaEnvelope />, href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}` }
  ];

  return (
    <div className="nh-share" ref={boxRef}>
      <button type="button" className="nh-btn nh-btn-ghost nh-share-btn" onClick={onMain} aria-expanded={native ? undefined : open}>
        <FaShareAlt aria-hidden="true" /> {label}
      </button>
      {open && (
        <div className="nh-share-menu" role="group" aria-label={l.open}>
          {links.map((x) => (
            <a key={x.k} className={`nh-share-item nh-share-${x.k}`} href={x.href}
              target={x.blank ? '_blank' : undefined} rel={x.blank ? 'noopener noreferrer' : undefined}
              onClick={() => track(x.k, campaign)}>
              <span aria-hidden="true">{x.icon}</span>{x.name}
            </a>
          ))}
          <button type="button" className="nh-share-item" onClick={copy}>
            <span aria-hidden="true"><FaLink /></span>{copied ? l.copied : l.copy}
          </button>
          <span className="nh-visually-hidden" role="status" aria-live="polite">{copied ? l.copied : ''}</span>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
