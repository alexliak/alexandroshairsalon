import React, { useState, useRef, useEffect } from 'react';
import { ShoppingOutlined } from '@ant-design/icons';
import emailjs from 'emailjs-com';
import products from '../data/products';
import './Shop.css';

// ─── ΑΛΛΑΞΤΕ ΕΔΩ ΤΑ ΣΤΟΙΧΕΙΑ ΤΡΑΠΕΖΑΣ ───────────────────────────────────────
const BANK = {
  holder:    'ΛΙΑΚΟΠΟΥΛΟΣ ΑΛΕΞΑΝΔΡΟΣ',
  accounts: [
    { bank: 'Eurobank',                  iban: 'GR51 0260 6390 0001 6020 0558 062' },
    { bank: 'Εθνική Τράπεζα',            iban: 'GR55 0110 1620 0000 1620 0488 795' },
    { bank: 'CrediΑBank',                iban: 'GR14 0160 0670 0000 0008 5004 298' },
  ],
  irisAfm:   '070233060',
  irisPhone: '6981319000',
  email:     'liakopoulosalex@gmail.com'
};
// ─────────────────────────────────────────────────────────────────────────────

const labels = {
  el: {
    title: 'Online Shop',
    subtitle: 'Επαγγελματικά προϊόντα μαλλιών EVOQUE',
    photoSoon: 'Φωτογραφία σύντομα',
    addToCart: 'Προσθήκη',
    cart: 'Καλάθι',
    emptyCart: 'Το καλάθι σας είναι άδειο',
    orderForm: 'Στοιχεία Αποστολής',
    name: 'Ονοματεπώνυμο',
    phone: 'Τηλέφωνο',
    email: 'Email',
    address: 'Διεύθυνση αποστολής',
    city: 'Πόλη / Τ.Κ.',
    notes: 'Σχόλια (προαιρετικά)',
    send: 'Αποστολή Αιτήματος',
    sending: 'Αποστολή...',
    successTitle: 'Το αίτημά σας στάλθηκε!',
    successMsg: 'Σας έχουμε στείλει email επιβεβαίωσης. Παρακαλώ προχωρήστε στην κατάθεση για να ξεκινήσει η αποστολή.',
    successBankNote: 'Για να επιβεβαιωθεί η παραγγελία σας, καταθέστε το παρακάτω ποσό και στείλτε αντίγραφο της απόδειξης στο:',
    total: 'Σύνολο',
    outOfStock: 'Μη διαθέσιμο',
    errorMsg: 'Κάτι πήγε στραβά. Παρακαλώ καλέστε μας στο 210 346 5554.',
    required: 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.',
    newOrder: 'Νέα Παραγγελία',
    howTitle: 'Πώς λειτουργεί;',
    step1: 'Επιλέξτε προϊόντα & συμπληρώστε τα στοιχεία σας',
    step2: 'Λαμβάνετε email επιβεβαίωσης με το σύνολο',
    step3: 'Καταθέστε το ποσό & στείλτε την απόδειξη στο email επικοινωνίας',
    step4: 'Αποστολή εντός 1–3 εργάσιμων ημερών',
    seoIntro: 'Επαγγελματικά προϊόντα κερατίνης, frizz control και styling για χρήση στο σπίτι. Ιδανικά για φριζαρισμένα, σγουρά ή βαμμένα μαλλιά. Αποστολή πανελλαδικά.',
    bankTitle: 'Στοιχεία Κατάθεσης',
    bankHolder: 'Δικαιούχος',
    bankBank: 'Τράπεζα',
    bankIBAN: 'ΙΒΑΝ',
    paymentNote: 'Απαιτείται προκαταβολή πριν την αποστολή.',
    contactTitle: 'Επικοινωνία',
    contactNote: 'Για ερωτήσεις σχετικά με χρόνο παράδοσης ή διαθεσιμότητα:'
  },
  en: {
    title: 'Online Shop',
    subtitle: 'EVOQUE Professional Hair Care Products',
    photoSoon: 'Photo coming soon',
    addToCart: 'Add',
    cart: 'Cart',
    emptyCart: 'Your cart is empty',
    orderForm: 'Shipping Details',
    name: 'Full Name',
    phone: 'Phone',
    email: 'Email',
    address: 'Shipping Address',
    city: 'City / Postal Code',
    notes: 'Notes (optional)',
    send: 'Send Request',
    sending: 'Sending...',
    successTitle: 'Request sent!',
    successMsg: 'We have sent you a confirmation email. Please proceed with the bank transfer to start your order.',
    successBankNote: 'To confirm your order, transfer the amount below and send proof of payment to:',
    total: 'Total',
    outOfStock: 'Out of Stock',
    errorMsg: 'Something went wrong. Please call us at 210 346 5554.',
    required: 'Please fill in all required fields.',
    newOrder: 'New Order',
    howTitle: 'How it works',
    step1: 'Select products & fill in your details',
    step2: 'Receive a confirmation email with the total',
    step3: 'Transfer the amount & send proof of payment to the contact email below',
    step4: 'Shipped within 1–3 business days',
    seoIntro: 'Professional keratin, frizz control and styling products for home use. Ideal for curly, frizzy or colour-treated hair. Nationwide delivery.',
    bankTitle: 'Bank Transfer Details',
    bankHolder: 'Account Holder',
    bankBank: 'Bank',
    bankIBAN: 'IBAN',
    paymentNote: 'Full prepayment required before shipping.',
    contactTitle: 'Contact',
    contactNote: 'For questions about delivery time or availability:'
  }
};

