import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { money, productUrl, t as tr, typeByKey } from '../catalog';
import { useShop } from '../ShopContext';
import { CATALOG_MODE, WHATSAPP } from '../config';
import ProductImage from './ProductImage';
import Stars from './Stars';

export const askPriceUrl = (p, lang) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    lang === 'en'
      ? `Hello, I would like the price and availability of: ${p.name.en} (${p.brand})`
      : `Γεια σας, θα ήθελα τιμή και διαθεσιμότητα για: ${p.name.el} (${p.brand})`
  )}`;

const ProductCard = ({ product: p, lang, t }) => {
  const { add, wish, toggleWish, ratings } = useShop();
  const name = tr(p.name, lang);
  const r = ratings[p.id];
  const single = p.variants.length === 1 ? p.variants[0] : null;
  const wished = wish.includes(p.id);
  const soldOut = !p.inStock;

  return (
    <article className="sh-card">
      <Link to={productUrl(p)} className="sh-card-media" tabIndex={-1} aria-hidden="true">
        <ProductImage product={p} label={name} />
      </Link>
      <button
        type="button"
        className={`sh-wish${wished ? ' is-on' : ''}`}
        onClick={() => toggleWish(p.id)}
        aria-pressed={wished}
        aria-label={wished ? t.removeWish : t.addWish}
        title={wished ? t.removeWish : t.addWish}
      >
        {wished ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
      </button>
      <div className="sh-card-body">
        <span className="sh-card-eyebrow">
          {p.brand === "L'Oréal Professionnel" ? 'L’Oréal Pro' : p.brand} · {p.line}
        </span>
        <h3 className="sh-card-name">
          <Link to={productUrl(p)}>{name}</Link>
        </h3>
        <span className="sh-card-meta">
          {tr(typeByKey[p.type], lang)}
          {p.variants.length > 1 ? ` · ${t.options(p.variants.length)}` : single?.size ? ` · ${single.size}` : ''}
        </span>
        {r && r.count > 0 && (
          <span className="sh-card-rating">
            <Stars value={r.avg} label={t.ratingOf(r.avg, r.count)} /> <small>({r.count})</small>
          </span>
        )}
        <div className="sh-card-foot">
          {p.priced ? (
            <span className="sh-price">
              {p.variants.length > 1 && p.minPrice !== p.maxPrice && <small>{t.from} </small>}
              {money(p.minPrice, lang)}
            </span>
          ) : CATALOG_MODE ? (
            <span />
          ) : (
            <span className="sh-price sh-price-ask">{t.priceSoon}</span>
          )}
          {soldOut ? (
            <span className="sh-badge-out">{t.outOfStock}</span>
          ) : single && (p.priced || CATALOG_MODE) ? (
            <button type="button" className="sh-btn-add" onClick={() => add(p.id, single.sku)} aria-label={`${t.add}: ${name}`}>
              {t.add}
            </button>
          ) : p.priced || CATALOG_MODE ? (
            <Link to={productUrl(p)} className="sh-btn-add sh-btn-ghost">{t.chooseOption}</Link>
          ) : (
            <a href={askPriceUrl(p, lang)} target="_blank" rel="noopener noreferrer" className="sh-btn-add sh-btn-ghost">
              {t.askPrice}
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
