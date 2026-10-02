import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaWhatsapp } from 'react-icons/fa';
import {
  PRODUCTS, hairByKey, imageSrc, money, needByKey, productById, t as tr, typeByKey
} from '../catalog';
import { useShop } from '../ShopContext';
import { CATALOG_MODE, MAX_QTY, SITE } from '../config';
import ProductImage from '../components/ProductImage';
import ProductCard, { askPriceUrl } from '../components/ProductCard';
import Reviews from '../components/Reviews';
import Stars from '../components/Stars';
import { QtyStepper } from '../components/CartDrawer';

// L'Oréal texts use [HEADINGS] and *footnotes: turn them into readable blocks
const RichText = ({ text }) => {
  if (!text) return null;
  const blocks = text
    .replace(/\s*\[([^\]]{3,80})\]\s*/g, '\n\n[$1]\n\n')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <div className="sh-rich">
      {blocks.map((b, i) => {
        const h = b.match(/^\[(.+)\]$/);
        if (h) {
          const s = h[1].toLowerCase();
          return <h4 key={i}>{s.charAt(0).toUpperCase() + s.slice(1)}</h4>;
        }
        if (/^\*/.test(b)) return <p key={i} className="sh-foot">{b}</p>;
        return <p key={i}>{b}</p>;
      })}
    </div>
  );
};

