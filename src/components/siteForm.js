import React, { useState } from 'react';
import { FaWhatsapp, FaViber, FaPhoneAlt } from 'react-icons/fa';
import { PHONE, PHONE_DISPLAY, WHATSAPP_URL, VIBER_URL } from './NhLayout';

// Πού πηγαίνουν οι φόρμες του site (Αίτηση εργασίας, Μοντέλα).
// FORMS_ENDPOINT: το Google Apps Script web app του κομμωτηρίου (apps-script/forms.gs):
// email στο Gmail + αρχεία στο Drive, χωρίς τρίτη υπηρεσία.
// Αν το αδειάσεις (''), η φόρμα στέλνεται όπως παλιά στη FormSubmit (formsubmit.co).
export const FORMS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyVuiaQ5YLAITO3eT_U_rt-CzjnN6cg5jsn_FZEqhOo5KheLuwwGF7zsQvU-IUrgr7q/exec';

const MAX_BYTES = 18 * 1024 * 1024; // σύνολο αρχείων ανά αποστολή

const txt = {
  el: {
    sending: 'Αποστολή…',
    tooBig: 'Τα αρχεία είναι πολύ μεγάλα (έως 18 MB συνολικά). Δοκίμασε μικρότερο αρχείο ή στείλε το στο WhatsApp ή στο Viber.',
    failed: 'Η αποστολή δεν πέρασε. Δοκίμασε ξανά σε λίγο, ή στείλε μας τα στοιχεία σου εδώ:',
    alt: 'Δεν περνάει η αποστολή; Μπορείς να μας στείλεις και στο',
    call: 'Κλήση',
    tooMany: 'Έως 6 αρχεία σε κάθε αποστολή. Κράτα τα πιο χαρακτηριστικά, ή στείλε τα υπόλοιπα στο WhatsApp ή στο Viber.'
  },
  en: {
    sending: 'Sending…',
    tooBig: 'The files are too large (18 MB in total). Try a smaller file or send it on WhatsApp or Viber.',
    failed: 'Sending didn’t go through. Please try again shortly, or send us your details here:',
    alt: 'Trouble sending? You can also message us on',
    call: 'Call',
    tooMany: 'Up to 6 files per submission. Keep the most telling ones, or send the rest on WhatsApp or Viber.'
  }
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] || '');
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

const MAX_FILES = 6;
const MAX_SIDE = 2000; // px: αρκετό για να φαίνονται καλά τα μαλλιά

// Φωτογραφίες από κινητό (3–8 MB, iPhone HEIC κ.λπ.) → JPEG έως 2000px (~0,3–0,8 MB).
// Αν ο browser δεν μπορεί να τη διαβάσει, στέλνεται η αρχική όπως είναι.
const shrinkImage = (file) =>
  new Promise((resolve) => {
    if (!/^image\//.test(file.type) && !/\.(heic|heif)$/i.test(file.name)) return resolve(file);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * k);
      c.height = Math.round(img.naturalHeight * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob((b) => {
        if (!b || (b.size >= file.size && /jpe?g$/i.test(file.type))) return resolve(file);
        resolve(new File([b], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });

// Χειρισμός αποστολής. Επιστρέφει onSubmit για το <form> και την κατάσταση.
export const useSiteForm = (formKey, lang, onSent) => {
  const [status, setStatus] = useState('idle'); // idle | sending | error | tooBig

  const onSubmit = async (e) => {
    if (!FORMS_ENDPOINT) return; // κανονική αποστολή στη FormSubmit
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get('_honey')) return;
    const body = new URLSearchParams();
    body.append('_form', formKey);
    let files = [];
    for (const [k, v] of fd.entries()) {
      if (v instanceof File) {
        if (v.size) files.push(v);
      } else if (!['_next', '_template', '_captcha'].includes(k)) {
        const prev = body.get(k);
        if (prev !== null && k !== '_form') body.set(k, prev + ', ' + v);
        else body.append(k, v);
      }
    }
    if (files.length > MAX_FILES) {
      setStatus('tooMany');
      return;
    }
    setStatus('sending');
    files = await Promise.all(files.map(shrinkImage));
    if (files.reduce((s, f) => s + f.size, 0) > MAX_BYTES) {
      setStatus('tooBig');
      return;
    }
    try {
      body.append('file_count', String(files.length));
      for (let i = 0; i < files.length; i++) {
        body.append(`file_${i}_name`, files[i].name);
        body.append(`file_${i}_type`, files[i].type || 'application/octet-stream');
        body.append(`file_${i}_data`, await toBase64(files[i]));
      }
      const res = await fetch(FORMS_ENDPOINT, { method: 'POST', body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || res.status);
      setStatus('idle');
      window.history.replaceState(null, '', '#sent');
      onSent();
      window.scrollTo({ top: form.closest('section').offsetTop - 80, behavior: 'smooth' });
    } catch (err) {
      setStatus('error');
    }
  };

  return { onSubmit, status, t: txt[lang] || txt.el };
};

// Κουμπί αποστολής + μήνυμα σφάλματος + εναλλακτικοί δρόμοι επικοινωνίας
export const SubmitArea = ({ label, form }) => {
  const { status, t } = form;
  const contacts = (
    <span className="nh-form-alt-links">
      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><FaWhatsapp aria-hidden="true" /> WhatsApp</a>
      <a href={VIBER_URL}><FaViber aria-hidden="true" /> Viber</a>
      <a href={`tel:${PHONE}`}><FaPhoneAlt aria-hidden="true" /> {PHONE_DISPLAY}</a>
    </span>
  );
  return (
    <div className="nh-job-full nh-form-submit">
      <button type="submit" className="nh-btn nh-btn-gold" disabled={status === 'sending'} aria-busy={status === 'sending'}>
        {status === 'sending' ? t.sending : label}
      </button>
      {status === 'error' || status === 'tooBig' || status === 'tooMany' ? (
        <p className="nh-form-error" role="alert">{status === 'tooBig' ? t.tooBig : status === 'tooMany' ? t.tooMany : t.failed} {contacts}</p>
      ) : (
        <p className="nh-form-alt">{t.alt} {contacts}</p>
      )}
    </div>
  );
};
