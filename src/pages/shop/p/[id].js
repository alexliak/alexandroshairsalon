import React, { useMemo } from 'react';
import Seo, { SITE } from '../../../components/Seo';
import ShopShell from '../../../shop/ShopApp';
import ProductPage from '../../../shop/pages/ProductPage';
import { PRODUCTS, imageSrc, typeByKey, withDetail } from '../../../shop/catalog';
import { CATALOG_MODE } from '../../../shop/config';

// One static HTML page per product, built from src/data/shop/index.json (light list)
// + src/data/shop/products/<id>.json (full texts). The full texts are only in this page.

export async function getStaticPaths() {
  return { paths: PRODUCTS.map((p) => ({ params: { id: p.id } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const fs = await import('fs/promises');
  const path = await import('path');
  const file = path.join(process.cwd(), 'src', 'data', 'shop', 'products', `${params.id}.json`);
  const detail = JSON.parse(await fs.readFile(file, 'utf8'));
  return { props: { id: params.id, detail } };
}

const schemaFor = (p, description, url, image) => {
  const offers = CATALOG_MODE
    ? []
    : p.variants
      .filter((v) => typeof v.price === 'number')
      .map((v) => ({
        '@type': 'Offer', sku: v.sku, ...(v.ean ? { gtin13: v.ean } : {}), price: v.price.toFixed(2), priceCurrency: 'EUR',
        availability: v.stock === 0 ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
        url, itemCondition: 'https://schema.org/NewCondition',
        seller: { '@type': 'Organization', name: 'Alexandros Hair Salon' }
      }));
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name.el,
    description,
    brand: { '@type': 'Brand', name: p.brand },
    category: typeByKey[p.type]?.el,
    sku: p.variants[0].sku,
    ...(p.variants[0].ean ? { gtin13: p.variants[0].ean } : {}),
    ...(image ? { image: [image] } : {}),
    url,
    ...(offers.length ? { offers: offers.length === 1 ? offers[0] : offers } : {})
  };
};

export default function ProductRoute({ id, detail, language, setLanguage }) {
  const product = useMemo(() => withDetail(id, detail), [id, detail]);
  const url = `${SITE}/shop/p/${id}`;
  const description = (product.short.el || product.description.el || product.name.el).slice(0, 155);
  const image = product.image ? `${SITE}${imageSrc(product.image, 800)}` : null;
  return (
    <>
      <Seo
        path={`/shop/p/${id}`}
        title={`${product.name.el} | ${product.brand} | Alexandros Hair Salon`}
        description={description}
        image={image ? { url: image, width: 800, height: 800, type: 'image/webp' } : undefined}
        jsonld={schemaFor(product, description, url, image)}
      />
      <ShopShell language={language} setLanguage={setLanguage}>
        {(t) => <ProductPage product={product} lang={language} t={t} />}
      </ShopShell>
    </>
  );
}
