import React from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import { useLocation } from '../lib/router';
import { CATALOG_MODE } from './config';
import NhLayout from '../components/NhLayout';
import { ShopProvider, useShop } from './ShopContext';
import { money } from './catalog';
import { useT } from './i18n';
import CartDrawer from './components/CartDrawer';

// Frame of every /shop page: site header with the cart button, the cart drawer and the mobile cart bar.
// The cart is saved in the browser (localStorage), so it stays while moving between pages.
// The catalogue loads only on /shop pages, never on the rest of the site.

const CartButton = ({ t }) => {
  const { count, setDrawer } = useShop();
  return (
    <button type="button" className="sh-cart-btn" onClick={() => setDrawer(true)} aria-label={`${t.cart} (${count})`}>
      <FaShoppingBag aria-hidden="true" />
      {count > 0 && <span className="sh-cart-count">{count}</span>}
    </button>
  );
};

const MobileCartBar = ({ t, lang }) => {
  const { count, subtotal, setDrawer } = useShop();
  if (!count) return null;
  return (
    <div className="nh-mobile-bar sh-mobile-bar">
      <span className="nh-mobile-bar-text">
        <span>{t.cart} · {count}</span>
        <strong>{CATALOG_MODE ? t.requestShort : money(subtotal, lang)}</strong>
      </span>
      <button type="button" className="nh-btn nh-btn-gold nh-btn-sm" onClick={() => setDrawer(true)}>{CATALOG_MODE ? t.sendRequest : t.checkout}</button>
    </div>
  );
};

const Shell = ({ language, setLanguage, children }) => {
  const t = useT(language);
  const { count } = useShop();
  const { pathname } = useLocation();
  const showBar = count > 0 && !pathname.startsWith('/shop/cart');
  return (
    <NhLayout
      language={language}
      setLanguage={setLanguage}
      headerExtra={<CartButton t={t} />}
      mobileBar={showBar ? <MobileCartBar t={t} lang={language} /> : undefined}
    >
      <main className="nh-page nh-shop-v2">{children(t)}</main>
      <CartDrawer lang={language} t={t} />
    </NhLayout>
  );
};

const ShopShell = (props) => (
  <ShopProvider>
    <Shell {...props} />
  </ShopProvider>
);

export default ShopShell;
