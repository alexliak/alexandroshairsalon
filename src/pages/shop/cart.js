import React from 'react';
import Seo from '../../components/Seo';
import ShopShell from '../../shop/ShopApp';
import RequestPage from '../../shop/pages/RequestPage';
import CartPage from '../../shop/pages/CartPage';
import { CATALOG_MODE } from '../../shop/config';

export default function Cart({ language, setLanguage }) {
  return (
    <>
      <Seo path="/shop/cart" title={`${CATALOG_MODE ? "Αίτημα τιμής & διαθεσιμότητας" : "Καλάθι & παραγγελία"} | Alexandros Hair Salon`} description="Alexandros Hair Salon Shop" noindex />
      <ShopShell language={language} setLanguage={setLanguage}>
        {(t) => (CATALOG_MODE ? <RequestPage lang={language} t={t} /> : <CartPage lang={language} t={t} />)}
      </ShopShell>
    </>
  );
}