const setMeta = (name, content, attr = 'name') => {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const ProductPage = ({ lang, t }) => {
  const { id } = useParams();
  const p = productById[id];
  const { add, wish, toggleWish, ratings } = useShop();
  const [sku, setSku] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!p) return;
    const firstPriced = p.variants.find((v) => typeof v.price === 'number' && !v.pro) || p.variants.find((v) => typeof v.price === 'number');
    const firstRetail = p.variants.find((v) => !v.pro) || p.variants[0];
    setSku((firstPriced || firstRetail).sku);
    setQty(1);
  }, [p]);

  const variant = p?.variants.find((v) => v.sku === sku) || p?.variants[0];
  const name = p ? tr(p.name, lang) : '';

  // Title, description, canonical and Product schema
  useEffect(() => {
    if (!p) return undefined;
    const url = `${SITE}/shop/p/${p.id}`;
    document.title = `${p.name.el} | ${p.brand} | Alexandros Hair Salon`;
    const desc = (p.short.el || p.description.el || '').slice(0, 155);
    setMeta('description', desc);
    setMeta('og:title', p.name.el, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:url', url, 'property');
    if (p.image) setMeta('og:image', `${SITE}${imageSrc(p.image, 800)}`, 'property');
    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement('link');
      canon.rel = 'canonical';
      document.head.appendChild(canon);
    }
    canon.href = url;

    const offers = p.variants
      .filter((v) => typeof v.price === 'number')
      .map((v) => ({
        '@type': 'Offer', sku: v.sku, gtin13: v.ean || undefined, price: v.price.toFixed(2), priceCurrency: 'EUR',
        availability: v.stock === 0 ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
        url, itemCondition: 'https://schema.org/NewCondition',
        seller: { '@type': 'Organization', name: 'Alexandros Hair Salon' }
      }));
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name.el,
      description: desc,
      brand: { '@type': 'Brand', name: p.brand },
      category: typeByKey[p.type]?.el,
      sku: p.variants[0].sku,
      gtin13: p.variants[0].ean || undefined,
      image: p.image ? [`${SITE}${imageSrc(p.image, 800)}`] : undefined,
      url,
      ...(offers.length ? { offers: offers.length === 1 ? offers[0] : offers } : {})
    };
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'product-schema';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => el.remove();
  }, [p]);

  const related = useMemo(() => {
    if (!p) return [];
    const list = p.related.map((rid) => productById[rid]).filter(Boolean);
    const more = PRODUCTS.filter((x) => x.line === p.line && x.id !== p.id && !list.includes(x));
    return [...list, ...more].slice(0, 4);
  }, [p]);

  if (!p) {
    return (
      <div className="sh sh-pad">
        <h1 className="nh-h1 nh-h1-page">404</h1>
        <p className="nh-lead">{lang === 'en' ? 'This product is not available.' : 'Αυτό το προϊόν δεν είναι διαθέσιμο.'}</p>
        <Link className="nh-btn nh-btn-gold" to="/shop">{t.back}</Link>
      </div>
    );
  }

  const r = ratings[p.id];
  const wished = wish.includes(p.id);
  const priced = typeof variant.price === 'number';
  const soldOut = variant.stock === 0;

  return (
    <div className="sh sh-product">
      <nav className="sh-crumbs" aria-label={t.breadcrumbs}>
        <Link to="/shop">{t.shop}</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/shop?brand=${p.brandKey}`}>{p.brand}</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/shop?line=${encodeURIComponent(p.line)}`}>{p.line}</Link>
      </nav>

      <div className="sh-pdp">
        <div className="sh-pdp-media">
          <ProductImage product={p} variant={variant} size={800} eager label={name} className="sh-pdp-img" />
        </div>

        <div className="sh-pdp-info">
          <span className="nh-eyebrow">{p.brand} · {p.line}</span>
          <h1 className="sh-pdp-title">{name}</h1>
          <div className="sh-pdp-sub">
            <span>{tr(typeByKey[p.type], lang)}</span>
            {r && r.count > 0 && (
              <a href="#reviews" className="sh-pdp-rating">
                <Stars value={r.avg} label={t.ratingOf(r.avg, r.count)} /> {t.reviewsCount(r.count)}
              </a>
            )}
          </div>

          <div className="sh-pdp-price">
            {priced ? (
              <>
                <strong>{money(variant.price, lang)}</strong>
                {typeof variant.compareAt === 'number' && variant.compareAt > variant.price && (
                  <s>{money(variant.compareAt, lang)}</s>
                )}
              </>
            ) : (
              <span className="sh-price-ask">{CATALOG_MODE ? t.catalogNote : t.priceSoon}</span>
            )}
          </div>

          {p.short[lang] && <p className="sh-pdp-short">{p.short[lang]}</p>}

          {p.variants.length > 1 && (
            <fieldset className="sh-variants">
              <legend>{p.type === 'root-spray' ? (lang === 'en' ? 'Shade' : 'Απόχρωση') : t.size}</legend>
              <div className="sh-variant-row">
                {p.variants.map((v) => (
                  <label key={v.sku} className={`sh-variant${v.sku === variant.sku ? ' is-on' : ''}${v.stock === 0 ? ' is-out' : ''}`}>
                    <input type="radio" name="variant" value={v.sku} checked={v.sku === variant.sku} onChange={() => setSku(v.sku)} />
                    <span>{v.label}</span>
                    {typeof v.price === 'number' && <small>{money(v.price, lang)}</small>}
                  </label>
                ))}
              </div>
              {variant.pro && <p className="sh-muted sh-small">{t.proSize}</p>}
            </fieldset>
          )}

          <div className="sh-buy">
            {(priced || CATALOG_MODE) && !soldOut ? (
              <>
                <QtyStepper qty={qty} onChange={(q) => setQty(Math.max(1, Math.min(MAX_QTY, q)))} label={t.qty} max={MAX_QTY} />
                <button
                  type="button"
                  className="nh-btn nh-btn-gold sh-buy-btn"
                  onClick={() => {
                    add(p.id, variant.sku, qty);
                    setAdded(true);
                    setTimeout(() => setAdded(false), 1800);
                  }}
                >
                  {added ? `✓ ${t.added}` : t.add}
                </button>
              </>
            ) : soldOut ? (
              <span className="sh-badge-out">{t.outOfStock}</span>
            ) : (
              <a className="nh-btn nh-btn-gold sh-buy-btn" href={askPriceUrl(p, lang)} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp aria-hidden="true" style={{ marginRight: 10 }} /> {t.askPrice}
              </a>
            )}
            <button
              type="button"
              className={`sh-wish sh-wish-inline${wished ? ' is-on' : ''}`}
              onClick={() => toggleWish(p.id)}
              aria-pressed={wished}
              aria-label={wished ? t.removeWish : t.addWish}
              title={wished ? t.removeWish : t.addWish}
            >
              {wished ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
            </button>
          </div>

          <ul className="sh-pdp-trust">
            <li>{t.trust1}</li>
            <li>{t.trust2}</li>
            <li>{t.trust3}</li>
          </ul>

          <dl className="sh-tags">
            {p.needs.length > 0 && (
              <div>
                <dt>{t.benefits}</dt>
                <dd>
                  {p.needs.map((n) => (
                    <Link key={n} to={`/shop?need=${n}`} className="sh-tag">{tr(needByKey[n], lang)}</Link>
                  ))}
                </dd>
              </div>
            )}
            <div>
              <dt>{t.suitable}</dt>
              <dd>
                {p.hairTypes.map((h) => (
                  <Link key={h} to={`/shop?hair=${h}`} className="sh-tag">{tr(hairByKey[h], lang)}</Link>
                ))}
              </dd>
            </div>
          </dl>

          <div className="sh-acc">
            {(p.description[lang] || p.description.el) && (
              <details open>
                <summary>{t.description}</summary>
                <RichText text={p.description[lang] || p.description.el} />
              </details>
            )}
            {(p.howTo[lang] || p.howTo.el) && (
              <details>
                <summary>{t.howTo}</summary>
                <RichText text={p.howTo[lang] || p.howTo.el} />
              </details>
            )}
            {(p.safety[lang] || p.safety.el) && (
              <details>
                <summary>{t.safety}</summary>
                <RichText text={p.safety[lang] || p.safety.el} />
              </details>
            )}
            <details>
              <summary>{t.details}</summary>
              <dl className="sh-specs">
                <div><dt>{t.brand}</dt><dd>{p.brand}</dd></div>
                <div><dt>{t.line}</dt><dd>{p.line}</dd></div>
                <div><dt>{t.type}</dt><dd>{tr(typeByKey[p.type], lang)}</dd></div>
                {variant.size && <div><dt>{t.size}</dt><dd>{variant.size}</dd></div>}
                {variant.ean && <div><dt>{t.ean}</dt><dd>{variant.ean}</dd></div>}
              </dl>
            </details>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="sh-related" aria-labelledby="sh-related-title">
          <h2 id="sh-related-title" className="sh-h2">{t.related}</h2>
          <div className="sh-grid sh-grid-4">
            {related.map((x) => (
              <ProductCard key={x.id} product={x} lang={lang} t={t} />
            ))}
          </div>
        </section>
      )}

      <Reviews productId={p.id} lang={lang} t={t} />
    </div>
  );
};

export default ProductPage;