const Shop = ({ language = 'el' }) => {
  const t = labels[language] || labels.el;

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'EVOQUE Επαγγελματικά Προϊόντα Μαλλιών — Alexandros Hair Salon',
      url: 'https://alexandroshairsalon.gr/shop',
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: p.name,
          description: p.description,
          brand: { '@type': 'Brand', name: p.category === 'Παιδικά' ? 'Gotstyle' : 'EVOQUE' },
          offers: {
            '@type': 'Offer',
            price: p.price.toFixed(2),
            priceCurrency: 'EUR',
            availability: p.inStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url: 'https://alexandroshairsalon.gr/shop',
            seller: { '@type': 'Organization', name: 'Alexandros Hair Salon' }
          }
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'shop-product-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('shop-product-schema');
      if (el) el.remove();
    };
  }, []);

  const [cart, setCart] = useState({});
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: '', notes: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentTotal, setSentTotal] = useState(0);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const cartRef = useRef(null);

  const cartItems = products.filter(p => cart[p.id] > 0);
  const total = cartItems.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);

  const changeQty = (id, delta) => {
    setCart(prev => {
      const next = Math.min(3, Math.max(0, (prev[id] || 0) + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const buildOrderText = () =>
    cartItems.map(p => `• ${p.name} x${cart[p.id]} = ${(p.price * cart[p.id]).toFixed(2)}€`).join('\n');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.address || !form.city) {
      setFormError(t.required);
      return;
    }
    if (cartItems.length === 0) return;

    setSending(true);
    setError('');

    const bankAccountsText = BANK.accounts
      .map(a => `${a.bank}: ${a.iban}`)
      .join('\n');

    const templateParams = {
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email,
      customer_address: form.address,
      customer_city: form.city,
      customer_notes: form.notes || '-',
      order_items: buildOrderText(),
      order_total: `${total.toFixed(2)}€`,
      reply_to: form.email,
      bank_holder: BANK.holder,
      bank_accounts: bankAccountsText,
      iris_afm: BANK.irisAfm,
      iris_phone: BANK.irisPhone,
      contact_email: BANK.email,
    };

    try {
      await emailjs.send(
        'service_nul8u7q',
        'template_186w5q2',
        templateParams,
        'XL7dj9dSLwxsDvNtb'
      );
      setSentTotal(total);
      setSent(true);
      setCart({});
      setForm({ name: '', phone: '', email: '', address: '', city: '', notes: '' });
    } catch {
      setError(t.errorMsg);
    } finally {
      setSending(false);
    }
  };

  const BankCard = ({ className = '' }) => (
    <div className={`bank-card ${className}`}>
      <div className="bank-card-title">{t.bankTitle}</div>
      <div className="bank-row"><span>{t.bankHolder}</span><strong>{BANK.holder}</strong></div>
      {BANK.accounts.map((acc, i) => (
        <div key={i} className="bank-account-row">
          <span className="bank-name">{acc.bank}</span>
          <strong className="iban-val">{acc.iban}</strong>
        </div>
      ))}
      <div className="bank-divider">— ή μέσω IRIS —</div>
      <div className="bank-row"><span>ΑΦΜ</span><strong className="iris-val">{BANK.irisAfm}</strong></div>
      <div className="bank-row"><span>Τηλέφωνο</span><strong className="iris-val">{BANK.irisPhone}</strong></div>
      <div className="bank-note">{t.paymentNote}</div>
    </div>
  );

  if (sent) {
    return (
      <div className="shop-success">
        <div className="success-icon">✓</div>
        <h2>{t.successTitle}</h2>
        <p>{t.successMsg}</p>
        <p className="success-bank-note">{t.successBankNote}</p>
        <a className="success-email-link" href={`mailto:${BANK.email}`}>{BANK.email}</a>
        <div className="success-total-box">
          {t.total}: <strong>{sentTotal.toFixed(2)}€</strong>
        </div>
        <BankCard className="success-bank" />
        <button className="shop-btn-primary" onClick={() => setSent(false)}>{t.newOrder}</button>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>{t.title}</h1>
        <p className="shop-subtitle">{t.subtitle}</p>
        <p className="shop-seo-intro">{t.seoIntro}</p>
      </div>

      <div className="shop-layout">
        {/* Products Grid */}
        <div className="products-grid">
          {products.map(product => {
            const qty = cart[product.id] || 0;
            const name = language === 'en' ? product.nameEn : product.name;
            const desc = language === 'en' ? product.descriptionEn : product.description;
            return (
              <div key={product.id} className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}>
                <div className="product-image-wrap">
                  {product.image ? (
                    <img src={product.image} alt={name} />
                  ) : (
                    <div className="product-image-placeholder">
                      <span className="placeholder-icon" aria-hidden="true"><ShoppingOutlined /></span>
                      <small>{t.photoSoon}</small>
                    </div>
                  )}
                  {!product.inStock && <span className="badge-out">{t.outOfStock}</span>}
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{name}</h3>
                  <p className="product-desc">{desc}</p>
                  <div className="product-footer">
                    <span className="product-price">{product.price.toFixed(2)}€</span>
                    {product.inStock && (
                      <div className="qty-controls">
                        <button onClick={() => changeQty(product.id, -1)} disabled={qty === 0}>−</button>
                        <span>{qty}</span>
                        <button onClick={() => changeQty(product.id, 1)} disabled={qty >= 3}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="shop-sidebar">

          {/* Πώς λειτουργεί */}
          <div className="how-box">
            <div className="how-title">{t.howTitle}</div>
            <ol className="how-steps">
              <li>{t.step1}</li>
              <li>{t.step2}</li>
              <li>{t.step3}</li>
              <li>{t.step4}</li>
            </ol>
          </div>

          {/* Στοιχεία Τράπεζας */}
          <BankCard />

          {/* Επικοινωνία */}
          <div className="contact-box">
            <div className="shop-contact-title">{t.contactTitle}</div>
            <p className="contact-note">{t.contactNote}</p>
            <a className="contact-email" href={`mailto:${BANK.email}`}>{BANK.email}</a>
            <a className="contact-phone" href="tel:+302103465554">210 346 5554</a>
          </div>

          {/* Καλάθι + Φόρμα */}
          <div className="cart-box" ref={cartRef}>
            <h2>{t.cart}</h2>
            {cartItems.length === 0 ? (
              <p className="empty-cart">{t.emptyCart}</p>
            ) : (
              <>
                <ul className="cart-list">
                  {cartItems.map(p => (
                    <li key={p.id}>
                      <span className="cart-name">{language === 'en' ? p.nameEn : p.name}</span>
                      <span className="cart-qty">x{cart[p.id]}</span>
                      <span className="cart-subtotal">{(p.price * cart[p.id]).toFixed(2)}€</span>
                    </li>
                  ))}
                </ul>
                <div className="cart-total">
                  <strong>{t.total}:</strong>
                  <strong className="cart-total-amount">{total.toFixed(2)}€</strong>
                </div>

                <form className="order-form" onSubmit={handleSubmit} noValidate>
                  <h3>{t.orderForm}</h3>
                  {formError && <div className="form-error">{formError}</div>}
                  <label>{t.name} *<input name="name" value={form.name} onChange={handleFormChange} required /></label>
                  <label>{t.phone} *<input name="phone" type="tel" value={form.phone} onChange={handleFormChange} required /></label>
                  <label>{t.email} *<input name="email" type="email" value={form.email} onChange={handleFormChange} required /></label>
                  <label>{t.address} *<input name="address" value={form.address} onChange={handleFormChange} required /></label>
                  <label>{t.city} *<input name="city" value={form.city} onChange={handleFormChange} required /></label>
                  <label>{t.notes}<textarea name="notes" value={form.notes} onChange={handleFormChange} rows={3} /></label>
                  {error && <div className="form-error">{error}</div>}
                  <button type="submit" className="shop-btn-primary" disabled={sending}>
                    {sending ? t.sending : t.send}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating cart bar — mobile only */}
      {cartItems.length > 0 && (
        <div
          className="mobile-cart-bar"
          onClick={() => cartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          <span className="mobile-cart-bar-left">
            <ShoppingOutlined aria-hidden="true" /> <strong>{cartItems.reduce((s, p) => s + (cart[p.id] || 0), 0)}</strong> προϊόν{cartItems.reduce((s, p) => s + (cart[p.id] || 0), 0) !== 1 ? 'τα' : ''}
          </span>
          <span className="mobile-cart-bar-total">{total.toFixed(2)}€</span>
          <span className="mobile-cart-bar-action">Ολοκλήρωση →</span>
        </div>
      )}
    </div>
  );
};

export default Shop;
