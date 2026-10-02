import React, { useCallback, useEffect, useState } from 'react';
import { productById } from '../catalog';
import { SHOP_API } from '../config';
import Stars from '../components/Stars';

// /shop/admin — έγκριση κριτικών. Ο κωδικός είναι το ADMIN_TOKEN του Cloudflare Worker.
const ReviewsAdmin = () => {
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem('ahs_admin') || '';
    } catch {
      return '';
    }
  });
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('pending');
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [replies, setReplies] = useState({});

  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.content = 'noindex, nofollow';
    document.title = 'Κριτικές · διαχείριση';
  }, []);

  const call = useCallback(
    (path, opts = {}) =>
      fetch(`${SHOP_API}${path}`, {
        ...opts,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) }
      }).then(async (r) => {
        if (r.status === 401) throw new Error('Λάθος κωδικός');
        if (!r.ok) throw new Error(`Σφάλμα ${r.status}`);
        return r.json();
      }),
    [token]
  );

  const load = useCallback(() => {
    if (!token) return;
    setMsg('');
    call(`/admin/reviews?status=${status}`)
      .then((d) => setItems(d.items || []))
      .catch((e) => {
        setMsg(e.message);
        if (e.message === 'Λάθος κωδικός') setToken('');
      });
  }, [token, status, call]);

  useEffect(load, [load]);

  const act = (id, action) =>
    call(`/admin/reviews/${id}`, { method: 'POST', body: JSON.stringify({ action, reply: replies[id] }) })
      .then(load)
      .catch((e) => setMsg(e.message));

  if (!SHOP_API) {
    return <div className="sh sh-pad"><h1 className="sh-pdp-title">Κριτικές</h1><p>Δεν έχει ρυθμιστεί το REACT_APP_SHOP_API.</p></div>;
  }

  if (!token) {
    return (
      <div className="sh sh-pad sh-admin">
        <h1 className="sh-pdp-title">Κριτικές · διαχείριση</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              sessionStorage.setItem('ahs_admin', input);
            } catch {
              /* ignore */
            }
            setToken(input);
          }}
          className="sh-box"
        >
          <label><span>Κωδικός διαχείρισης</span><input type="password" value={input} onChange={(e) => setInput(e.target.value)} autoComplete="current-password" /></label>
          <button className="nh-btn nh-btn-gold nh-btn-sm" type="submit">Είσοδος</button>
          {msg && <p className="sh-note sh-note-err">{msg}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="sh sh-pad sh-admin">
      <h1 className="sh-pdp-title">Κριτικές · διαχείριση</h1>
      <div className="sh-chips">
        {[['pending', 'Σε αναμονή'], ['approved', 'Εγκεκριμένες'], ['rejected', 'Απορριφθείσες']].map(([k, l]) => (
          <button key={k} type="button" className={`sh-chip${status === k ? ' is-on' : ''}`} onClick={() => setStatus(k)}>{l}</button>
        ))}
        <button type="button" className="sh-link" onClick={() => { setToken(''); try { sessionStorage.removeItem('ahs_admin'); } catch { /* ignore */ } }}>Έξοδος</button>
      </div>
      {msg && <p className="sh-note sh-note-err">{msg}</p>}
      {items.length === 0 && <p className="sh-muted">Καμία κριτική εδώ.</p>}
      <ul className="sh-review-list">
        {items.map((r) => (
          <li key={r.id} className="sh-review">
            <div className="sh-review-top">
              <Stars value={r.rating} label={`${r.rating}/5`} />
              <strong>{productById[r.product]?.name.el || r.product}</strong>
            </div>
            {r.title && <strong>{r.title}</strong>}
            <p>{r.text}</p>
            <span className="sh-review-by">{r.name} · {r.email || 'χωρίς email'} · {r.date?.slice(0, 16).replace('T', ' ')}</span>
            <label><span>Απάντηση (προαιρετικά, δημοσιεύεται)</span>
              <textarea rows={2} value={replies[r.id] ?? r.reply ?? ''} onChange={(e) => setReplies({ ...replies, [r.id]: e.target.value })} />
            </label>
            <div className="sh-chips">
              {status !== 'approved' && <button type="button" className="nh-btn nh-btn-gold nh-btn-sm" onClick={() => act(r.id, 'approve')}>Έγκριση</button>}
              {status === 'approved' && <button type="button" className="nh-btn nh-btn-ghost nh-btn-sm" onClick={() => act(r.id, 'reply')}>Αποθήκευση απάντησης</button>}
              {status !== 'rejected' && <button type="button" className="nh-btn nh-btn-ghost nh-btn-sm" onClick={() => act(r.id, 'reject')}>Απόρριψη</button>}
              <button type="button" className="sh-link" onClick={() => window.confirm('Οριστική διαγραφή;') && act(r.id, 'delete')}>Διαγραφή</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewsAdmin;
