import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { money, t as tr } from '../catalog';
import { useShop } from '../ShopContext';
import { BANK, EMAILJS } from '../config';
import { CartLines } from '../components/CartDrawer';

const TXT = {
  el: {
    title: 'Καλάθι & παραγγελία',
    delivery: 'Παράδοση',
    pickup: 'Παραλαβή από το κομμωτήριο',
    pickupNote: 'Ερυσίχθονος 3-5, Θησείο · Δωρεάν',
    courier: 'Αποστολή με courier',
    courierNote: 'Πανελλαδικά · το κόστος σου το επιβεβαιώνουμε με email',
    details: 'Στοιχεία',
    name: 'Ονοματεπώνυμο',
    phone: 'Κινητό',
    email: 'Email',
    address: 'Διεύθυνση',
    city: 'Πόλη',
    zip: 'Τ.Κ.',
    notes: 'Σχόλια (προαιρετικά)',
    payment: 'Πληρωμή',
    bank: 'Τραπεζική κατάθεση ή IRIS',
    bankNote: 'Σου στέλνουμε email με το σύνολο και τα στοιχεία. Η παραγγελία ξεκινά μόλις λάβουμε την πληρωμή.',
    cards: 'Κάρτα, Apple Pay, Google Pay, PayPal, Klarna',
    soon: 'σύντομα',
    total: 'Σύνολο προϊόντων',
    shipping: 'Μεταφορικά',
    shippingFree: 'Δωρεάν',
    shippingTbd: 'Επιβεβαιώνεται με email',
    send: 'Αποστολή παραγγελίας',
    sending: 'Αποστολή…',
    required: 'Συμπλήρωσε όλα τα υποχρεωτικά πεδία.',
    unpriced: 'Κάποια προϊόντα δεν έχουν ακόμη τιμή: θα σου την επιβεβαιώσουμε με email.',
    error: 'Κάτι πήγε στραβά. Κάλεσέ μας στο 210 346 5554.',
    successTitle: 'Η παραγγελία σου στάλθηκε!',
    successMsg: 'Σου στείλαμε email επιβεβαίωσης. Για να ξεκινήσει η αποστολή, κατάθεσε το ποσό σε έναν από τους λογαριασμούς και στείλε μας την απόδειξη στο',
    holder: 'Δικαιούχος',
    iris: 'IRIS (ΑΦΜ ή κινητό)',
    consent: 'Συμφωνώ να χρησιμοποιηθούν τα στοιχεία μου μόνο για την παραγγελία.',
    empty: 'Το καλάθι σου είναι άδειο.',
    back: 'Πίσω στο shop'
  },
  en: {
    title: 'Bag & order',
    delivery: 'Delivery',
    pickup: 'Pick up at the salon',
    pickupNote: 'Erysichthonos 3-5, Thiseio · Free',
    courier: 'Courier delivery',
    courierNote: 'Across Greece · we confirm the cost by email',
    details: 'Your details',
    name: 'Full name',
    phone: 'Mobile',
    email: 'Email',
    address: 'Address',
    city: 'City',
    zip: 'Postcode',
    notes: 'Notes (optional)',
    payment: 'Payment',
    bank: 'Bank transfer or IRIS',
    bankNote: 'We email you the total and the details. The order starts once we receive payment.',
    cards: 'Card, Apple Pay, Google Pay, PayPal, Klarna',
    soon: 'coming soon',
    total: 'Products total',
    shipping: 'Shipping',
    shippingFree: 'Free',
    shippingTbd: 'Confirmed by email',
    send: 'Place order',
    sending: 'Sending…',
    required: 'Please fill in all required fields.',
    unpriced: 'Some products have no price yet: we will confirm it by email.',
    error: 'Something went wrong. Please call us at +30 210 346 5554.',
    successTitle: 'Your order has been sent!',
    successMsg: 'We have emailed you a confirmation. To start delivery, transfer the amount to one of the accounts and send the receipt to',
    holder: 'Account holder',
    iris: 'IRIS (tax no. or mobile)',
    consent: 'I agree my details are used only for this order.',
    empty: 'Your bag is empty.',
    back: 'Back to shop'
  }
};

