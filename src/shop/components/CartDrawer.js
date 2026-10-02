import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { money, productUrl, t as tr } from '../catalog';
import { useShop } from '../ShopContext';
import ProductImage from './ProductImage';
import { CATALOG_MODE } from '../config';

export const QtyStepper = ({ qty, onChange, label, max = 10 }) => (
  <div className="sh-qty" role="group" aria-label={label}>
    <button type="button" onClick={() => onChange(qty - 1)} aria-label="−1">−</button>
    <output aria-live="polite">{qty}</output>
    <button type="button" onClick={() => onChange(qty + 1)} disabled={qty >= max} aria-label="+1">+</button>
  </div>
);

export const CartLines = ({ lang, t, compact }) => {
  const { lines, setQty } = useShop();
  return (
    <ul className={`sh-lines${compact ? ' is-compact' : ''}`}>
      {lines.map((l) => {
        const name = tr(l.product.name, lang);
        return (
          <li key={`${l.id}-${l.sku}`} className="sh-line">
            <Link to={productUrl(l.product)} className="sh-line-img" tabIndex={-1} aria-hidden="true">
              <ProductImage product={l.product} label="" />
            </Link>
            <div className="sh-line-info">
              <Link to={productUrl(l.product)} className="sh-line-name">{name}</Link>
              <span className="sh-line-variant">{l.variant.label}</span>
              <div className="sh-line-actions">
                <QtyStepper qty={l.qty} onChange={(q) => setQty(l.id, l.sku, q)} label={`${t.qty}: ${name}`} />
                <button type="button" className="sh-link" onClick={() => setQty(l.id, l.sku, 0)}>{t.remove}</button>
              </div>
            </div>
            <span className="sh-line-total">
              {typeof l.variant.price === 'number' ? money(l.total, lang) : CATALOG_MODE ? null : <small>{t.priceSoon}</small>}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

const CartDrawer = ({ lang, t }) => {
  const { drawer, setDrawer, lines, subtotal, count } = useShop();
  const closeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!drawer) return undefined;
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && setDrawer(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [drawer, setDrawer]);

  return (
    <div className={`sh-drawer-wrap${drawer ? ' is-open' : ''}`} aria-hidden={!drawer}>
      <div className="sh-drawer-scrim" onClick={() => setDrawer(false)} />
      <aside className="sh-drawer" role="dialog" aria-modal="true" aria-label={t.cart}>
        <header className="sh-drawer-head">
          <h2>{t.cart} <span>({count})</span></h2>
          <button ref={closeRef} type="button" className="sh-icon-btn" onClick={() => setDrawer(false)} aria-label={t.close}>
            <FaTimes aria-hidden="true" />
          </button>
        </header>
        {lines.length === 0 ? (
          <div className="sh-drawer-empty">
            <p>{t.cartEmpty}</p>
            <button type="button" className="nh-btn nh-btn-ghost nh-btn-sm" onClick={() => setDrawer(false)}>{t.continueShopping}</button>
          </div>
        ) : (
          <>
            <div className="sh-drawer-body">
              <CartLines lang={lang} t={t} compact />
            </div>
            <footer className="sh-drawer-foot">
              {CATALOG_MODE ? (
                <p className="sh-muted sh-small">{t.requestNote}</p>
              ) : (
                <div className="sh-subtotal">
                  <span>{t.subtotal}</span>
                  <strong>{money(subtotal, lang)}</strong>
                </div>
              )}
              <button
                type="button"
                className="nh-btn nh-btn-gold sh-w100"
                onClick={() => {
                  setDrawer(false);
                  navigate('/shop/cart');
                }}
              >
                {CATALOG_MODE ? t.sendRequest : t.checkout}
              </button>
              <button type="button" className="sh-link sh-center" onClick={() => setDrawer(false)}>{t.continueShopping}</button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
