import React from 'react';
import Head from 'next/head';
import SEO_PAGES from '../data/seo.json';

export const SITE = 'https://alexandroshairsalon.gr';
const DEFAULT_IMAGE = { url: `${SITE}/logo512.png`, width: 512, height: 512, type: 'image/png' };

// Title, description, canonical, Open Graph and Twitter tags, already in the HTML of every page.
const Seo = ({ title, description, path, image, noindex, jsonld }) => {
  const url = `${SITE}${path === '/' ? '/' : path}`;
  const img = image || DEFAULT_IMAGE;
  const ld = jsonld ? (Array.isArray(jsonld) ? jsonld : [jsonld]) : [];
  return (
    <Head>
      <title>{title}</title>
      <meta key="description" name="description" content={description} />
      <link key="canonical" rel="canonical" href={url} />
      {noindex && <meta key="robots" name="robots" content="noindex" />}
      <meta key="og:type" property="og:type" content={image ? 'product' : 'website'} />
      <meta key="og:locale" property="og:locale" content="el_GR" />
      <meta key="og:url" property="og:url" content={url} />
      <meta key="og:title" property="og:title" content={title} />
      <meta key="og:description" property="og:description" content={description} />
      <meta key="og:image" property="og:image" content={img.url} />
      <meta key="og:image:width" property="og:image:width" content={String(img.width)} />
      <meta key="og:image:height" property="og:image:height" content={String(img.height)} />
      <meta key="og:image:type" property="og:image:type" content={img.type} />
      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:url" name="twitter:url" content={url} />
      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta key="twitter:description" name="twitter:description" content={description} />
      <meta key="twitter:image" name="twitter:image" content={img.url} />
      {ld.map((obj, i) => (
        <script
          // eslint-disable-next-line react/no-array-index-key
          key={`ld-${i}`}
          id={obj['@type'] === 'Product' ? 'product-schema' : undefined}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj).replace(/</g, '\\u003c') }}
        />
      ))}
    </Head>
  );
};

// Τίτλος και περιγραφή κάθε σελίδας: μία πηγή, το src/data/seo.json
export const PAGES = SEO_PAGES;

export const PageSeo = ({ path, jsonld }) => <Seo path={path} {...PAGES[path]} jsonld={jsonld} />;

export default Seo;
