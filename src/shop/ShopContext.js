import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { productById } from './catalog';
import { MAX_QTY, SHOP_API } from './config';

const ShopContext = createContext(null);
// Rating summary kept for the visit, so moving between shop pages does not ask again
let ratingsCache = null;

const load = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode: the cart still works for this visit */
  }
};

export const ShopProvider = ({ children }) => {
  // cart: [{ id, sku, qty }]
  // Pages are pre-built as HTML, so the saved cart is read after the page loads in the browser
  const [cart, setCart] = useState([]);
  const [wish, setWish] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);
  const [ratings, setRatingsState] = useState(() => ratingsCache || {}); // { productId: { avg, count } }
  const setRatings = useCallback((next) => {
    setRatingsState((prev) => {
      ratingsCache = typeof next === 'function' ? next(prev) : next;
      return ratingsCache;
    });
  }, []);

  useEffect(() => {
    setCart(load('ahs_cart_v1', []).filter((l) => productById[l.id]));
    setWish(load('ahs_wish_v1', []).filter((id) => productById[id]));
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) save('ahs_cart_v1', cart);
  }, [cart, loaded]);
  useEffect(() => {
    if (loaded) save('ahs_wish_v1', wish);
  }, [wish, loaded]);

  // Rating summary for the listing (one request)
  useEffect(() => {
    if (!SHOP_API || ratingsCache) return undefined;
    let alive = true;
    fetch(`${SHOP_API}/reviews/summary`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => alive && setRatings(d || {}))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const add = useCallback((id, sku, qty = 1) => {
    setCart((prev) => {
      const i = prev.findIndex((l) => l.id === id && l.sku === sku);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: Math.min(MAX_QTY, next[i].qty + qty) };
        return next;
      }
      return [...prev, { id, sku, qty: Math.min(MAX_QTY, qty) }];
    });
    setLastAdded({ id, sku, at: Date.now() });
    setDrawer(true);
  }, []);

  const setQty = useCallback((id, sku, qty) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.id === id && l.sku === sku))
        : prev.map((l) => (l.id === id && l.sku === sku ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))
    );
  }, []);

  const clear = useCallback(() => setCart([]), []);

  const toggleWish = useCallback((id) => {
    setWish((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const lines = useMemo(
    () =>
      cart
        .map((l) => {
          const product = productById[l.id];
          const variant = product?.variants.find((v) => v.sku === l.sku);
          return product && variant ? { ...l, product, variant, total: (variant.price || 0) * l.qty } : null;
        })
        .filter(Boolean),
    [cart]
  );
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const hasUnpriced = lines.some((l) => typeof l.variant.price !== 'number');

  const value = {
    lines, count, subtotal, hasUnpriced, add, setQty, clear,
    wish, toggleWish, drawer, setDrawer, lastAdded, ratings, setRatings
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => useContext(ShopContext);
