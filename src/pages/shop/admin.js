import React from 'react';
import Seo from '../../components/Seo';
import ShopShell from '../../shop/ShopApp';
import ReviewsAdmin from '../../shop/pages/ReviewsAdmin';

export default function Admin({ language, setLanguage }) {
  return (
    <>
      <Seo path="/shop/admin" title="Κριτικές · διαχείριση" description="Alexandros Hair Salon Shop" noindex />
      <ShopShell language={language} setLanguage={setLanguage}>
        {() => <ReviewsAdmin />}
      </ShopShell>
    </>
  );
}
