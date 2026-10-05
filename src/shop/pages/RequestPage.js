import React, { useState } from 'react';
import { Link } from '../../lib/router';
import { FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { useShop } from '../ShopContext';
import { BANK, WHATSAPP } from '../config';
import { CartLines } from '../components/CartDrawer';

// Λειτουργία καταλόγου: το καλάθι γίνεται αίτημα τιμής/διαθεσιμότητας (WhatsApp ή email).
// Δεν ζητάει πληρωμή· η τιμή επιβεβαιώνεται από το κομμωτήριο.
const TXT = {
  el: {
    title: 'Αίτημα τιμής & διαθεσιμότητας',
    lead: 'Στείλε μας τη λίστα και σου απαντάμε με τελική τιμή, διαθεσιμότητα και χρόνο παράδοσης. Δεν χρεώνεσαι τίποτα σε αυτό το βήμα.',
    delivery: 'Παράδοση',
    pickup: 'Παραλαβή από το κομμωτήριο (Θησείο)',
    courier: 'Αποστολή με courier',
    name: 'Όνομα',
    area: 'Περιοχή / Τ.Κ. (για αποστολή)',
    notes: 'Σχόλια (προαιρετικά)',
    viaWa: 'Αποστολή με WhatsApp',
    viaMail: 'Αποστολή με email',
    needName: 'Γράψε το όνομά σου.',
    empty: 'Το καλάθι σου είναι άδειο.',
    back: 'Πίσω στο shop',
    clear: 'Άδειασμα καλαθιού',
    msgHead: 'Γεια σας, θα ήθελα τιμή και διαθεσιμότητα για:',
    msgName: 'Όνομα',
    msgDelivery: 'Παράδοση',
    msgArea: 'Περιοχή',
    msgNotes: 'Σχόλια'
  },
  en: {
    title: 'Price & availability request',
    lead: 'Send us your list and we reply with final price, availability and delivery time. Nothing is charged at this step.',
    delivery: 'Delivery',
    pickup: 'Pick up at the salon (Thiseio)',
    courier: 'Courier delivery',
    name: 'Name',
    area: 'Area / postcode (for delivery)',
    notes: 'Notes (optional)',
    viaWa: 'Send via WhatsApp',
    viaMail: 'Send via email',
    needName: 'Please add your name.',
    empty: 'Your bag is empty.',
    back: 'Back to shop',
    clear: 'Empty bag',
    msgHead: 'Hello, I would like price and availability for:',
    msgName: 'Name',
    msgDelivery: 'Delivery',
    msgArea: 'Area',
    msgNotes: 'Notes'
  }
};

const RequestPage = ({ lang, t }) => {
  const x = TXT[lang] || TXT.el;
  const { lines, clear } = useShop();
  const [delivery, setDelivery] = useState('pickup');
  const [form, setForm] = useState({ name: '', area: '', notes: '' });
  const [err, setErr] = useState('');

  const message = () =>
    [
      x.msgHead,
      ...lines.map((l) => `• ${l.product.brand} ${l.product.name[lang] || l.product.name.el} – ${l.variant.label} x${l.qty}${l.variant.ean ? ` (EAN ${l.variant.ean})` : ''}`),
      '',
      `${x.msgName}: ${form.name}`,
      `${x.msgDelivery}: ${delivery === 'pickup' ? x.pickup : x.courier}`,
      delivery === 'courier' && form.area ? `${x.msgArea}: ${form.area}` : '',
      form.notes ? `${x.msgNotes}: ${form.notes}` : ''
    ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');

  const go = (via) => {
    if (form.name.trim().length < 2) {
      setErr(x.needName);
      return;
    }
    setErr('');
    const text = message();
    const url = via === 'wa'
      ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`
      : `mailto:${BANK.email}?subject=${encodeURIComponent(x.title)}&body=${encodeURIComponent(text)}`;
    window.open(url, via === 'wa' ? '_blank' : '_self', 'noopener');
  };

  if (!lines.length) {
    return (
      <div className="sh sh-pad">
        <h1 className="sh-pdp-title">{x.title}</h1>
        <p className="nh-lead">{x.empty}</p>
        <Link to="/shop" className="nh-btn nh-btn-gold">{x.back}</Link>
      </div>
    );
  }

  return (
    <div className="sh sh-pad">
      <h1 className="sh-pdp-title sh-checkout-title">{x.title}</h1>
      <p className="nh-lead" style={{ marginBottom: 28 }}>{x.lead}</p>
      <div className="sh-checkout">
        <form className="sh-checkout-form" onSubmit={(e) => { e.preventDefault(); go('wa'); }} noValidate>
          <fieldset className="sh-box">
            <legend>{x.delivery}</legend>
            {[['pickup', x.pickup], ['courier', x.courier]].map(([k, l]) => (
              <label key={k} className={`sh-radio-card${delivery === k ? ' is-on' : ''}`}>
                <input type="radio" name="delivery" checked={delivery === k} onChange={() => setDelivery(k)} />
                <span><strong>{l}</strong></span>
              </label>
            ))}
          </fieldset>
          <fieldset className="sh-box">
            <label><span>{x.name} *</span>
              <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
            </label>
            {delivery === 'courier' && (
              <label><span>{x.area}</span>
                <input name="area" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} autoComplete="postal-code" />
              </label>
            )}
            <label><span>{x.notes}</span>
              <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </label>
          </fieldset>
          {err && <p className="sh-note sh-note-err" role="alert">{err}</p>}
          <button type="submit" className="nh-btn nh-btn-gold sh-w100">
            <FaWhatsapp aria-hidden="true" style={{ marginRight: 10 }} /> {x.viaWa}
          </button>
          <button type="button" className="nh-btn nh-btn-ghost sh-w100" onClick={() => go('mail')}>
            <FaEnvelope aria-hidden="true" style={{ marginRight: 10 }} /> {x.viaMail}
          </button>
        </form>
        <aside className="sh-summary" aria-label={t.cart}>
          <CartLines lang={lang} t={t} />
          <p className="sh-muted sh-small">{t.requestNote}</p>
          <button type="button" className="sh-link" onClick={clear}>{x.clear}</button>
        </aside>
      </div>
    </div>
  );
};

export default RequestPage;
