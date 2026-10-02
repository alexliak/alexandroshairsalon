import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { CATALOG_MODE } from './config';
import { FaShoppingBag } from 'react-icons/fa';
import NhLayout from '../components/NhLayout';
import { ShopProvider, useShop } from './ShopContext';
import { money } from './catalog';
import { useT } from './i18n';
import CartDrawer from './components/CartDrawer';
import ShopHome from './pages/ShopHome';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ReviewsAdmin from './pages/ReviewsAdmin';
import './shop.css';

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
        <strong>{money(subtotal, lang)}</strong>
      </span>
      <button type="button" className="nh-btn nh-btn-gold nh-btn-sm" onClick={() => setDrawer(true)}>{t.checkout}</button>
    </div>
  );
};

const Inner = ({ language, setLanguage }) => {
  const t = useT(language);
  const { count } = useShop();
  const { pathname } = useLocation();
  const showBar = !CATALOG_MODE && count > 0 && !pathname.startsWith('/shop/cart');
  return (
    <NhLayout
      language={language}
      setLanguage={setLanguage}
      headerExtra={CATALOG_MODE ? undefined : <CartButton t={t} />}
      mobileBar={showBar ? <MobileCartBar t={t} lang={language} /> : undefined}
    >
      <main className="nh-page nh-shop-v2">
        <Routes>
          <Route path="/shop" element={<ShopHome lang={language} t={t} />} />
          <Route path="/shop/p/:id" element={<ProductPage lang={language} t={t} />} />
          <Route path="/shop/cart" element={CATALOG_MODE ? <Navigate to="/shop" replace /> : <CartPage lang={language} t={t} />} />
          <Route path="/shop/admin" element={<ReviewsAdmin />} />
          <Route path="*" element={<ShopHome lang={language} t={t} />} />
        </Routes>
      </main>
      {!CATALOG_MODE && <CartDrawer lang={language} t={t} />}
    </NhLayout>
  );
};

const ShopApp = (props) => (
  <ShopProvider>
    <Inner {...props} />
  </ShopProvider>
);

export default ShopApp;