const CartPage = ({ lang, t }) => {
  const x = TXT[lang] || TXT.el;
  const { lines, subtotal, hasUnpriced, clear } = useShop();
  const [delivery, setDelivery] = useState('pickup');
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: '', zip: '', notes: '', consent: false });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(null);

  useEffect(() => {
    document.title = `${x.title} | Alexandros Hair Salon`;
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    const prev = robots.content;
    robots.content = 'noindex';
    return () => {
      robots.content = prev || 'index, follow';
    };
  }, [x.title]);

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    const need = ['name', 'phone', 'email', ...(delivery === 'courier' ? ['address', 'city', 'zip'] : [])];
    if (need.some((k) => !form[k].trim()) || !form.consent) {
      setError(x.required);
      return;
    }
    setStatus('sending');
    const items = lines
      .map((l) => `• ${l.product.name.el} (${l.variant.label}${l.variant.ean ? `, EAN ${l.variant.ean}` : ''}) x${l.qty} = ${typeof l.variant.price === 'number' ? `${l.total.toFixed(2)}€` : 'τιμή προς επιβεβαίωση'}`)
      .join('\n');
    const deliveryText = delivery === 'pickup' ? 'Παραλαβή από το κομμωτήριο' : 'Courier (κόστος προς επιβεβαίωση)';
    try {
      await emailjs.send(
        EMAILJS.service,
        EMAILJS.template,
        {
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email,
          customer_address: delivery === 'pickup' ? deliveryText : form.address,
          customer_city: delivery === 'pickup' ? '-' : `${form.city} ${form.zip}`,
          customer_notes: `${deliveryText}${form.notes ? ` · ${form.notes}` : ''}`,
          order_items: items,
          order_total: `${subtotal.toFixed(2)}€${hasUnpriced ? ' + προϊόντα χωρίς τιμή' : ''}${delivery === 'courier' ? ' + μεταφορικά' : ''}`,
          reply_to: form.email,
          bank_holder: BANK.holder,
          bank_accounts: BANK.accounts.map((a) => `${a.bank}: ${a.iban}`).join('\n'),
          iris_afm: BANK.irisAfm,
          iris_phone: BANK.irisPhone,
          contact_email: BANK.email
        },
        EMAILJS.publicKey
      );
      setSent({ total: subtotal, delivery });
      clear();
      setStatus('idle');
    } catch {
      setStatus('idle');
      setError(x.error);
    }
  };

  if (sent) {
    return (
      <div className="sh sh-pad sh-success">
        <span className="sh-success-mark" aria-hidden="true">✓</span>
        <h1 className="sh-pdp-title">{x.successTitle}</h1>
        <p className="nh-lead">
          {x.successMsg} <a href={`mailto:${BANK.email}`}>{BANK.email}</a>.
        </p>
        <div className="sh-bank">
          <div className="sh-subtotal"><span>{x.total}</span><strong>{money(sent.total, lang)}</strong></div>
          <p><span>{x.holder}</span> <strong>{BANK.holder}</strong></p>
          {BANK.accounts.map((a) => (
            <p key={a.iban}><span>{a.bank}</span> <strong className="sh-mono">{a.iban}</strong></p>
          ))}
          <p><span>{x.iris}</span> <strong className="sh-mono">{BANK.irisAfm} · {BANK.irisPhone}</strong></p>
        </div>
        <Link to="/shop" className="nh-btn nh-btn-ghost nh-btn-sm">{x.back}</Link>
      </div>
    );
  }

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
      <div className="sh-checkout">
        <form className="sh-checkout-form" onSubmit={submit} noValidate>
          <fieldset className="sh-box">
            <legend>{x.delivery}</legend>
            {[
              ['pickup', x.pickup, x.pickupNote],
              ['courier', x.courier, x.courierNote]
            ].map(([k, l, n]) => (
              <label key={k} className={`sh-radio-card${delivery === k ? ' is-on' : ''}`}>
                <input type="radio" name="delivery" value={k} checked={delivery === k} onChange={() => setDelivery(k)} />
                <span><strong>{l}</strong><small>{n}</small></span>
              </label>
            ))}
          </fieldset>

          <fieldset className="sh-box">
            <legend>{x.details}</legend>
            <div className="sh-form-row">
              <label><span>{x.name} *</span><input name="name" value={form.name} onChange={set} autoComplete="name" required /></label>
              <label><span>{x.phone} *</span><input name="phone" type="tel" value={form.phone} onChange={set} autoComplete="tel" required /></label>
            </div>
            <label><span>{x.email} *</span><input name="email" type="email" value={form.email} onChange={set} autoComplete="email" required /></label>
            {delivery === 'courier' && (
              <>
                <label><span>{x.address} *</span><input name="address" value={form.address} onChange={set} autoComplete="street-address" required /></label>
                <div className="sh-form-row">
                  <label><span>{x.city} *</span><input name="city" value={form.city} onChange={set} autoComplete="address-level2" required /></label>
                  <label><span>{x.zip} *</span><input name="zip" value={form.zip} onChange={set} autoComplete="postal-code" inputMode="numeric" required /></label>
                </div>
              </>
            )}
            <label><span>{x.notes}</span><textarea name="notes" rows={3} value={form.notes} onChange={set} /></label>
          </fieldset>

          <fieldset className="sh-box">
            <legend>{x.payment}</legend>
            <label className="sh-radio-card is-on">
              <input type="radio" name="pay" checked readOnly />
              <span><strong>{x.bank}</strong><small>{x.bankNote}</small></span>
            </label>
            <label className="sh-radio-card is-disabled" aria-disabled="true">
              <input type="radio" name="pay" disabled />
              <span><strong>{x.cards}</strong><small>{x.soon}</small></span>
            </label>
          </fieldset>

          <label className="sh-consent">
            <input type="checkbox" name="consent" checked={form.consent} onChange={set} />
            <span>{x.consent}</span>
          </label>
          {error && <p className="sh-note sh-note-err" role="alert">{error}</p>}
          <button type="submit" className="nh-btn nh-btn-gold sh-w100" disabled={status === 'sending'}>
            {status === 'sending' ? x.sending : x.send}
          </button>
        </form>

        <aside className="sh-summary" aria-label={t.cart}>
          <CartLines lang={lang} t={t} />
          {hasUnpriced && <p className="sh-note">{x.unpriced}</p>}
          <div className="sh-subtotal"><span>{x.total}</span><strong>{money(subtotal, lang)}</strong></div>
          <div className="sh-subtotal sh-subtotal-sm">
            <span>{x.shipping}</span>
            <span>{delivery === 'pickup' ? x.shippingFree : x.shippingTbd}</span>
          </div>
          <p className="sh-muted sh-small">{tr({ el: 'Οι τιμές περιλαμβάνουν ΦΠΑ.', en: 'Prices include VAT.' }, lang)}</p>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
