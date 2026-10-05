import React from 'react';
import Seo, { PAGES, SITE } from '../../components/Seo';
import ShopShell from '../../shop/ShopApp';
import ShopHome from '../../shop/pages/ShopHome';
import { PRODUCTS } from '../../shop/catalog';

const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Alexandros Hair Salon Shop',
  itemListElement: PRODUCTS.slice(0, 60).map((p, i) => ({
    '@type': 'ListItem', position: i + 1, url: `${SITE}/shop/p/${p.id}`, name: p.name.el
  }))
};

export default function ShopPage({ language, setLanguage }) {
  return (
    <>
      <Seo path="/shop" {...PAGES['/shop']} jsonld={itemList} />
      <ShopShell language={language} setLanguage={setLanguage}>
        {(t) => <ShopHome lang={language} t={t} />}
      </ShopShell>
    </>
  );
}
