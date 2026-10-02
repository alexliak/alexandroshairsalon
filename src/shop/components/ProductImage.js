import React from 'react';
import { LINE_INFO, imageSrc } from '../catalog';

// Line drawings used when a product has no photo yet: the tile still looks intentional.
const SHAPES = {
  bottle: (
    <>
      <rect x="38" y="18" width="24" height="12" rx="3" />
      <path d="M34 30h32v6c6 4 8 10 8 16v52c0 6-4 10-10 10H36c-6 0-10-4-10-10V52c0-6 2-12 8-16z" />
      <rect x="32" y="62" width="36" height="30" rx="2" />
    </>
  ),
  jar: (
    <>
      <rect x="18" y="42" width="64" height="16" rx="5" />
      <path d="M22 58h56v44c0 6-4 10-10 10H32c-6 0-10-4-10-10z" />
      <rect x="30" y="72" width="40" height="22" rx="2" />
    </>
  ),
  tube: (
    <>
      <rect x="40" y="96" width="20" height="18" rx="3" />
      <path d="M30 14h40l-6 82H36z" />
      <rect x="37" y="40" width="26" height="34" rx="2" />
    </>
  ),
  dropper: (
    <>
      <path d="M44 10h12v10h-12z" />
      <rect x="40" y="20" width="20" height="16" rx="3" />
      <path d="M32 36h36v66c0 6-4 10-10 10H42c-6 0-10-4-10-10z" />
      <rect x="38" y="62" width="24" height="26" rx="2" />
    </>
  ),
  spray: (
    <>
      <path d="M42 12h16v8H42zM58 14h10" />
      <rect x="38" y="20" width="24" height="14" rx="3" />
      <path d="M32 34h36v72c0 4-3 8-8 8H40c-5 0-8-4-8-8z" />
      <rect x="37" y="58" width="26" height="30" rx="2" />
    </>
  ),
  tool: (
    <>
      <path d="M16 70l60-34c4-2 8 0 9 3s0 7-4 9L22 82c-3 2-7 1-8-2s0-8 2-10z" />
      <path d="M22 82l-8 14M76 40l10-10" />
    </>
  ),
  set: (
    <>
      <path d="M20 40h24v6c4 3 6 7 6 12v42c0 5-3 8-8 8H22c-5 0-8-3-8-8V58c0-5 2-9 6-12z" />
      <rect x="22" y="30" width="20" height="10" rx="2" />
      <rect x="54" y="56" width="34" height="12" rx="4" />
      <path d="M56 68h30v34c0 5-3 8-8 8H64c-5 0-8-3-8-8z" />
    </>
  )
};

const shapeFor = (type) =>
  ({
    shampoo: 'bottle', conditioner: 'bottle', 'pre-shampoo': 'bottle', mask: 'jar', pomade: 'jar',
    'leave-in': 'tube', styling: 'tube', treatment: 'tube', serum: 'dropper', oil: 'dropper', ampoules: 'dropper',
    hairspray: 'spray', 'root-spray': 'spray', 'hair-tool': 'tool', accessory: 'tool', set: 'set'
  }[type] || 'bottle');

const ProductImage = ({ product, size = 400, className = '', eager = false, label, variant }) => {
  // Επιλεγμένο μέγεθος: μόνο η δική του φωτογραφία (αλλιώς σχέδιο). Κάρτα: η πρώτη διαθέσιμη.
  const img = variant ? variant.image : product.image;
  const src = imageSrc(img, size);
  const v = variant || (product.variants.length === 1 ? product.variants[0] : null);
  const size_ = v?.size || '';
  if (src) {
    return (
      <div className={`sh-img ${className}`}>
        <img
          src={src}
          srcSet={`${imageSrc(img, 400)} 400w, ${imageSrc(img, 800)} 800w`}
          sizes={size > 400 ? '(max-width: 820px) 100vw, 50vw' : '(max-width: 600px) 50vw, 300px'}
          alt={label}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          width="400"
          height="400"
        />
      </div>
    );
  }
  return (
    <div
      className={`sh-img sh-img-art ${className}`}
      role="img"
      aria-label={label}
      style={LINE_INFO[product.line]?.color ? { '--sh-line-color': LINE_INFO[product.line].color } : undefined}
    >
      <svg viewBox="0 0 100 120" aria-hidden="true" focusable="false">
        {SHAPES[shapeFor(product.type)]}
      </svg>
      <span className="sh-img-line">{product.line}</span>
      {size_ && <span className="sh-img-size">{size_}</span>}
      <span className="sh-img-brand">{product.brand}</span>
    </div>
  );
};

export default ProductImage;
