import React, { useEffect, useState } from 'react';
import { SHOP_API } from '../config';
import { useShop } from '../ShopContext';
import Stars, { StarInput } from './Stars';

const fmtDate = (iso, lang) => {
  try {
    return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-GB' : 'el-GR', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '';
  }
};

const ReviewForm = ({ productId, lang, t, onDone }) => {
  const [rating, setRating] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', title: '', text: '', website: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [err, setErr] = useState('');
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return setErr(t.needRating);
    if (form.name.trim().length < 2 || form.text.trim().length < 10) return setErr(t.needText);
    setErr('');
    setStatus('sending');
    try {
      const r = await fetch(`${SHOP_API}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: productId, rating, lang, ...form })
      });
      if (!r.ok) throw new Error(String(r.status));
      setStatus('done');
      onDone?.();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') return <p className="sh-note sh-note-ok" role="status">{t.reviewThanks}</p>;

  return (
    <form className="sh-review-form" onSubmit={submit} noValidate>
      <StarInput value={rating} onChange={setRating} label={t.yourRating} t={t} />
      <div className="sh-form-row">
        <label>
          <span>{t.yourName} *</span>
          <input name="name" value={form.name} onChange={set} maxLength={60} autoComplete="given-name" required />
        </label>
        <label>
          <span>{t.yourEmail}</span>
          <input name="email" type="email" value={form.email} onChange={set} maxLength={120} autoComplete="email" />
        </label>
      </div>
      <label>
        <span>{t.reviewTitle}</span>
        <input name="title" value={form.title} onChange={set} maxLength={90} />
      </label>
      <label>
        <span>{t.reviewText} *</span>
        <textarea name="text" rows={4} value={form.text} onChange={set} maxLength={2000} required />
      </label>
      {/* honeypot: people never see this field */}
      <label className="sh-hp" aria-hidden="true">
        Website <input name="website" tabIndex={-1} value={form.website} onChange={set} autoComplete="off" />
      </label>
      {err && <p className="sh-note sh-note-err" role="alert">{err}</p>}
      {status === 'error' && <p className="sh-note sh-note-err" role="alert">{t.reviewError}</p>}
      <button type="submit" className="nh-btn nh-btn-gold nh-btn-sm" disabled={status === 'sending'}>
        {status === 'sending' ? t.sending : t.submitReview}
      </button>
    </form>
  );
};

const Reviews = ({ productId, lang, t }) => {
  const { setRatings } = useShop();
  const [data, setData] = useState({ items: [], avg: 0, count: 0 });
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!SHOP_API) return undefined;
    let alive = true;
    fetch(`${SHOP_API}/reviews?product=${encodeURIComponent(productId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive || !d) return;
        setData(d);
        setLoaded(true);
        if (d.count) setRatings((prev) => ({ ...prev, [productId]: { avg: d.avg, count: d.count } }));
      })
      .catch(() => setLoaded(true));
    return () => {
      alive = false;
    };
  }, [productId, setRatings]);

  // JSON-LD reviews for Google (only real, approved reviews)
  useEffect(() => {
    if (!data.count) return undefined;
    const el = document.getElementById('product-schema');
    if (!el) return undefined;
    try {
      const json = JSON.parse(el.textContent);
      json.aggregateRating = { '@type': 'AggregateRating', ratingValue: data.avg.toFixed(1), reviewCount: data.count };
      json.review = data.items.slice(0, 5).map((r) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.name },
        datePublished: r.date?.slice(0, 10),
        reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
        name: r.title || undefined,
        reviewBody: r.text
      }));
      el.textContent = JSON.stringify(json);
    } catch {
      /* ignore */
    }
    return undefined;
  }, [data]);

  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: data.items.filter((r) => r.rating === n).length }));

  return (
    <section className="sh-reviews" id="reviews" aria-labelledby="sh-reviews-title">
      <div className="sh-reviews-head">
        <h2 id="sh-reviews-title" className="sh-h2">{t.reviews}</h2>
        {SHOP_API && !open && (
          <button type="button" className="nh-btn nh-btn-ghost nh-btn-sm" onClick={() => setOpen(true)}>{t.writeReview}</button>
        )}
      </div>

      {!SHOP_API ? (
        <p className="sh-muted">{t.reviewsOff}</p>
      ) : (
        <>
          {data.count > 0 && (
            <div className="sh-reviews-summary">
              <div className="sh-reviews-score">
                <strong>{data.avg.toFixed(1)}</strong>
                <Stars value={data.avg} size="md" label={t.ratingOf(data.avg, data.count)} />
                <span>{t.reviewsCount(data.count)}</span>
              </div>
              <ul className="sh-dist">
                {dist.map(({ n, c }) => (
                  <li key={n}>
                    <span>{n}★</span>
                    <span className="sh-bar"><span style={{ width: `${data.count ? (c / data.count) * 100 : 0}%` }} /></span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {open && <ReviewForm productId={productId} lang={lang} t={t} />}
          {loaded && data.count === 0 && !open && <p className="sh-muted">{t.noReviews}</p>}
          <ul className="sh-review-list">
            {data.items.map((r) => (
              <li key={r.id} className="sh-review">
                <div className="sh-review-top">
                  <Stars value={r.rating} label={t.stars(r.rating)} />
                  {r.title && <strong>{r.title}</strong>}
                </div>
                <p>{r.text}</p>
                <span className="sh-review-by">
                  {r.name} · {fmtDate(r.date, lang)}
                  {r.verified && <em className="sh-verified"> · {t.verified}</em>}
                </span>
                {r.reply && <p className="sh-review-reply"><strong>Alexandros Hair Salon:</strong> {r.reply}</p>}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default Reviews;
