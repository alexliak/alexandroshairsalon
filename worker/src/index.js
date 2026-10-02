// Alexandros Hair Salon · shop API (Cloudflare Worker + D1)
// GET  /reviews/summary              -> { productId: { avg, count } }
// GET  /reviews?product=<id>          -> { items, avg, count }
// POST /reviews                       -> νέα κριτική (σε αναμονή έγκρισης)
// GET  /admin/reviews?status=pending  -> λίστα (Authorization: Bearer ADMIN_TOKEN)
// POST /admin/reviews/<id>            -> { action: approve | reject | reply | delete, reply? }

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers } });

const cors = (req, env) => {
  const origin = req.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim());
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0] || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
};

const clean = (s, max) => String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

const sha256 = async (text) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

const isAdmin = (req, env) => {
  const got = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!env.ADMIN_TOKEN || got.length !== env.ADMIN_TOKEN.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ env.ADMIN_TOKEN.charCodeAt(i);
  return diff === 0;
};

const publicRow = (r) => ({
  id: r.id, product: r.product, rating: r.rating, name: r.name, title: r.title, text: r.text,
  date: r.created_at, verified: !!r.verified, reply: r.reply || null
});

export default {
  async fetch(req, env) {
    const h = cors(req, env);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, '');

    try {
      if (req.method === 'GET' && path === '/reviews/summary') {
        const { results } = await env.DB.prepare(
          "SELECT product, AVG(rating) AS avg, COUNT(*) AS count FROM reviews WHERE status = 'approved' GROUP BY product"
        ).all();
        const out = {};
        results.forEach((r) => { out[r.product] = { avg: Math.round(r.avg * 10) / 10, count: r.count }; });
        return json(out, 200, { ...h, 'Cache-Control': 'public, max-age=300' });
      }

      if (req.method === 'GET' && path === '/reviews') {
        const product = clean(url.searchParams.get('product'), 120);
        if (!product) return json({ error: 'product required' }, 400, h);
        const { results } = await env.DB.prepare(
          "SELECT * FROM reviews WHERE product = ? AND status = 'approved' ORDER BY created_at DESC LIMIT 100"
        ).bind(product).all();
        const count = results.length;
        const avg = count ? results.reduce((s, r) => s + r.rating, 0) / count : 0;
        return json({ items: results.map(publicRow), avg: Math.round(avg * 10) / 10, count }, 200, { ...h, 'Cache-Control': 'public, max-age=120' });
      }

      if (req.method === 'POST' && path === '/reviews') {
        const body = await req.json().catch(() => ({}));
        if (body.website) return json({ ok: true, pending: true }, 200, h); // honeypot: bots
        const product = clean(body.product, 120);
        const rating = Number(body.rating);
        const name = clean(body.name, 60);
        const text = clean(body.text, 2000);
        if (!/^[a-z0-9-]+$/.test(product) || !(rating >= 1 && rating <= 5) || name.length < 2 || text.length < 10) {
          return json({ error: 'invalid' }, 400, h);
        }
        const ip = req.headers.get('CF-Connecting-IP') || '';
        const ipHash = await sha256(`${env.IP_SALT || 'ahs'}:${ip}`);
        const recent = await env.DB.prepare(
          "SELECT COUNT(*) AS n FROM reviews WHERE ip_hash = ? AND created_at > strftime('%Y-%m-%dT%H:%M:%SZ', 'now', '-1 day')"
        ).bind(ipHash).first();
        if (recent && recent.n >= 5) return json({ error: 'too many' }, 429, h);
        const email = clean(body.email, 120);
        await env.DB.prepare(
          'INSERT INTO reviews (product, rating, name, email, title, text, lang, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(product, rating, name, /.+@.+\..+/.test(email) ? email : null, clean(body.title, 90) || null, text,
          body.lang === 'en' ? 'en' : 'el', ipHash).run();
        return json({ ok: true, pending: true }, 201, h);
      }

      if (path.startsWith('/admin/')) {
        if (!isAdmin(req, env)) return json({ error: 'unauthorized' }, 401, h);
        if (req.method === 'GET' && path === '/admin/reviews') {
          const status = ['pending', 'approved', 'rejected'].includes(url.searchParams.get('status')) ? url.searchParams.get('status') : 'pending';
          const { results } = await env.DB.prepare('SELECT * FROM reviews WHERE status = ? ORDER BY created_at DESC LIMIT 200').bind(status).all();
          return json({ items: results.map((r) => ({ ...publicRow(r), email: r.email, status: r.status })) }, 200, h);
        }
        const m = path.match(/^\/admin\/reviews\/(\d+)$/);
        if (req.method === 'POST' && m) {
          const id = Number(m[1]);
          const { action, reply } = await req.json().catch(() => ({}));
          const r = typeof reply === 'string' ? clean(reply, 1000) || null : undefined;
          if (action === 'delete') await env.DB.prepare('DELETE FROM reviews WHERE id = ?').bind(id).run();
          else if (action === 'approve' || action === 'reject') {
            await env.DB.prepare('UPDATE reviews SET status = ?, reply = COALESCE(?, reply) WHERE id = ?')
              .bind(action === 'approve' ? 'approved' : 'rejected', r ?? null, id).run();
          } else if (action === 'reply') await env.DB.prepare('UPDATE reviews SET reply = ? WHERE id = ?').bind(r ?? null, id).run();
          else return json({ error: 'bad action' }, 400, h);
          return json({ ok: true }, 200, h);
        }
      }
      return json({ error: 'not found' }, 404, h);
    } catch (e) {
      return json({ error: 'server' }, 500, h);
    }
  }
};
