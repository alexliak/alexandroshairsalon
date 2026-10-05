import { useCallback, useMemo } from 'react';
import { useSearchParams } from '../lib/router';
import { norm, PRODUCTS } from './catalog';

export const MULTI = ['brand', 'cat', 'type', 'line', 'need', 'hair'];
const FIELD = { brand: 'brandKey', cat: 'category', type: 'type', line: 'line' };

const readState = (sp) => {
  const s = { q: sp.get('q') || '', sort: sp.get('sort') || 'featured' };
  MULTI.forEach((k) => {
    s[k] = (sp.get(k) || '').split(',').filter(Boolean);
  });
  s.pmin = sp.get('pmin') ? Number(sp.get('pmin')) : null;
  s.pmax = sp.get('pmax') ? Number(sp.get('pmax')) : null;
  s.rating = sp.get('rating') ? Number(sp.get('rating')) : null;
  s.stock = sp.get('stock') === '1';
  s.priced = sp.get('priced') === '1';
  s.wish = sp.get('wish') === '1';
  return s;
};

const hasValue = (p, key, values) => {
  if (!values.length) return true;
  if (key === 'need') return values.some((v) => p.needs.includes(v));
  if (key === 'hair') return values.some((v) => p.hairTypes.includes(v));
  return values.includes(p[FIELD[key]]);
};

export const matches = (p, s, ctx, except) => {
  for (const k of MULTI) {
    if (k !== except && !hasValue(p, k, s[k])) return false;
  }
  if (s.q) {
    const words = norm(s.q).split(/\s+/).filter(Boolean);
    if (!words.every((w) => p.haystack.includes(w))) return false;
  }
  if (except !== 'price') {
    if (s.pmin !== null && (p.maxPrice === null || p.maxPrice < s.pmin)) return false;
    if (s.pmax !== null && (p.minPrice === null || p.minPrice > s.pmax)) return false;
  }
  if (except !== 'rating' && s.rating) {
    const r = ctx.ratings[p.id];
    if (!r || r.avg < s.rating) return false;
  }
  if (s.stock && !p.inStock) return false;
  if (s.priced && !p.priced) return false;
  if (s.wish && !ctx.wish.includes(p.id)) return false;
  return true;
};

const sorters = {
  featured: (a, b) => (b.image ? 1 : 0) - (a.image ? 1 : 0) || (b.priced ? 1 : 0) - (a.priced ? 1 : 0),
  'price-asc': (a, b) => (a.minPrice ?? 1e9) - (b.minPrice ?? 1e9),
  'price-desc': (a, b) => (b.maxPrice ?? -1) - (a.maxPrice ?? -1),
  name: (a, b) => a.name.el.localeCompare(b.name.el, 'el')
};

const useFilters = ({ ratings, wish }) => {
  const [sp, setSp] = useSearchParams();
  const state = useMemo(() => readState(sp), [sp]);
  const ctx = useMemo(() => ({ ratings, wish }), [ratings, wish]);

  const results = useMemo(() => {
    const list = PRODUCTS.filter((p) => matches(p, state, ctx));
    if (state.sort === 'rating') {
      return [...list].sort((a, b) => (ratings[b.id]?.avg || 0) - (ratings[a.id]?.avg || 0));
    }
    return [...list].sort(sorters[state.sort] || sorters.featured);
  }, [state, ctx, ratings]);

  // Disjunctive facet counts: each group is counted with the other groups applied
  const counts = useMemo(() => {
    const out = {};
    MULTI.forEach((k) => {
      const c = {};
      PRODUCTS.forEach((p) => {
        if (!matches(p, state, ctx, k)) return;
        const vals = k === 'need' ? p.needs : k === 'hair' ? p.hairTypes : [p[FIELD[k]]];
        vals.forEach((v) => {
          c[v] = (c[v] || 0) + 1;
        });
      });
      out[k] = c;
    });
    return out;
  }, [state, ctx]);

  const update = useCallback(
    (patch) => {
      const next = new URLSearchParams(sp);
      Object.entries(patch).forEach(([k, v]) => {
        const empty = v === null || v === undefined || v === '' || v === false || (Array.isArray(v) && !v.length);
        if (empty) next.delete(k);
        else next.set(k, Array.isArray(v) ? v.join(',') : v === true ? '1' : String(v));
      });
      setSp(next, { replace: true });
    },
    [sp, setSp]
  );

  const toggle = useCallback(
    (key, value) => {
      const cur = state[key];
      update({ [key]: cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value] });
    },
    [state, update]
  );

  const clearAll = useCallback(() => setSp(new URLSearchParams(), { replace: true }), [setSp]);

  const active =
    MULTI.reduce((n, k) => n + state[k].length, 0) +
    (state.pmin !== null ? 1 : 0) + (state.pmax !== null ? 1 : 0) + (state.rating ? 1 : 0) +
    (state.stock ? 1 : 0) + (state.priced ? 1 : 0) + (state.wish ? 1 : 0) + (state.q ? 1 : 0);

  return { state, results, counts, update, toggle, clearAll, active };
};

export default useFilters;
