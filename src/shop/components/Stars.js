import React from 'react';

const Star = ({ fill }) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`sg${fill}`}>
        <stop offset={`${fill}%`} stopColor="currentColor" />
        <stop offset={`${fill}%`} stopColor="currentColor" stopOpacity="0.22" />
      </linearGradient>
    </defs>
    <path
      fill={`url(#sg${fill})`}
      d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z"
    />
  </svg>
);

const Stars = ({ value = 0, label, size = 'sm' }) => (
  <span className={`sh-stars sh-stars-${size}`} role="img" aria-label={label}>
    {[0, 1, 2, 3, 4].map((i) => {
      const f = Math.max(0, Math.min(1, value - i));
      return <Star key={i} fill={Math.round(f * 4) * 25} />;
    })}
  </span>
);

export const StarInput = ({ value, onChange, label, t }) => (
  <fieldset className="sh-star-input">
    <legend>{label}</legend>
    {[1, 2, 3, 4, 5].map((n) => (
      <label key={n} className={n <= value ? 'is-on' : ''}>
        <input type="radio" name="rating" value={n} checked={value === n} onChange={() => onChange(n)} />
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
        </svg>
        <span className="sh-visually-hidden">{t.stars(n)}</span>
      </label>
    ))}
  </fieldset>
);

export default Stars;
