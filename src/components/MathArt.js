import React, { useEffect, useRef } from 'react';
import './MathArt.css';

/*
 * MathArt — μαθηματικά animation «Κομμωτική 2050».
 *
 * <MathArt scene="origin" />   blueprint χρυσής τομής → σπείρα Fibonacci → γαλαξίας (hero)
 * <MathArt scene="colour" />   πλανήτης χρώματος: 10 δακτύλιοι = levels 1–10
 * <MathArt scene="chaos" />    ελκυστής Lorenz
 * <MathArt scene="harmony" />  harmonograph (δύο εκκρεμή)
 * <MathArt scene="galaxy" />   phyllotaxis, 137,5°
 *
 * Τεχνικά: Canvas 2D χωρίς βιβλιοθήκες, ξεκινά μόνο όταν φαίνεται (IntersectionObserver),
 * σταματά όταν βγει από την οθόνη ή κρυφτεί η καρτέλα, σέβεται το prefers-reduced-motion
 * (δείχνει μία στατική εικόνα), λιγότερα σωματίδια σε κινητό, DPR έως 2.
 * Ο καμβάς είναι διάφανος: το φόντο το δίνει το σημείο όπου μπαίνει.
 */

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;
const GA = Math.PI * (3 - Math.sqrt(5)); // χρυσή γωνία ≈ 137,508°
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const FONT = "Manrope, system-ui, -apple-system, 'Segoe UI', sans-serif";

function goldMix(k) {
  // σαμπανί (μέσα) → χρυσό του site (έξω)
  const a = [243, 232, 206];
  const b = [201, 169, 110];
  return `${Math.round(a[0] + (b[0] - a[0]) * k)},${Math.round(a[1] + (b[1] - a[1]) * k)},${Math.round(a[2] + (b[2] - a[2]) * k)}`;
}

function glow(ctx, x, y, r, alpha) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(255,248,230,${alpha})`);
  g.addColorStop(1, 'rgba(201,169,110,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
}

/* ---------- Γαλαξίας (phyllotaxis) ---------- */
function drawGalaxy(ctx, w, h, t, o, appear = 1, cx = w / 2, cy = h / 2, radius = Math.min(w, h) * 0.46) {
  const N = o.lite ? 850 : 1500;
  const n = Math.min(N, t * (o.lite ? 150 : 240));
  const R = radius;
  const c = R / Math.sqrt(N);
  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  halo.addColorStop(0, `rgba(201,169,110,${0.12 * appear})`);
  halo.addColorStop(1, 'rgba(201,169,110,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(t * 0.06);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 1; i < n; i += 1) {
    const a = i * GA;
    const r = c * Math.sqrt(i);
    const k = i / N;
    const wave = 0.5 + 0.5 * Math.sin(t * 1.6 - r * (45 / R));
    const age = Math.min(1, (n - i) / 50);
    const size = (0.45 + k * 1.5 + wave * 0.55) * (R / 170);
    const alpha = (0.22 + 0.62 * wave) * age * appear;
    ctx.fillStyle = `rgba(${goldMix(k)},${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r, Math.sin(a) * r, Math.max(0.5, size), 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function galaxy(ctx, w, h, t, o) {
  drawGalaxy(ctx, w, h, t, o, 1);
}

/* ---------- Blueprint χρυσής τομής → σπείρα ---------- */
function blueprintGeom(w, h) {
  const W = Math.min(w * 0.82, h * 0.62 * PHI);
  const H = W / PHI;
  let x = (w - W) / 2;
  let y = (h - H) / 2 - h * 0.06;
  let rw = W;
  let rh = H;
  const outer = { x, y, w: W, h: H };
  const cuts = [];
  const circles = [];
  const path = [];
  for (let i = 0; i < 9; i += 1) {
    const d = i % 4;
    let s;
    let cx;
    let cy;
    let a0;
    if (d === 0) { s = rh; cuts.push([x + s, y, x + s, y + rh]); cx = x + s; cy = y + s; a0 = Math.PI; x += s; rw -= s; }
    else if (d === 1) { s = rw; cuts.push([x, y + s, x + rw, y + s]); cx = x; cy = y + s; a0 = 1.5 * Math.PI; y += s; rh -= s; }
    else if (d === 2) { s = rh; cuts.push([x + rw - s, y, x + rw - s, y + rh]); cx = x + rw - s; cy = y; a0 = 0; rw -= s; }
    else { s = rw; cuts.push([x, y + rh - s, x + rw, y + rh - s]); cx = x + s; cy = y + rh - s; a0 = 0.5 * Math.PI; rh -= s; }
    circles.push([cx, cy, s]);
    for (let j = 0; j <= 40; j += 1) {
      const a = a0 + (j / 40) * (Math.PI / 2);
      path.push([cx + Math.cos(a) * s, cy + Math.sin(a) * s]);
    }
  }
  return { outer, cuts, circles, path, eye: path[path.length - 1] };
}

function drawBlueprint(ctx, w, h, lt, G, o, alpha) {
  ctx.globalAlpha = alpha;
  ctx.lineCap = 'round';
  G.circles.forEach((c, i) => {
    const p = clamp((lt - 0.8 - i * 0.32) / 0.7);
    if (!p) return;
    ctx.strokeStyle = `rgba(201,169,110,${0.12 * p})`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.arc(c[0], c[1], c[2], 0, TAU * ease(p));
    ctx.stroke();
  });
  const ob = G.outer;
  const corners = [[ob.x, ob.y], [ob.x + ob.w, ob.y], [ob.x + ob.w, ob.y + ob.h], [ob.x, ob.y + ob.h], [ob.x, ob.y]];
  let rem = ease(clamp(lt / 1.2)) * 2 * (ob.w + ob.h);
  ctx.strokeStyle = 'rgba(201,169,110,.62)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ob.x, ob.y);
  for (let i = 1; i < corners.length && rem > 0; i += 1) {
    const a = corners[i - 1];
    const b = corners[i];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const f = Math.min(1, rem / L);
    ctx.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f);
    rem -= L;
  }
  ctx.stroke();
  G.cuts.forEach((s, i) => {
    const p = ease(clamp((lt - 0.8 - i * 0.32) / 0.5));
    if (!p) return;
    ctx.beginPath();
    ctx.moveTo(s[0], s[1]);
    ctx.lineTo(s[0] + (s[2] - s[0]) * p, s[1] + (s[3] - s[1]) * p);
    ctx.stroke();
  });
  const sp = Math.floor(ease(clamp((lt - 3.8) / 3)) * G.path.length);
  if (sp > 1) {
    ctx.save();
    ctx.shadowColor = 'rgba(243,232,206,.8)';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = 'rgba(243,232,206,.95)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(G.path[0][0], G.path[0][1]);
    for (let i = 1; i < sp; i += 1) ctx.lineTo(G.path[i][0], G.path[i][1]);
    ctx.stroke();
    ctx.restore();
  }
  const fl = clamp((lt - 6.8) / 0.8);
  if (fl > 0) {
    ctx.globalCompositeOperation = 'lighter';
    const P = G.path;
    const dots = o.lite ? 20 : 36;
    for (let j = 0; j < dots; j += 1) {
      const u = (j / dots + lt * 0.07) % 1;
      const q = P[Math.floor(u * (P.length - 1))];
      glow(ctx, q[0], q[1], (1 + 2.2 * (1 - u)) * 4, 0.9 * fl * alpha);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.fillStyle = `rgba(179,170,156,${clamp(lt / 1.5) * 0.85 * alpha})`;
  ctx.font = `10px ${FONT}`;
  ctx.textBaseline = 'top';
  ctx.fillText('a / b = φ = 1.6180339887', ob.x, ob.y + ob.h + 10);
  ctx.globalAlpha = 1;
}

function makeOrigin() {
  let geomKey = '';
  let G = null;
  return (ctx, w, h, t, o) => {
    const key = `${w}x${h}`;
    if (key !== geomKey) { G = blueprintGeom(w, h); geomKey = key; }
    // 0–8 δ.: σχέδιο χρυσής τομής · 8–10 δ.: μετάβαση · μετά: ο γαλαξίας γυρίζει συνεχώς
    if (t < 10) drawBlueprint(ctx, w, h, t, G, o, t < 8 ? 1 : 1 - ease((t - 8) / 2));
    if (t > 8) drawGalaxy(ctx, w, h, t - 8, o, ease(clamp((t - 8) / 2)), w / 2, h * 0.4, Math.min(w * 0.42, h * 0.3));
  };
}

/* ---------- Ελκυστής Lorenz ---------- */
let LORENZ = null;
function lorenzPoints() {
  if (LORENZ) return LORENZ;
  const P = [];
  let x = 0.1;
  let y = 0;
  let z = 0;
  const s = 10;
  const r = 28;
  const b = 8 / 3;
  const dt = 0.006;
  for (let i = 0; i < 14300; i += 1) {
    const dx = s * (y - x);
    const dy = x * (r - z) - y;
    const dz = x * y - b * z;
    x += dx * dt; y += dy * dt; z += dz * dt;
    if (i >= 300) P.push([x, y, z]);
  }
  LORENZ = P;
  return P;
}

function chaos(ctx, w, h, t, o) {
  const all = lorenzPoints();
  const total = o.lite ? 7000 : all.length;
  const n = Math.min(total, Math.floor(t * (o.lite ? 900 : 1500)));
  const a = t * 0.22;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const sc = Math.min(w / 62, h / 52);
  const cx = w / 2;
  const cy = h / 2;
  const proj = (p) => [cx + (p[0] * ca - p[1] * sa) * sc, cy - (p[2] - 25) * sc];
  const buckets = [[], [], [], []];
  let prev = null;
  for (let i = 0; i < n; i += 1) {
    const p = all[i];
    const q = proj(p);
    if (prev) {
      const depth = p[0] * sa + p[1] * ca;
      const bi = Math.max(0, Math.min(3, Math.floor(((depth + 25) / 50) * 4)));
      buckets[bi].push(prev[0], prev[1], q[0], q[1]);
    }
    prev = q;
  }
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineWidth = 0.7;
  ctx.lineCap = 'round';
  const cols = ['120,110,96', '170,144,100', '201,169,110', '245,234,206'];
  buckets.forEach((b, i) => {
    ctx.strokeStyle = `rgba(${cols[i]},${(0.28 + i * 0.14).toFixed(2)})`;
    ctx.beginPath();
    for (let k = 0; k < b.length; k += 4) { ctx.moveTo(b[k], b[k + 1]); ctx.lineTo(b[k + 2], b[k + 3]); }
    ctx.stroke();
  });
  // ένας κομήτης που κυκλοφορεί πάνω στην τροχιά, και αφού ολοκληρωθεί το σχέδιο
  if (n > 1) {
    const head = n < total ? n - 1 : Math.floor(t * 420) % total;
    const tail = o.lite ? 60 : 120;
    ctx.strokeStyle = 'rgba(255,248,230,.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let k = Math.max(0, head - tail); k <= head; k += 1) {
      const q = proj(all[k]);
      if (k === Math.max(0, head - tail)) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]);
    }
    ctx.stroke();
    const q = proj(all[head]);
    glow(ctx, q[0], q[1], 14, 1);
  }
  ctx.globalCompositeOperation = 'source-over';
}

/* ---------- Πλανήτης του χρώματος ---------- */
const TONES = {
  el: ['x.1 Σαντρέ', 'x.3 Χρυσό', 'x.4 Χάλκινο', 'x.6 Κόκκινο', 'x.2 Ιριζέ'],
  en: ['x.1 Ash', 'x.3 Gold', 'x.4 Copper', 'x.6 Red', 'x.2 Iridescent']
};
const TONE_HS = [[210, 22], [42, 58], [20, 62], [352, 50], [285, 28]];

function tone(t, lang) {
  const per = 3.6;
  const f = t / per;
  const i = Math.floor(f) % TONE_HS.length;
  const j = (i + 1) % TONE_HS.length;
  const u = ease(clamp(((f % 1) - 0.6) / 0.4));
  let dh = TONE_HS[j][0] - TONE_HS[i][0];
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  const names = TONES[lang] || TONES.el;
  return {
    h: (TONE_HS[i][0] + dh * u + 360) % 360,
    s: TONE_HS[i][1] + (TONE_HS[j][1] - TONE_HS[i][1]) * u,
    name: u < 0.5 ? names[i] : names[j]
  };
}

function colour(ctx, w, h, t, o) {
  const T = tone(t, o.lang);
  const cx = w / 2;
  const cy = h / 2 + h * 0.03;
  const R = Math.min(w * 0.17, h * 0.22);
  const rot = -0.32;
  const tilt = 0.26;
  const rings = [];
  for (let i = 0; i < 10; i += 1) rings.push({ rx: R * 1.32 + i * R * 0.105, L: 6 + i * 9.2 });
  const col = (L, a) => `hsla(${T.h.toFixed(0)},${T.s.toFixed(0)}%,${L.toFixed(0)}%,${a})`;
  const dot = (rg, th, front) => {
    if ((Math.sin(th) > 0) !== front) return;
    const x = rg.rx * Math.cos(th);
    const y = rg.rx * tilt * Math.sin(th);
    const X = cx + x * Math.cos(rot) - y * Math.sin(rot);
    const Y = cy + x * Math.sin(rot) + y * Math.cos(rot);
    ctx.fillStyle = col(Math.min(96, rg.L + 18), 0.95);
    ctx.beginPath();
    ctx.arc(X, Y, Math.max(1.2, R * 0.022), 0, TAU);
    ctx.fill();
  };
  const drawRings = (front) => {
    rings.forEach((rg, i) => {
      ctx.strokeStyle = col(rg.L, 0.85);
      ctx.lineWidth = Math.max(1.2, R * 0.05);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rg.rx, rg.rx * tilt, rot, front ? 0 : Math.PI, front ? Math.PI : TAU);
      ctx.stroke();
      const om = 1.4 * Math.pow((R * 1.32) / rg.rx, 1.5); // Kepler: ω ∝ r^(−3/2)
      const per = o.lite ? 2 : 3;
      for (let k = 0; k < per; k += 1) dot(rg, t * om + (k * TAU) / per + i, front);
    });
  };
  drawRings(false);
  const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.05, cx, cy, R);
  g.addColorStop(0, `hsla(${T.h.toFixed(0)},${(T.s * 0.6).toFixed(0)}%,26%,1)`);
  g.addColorStop(0.55, '#0d0b09');
  g.addColorStop(1, '#030303');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = 'rgba(201,169,110,.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, R, -2.4, 0.3);
  ctx.stroke();
  drawRings(true);
  if (o.labels !== false) {
    const pad = Math.max(12, w * 0.06);
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(179,170,156,.9)';
    ctx.font = `600 10px ${FONT}`;
    ctx.fillText(o.lang === 'en' ? 'TONE' : 'ΤΟΝΟΣ', w / 2, pad);
    ctx.fillStyle = 'rgba(243,232,206,.95)';
    ctx.font = `13px ${FONT}`;
    ctx.fillText(T.name, w / 2, pad + 15);
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgba(179,170,156,.9)';
    ctx.font = `600 10px ${FONT}`;
    ctx.fillText('LEVEL 1 → 10', w / 2, h - pad);
    ctx.textAlign = 'left';
  }
}

/* ---------- Harmonograph ---------- */
const RATIOS = [[2, 3], [3, 4], [1, 2], [3, 5], [2, 5]];
const rnd = (s) => { const x = Math.sin(s * 127.1) * 43758.5453; return x - Math.floor(x); };

function harmony(ctx, w, h, t, o) {
  const cyc = 11;
  const ci = Math.floor(t / cyc);
  const lt = t % cyc;
  const fade = lt > cyc - 1.2 ? (cyc - lt) / 1.2 : clamp(lt * 3);
  const rr = RATIOS[ci % RATIOS.length];
  const det = 0.004 + rnd(ci) * 0.012;
  const f1 = rr[0]; const f2 = rr[1] + det; const f3 = rr[1]; const f4 = rr[0] + det * 0.7;
  const p1 = rnd(ci + 1) * TAU; const p2 = rnd(ci + 2) * TAU; const p3 = rnd(ci + 3) * TAU; const p4 = rnd(ci + 4) * TAU;
  const d = 0.018;
  const Tmax = Math.min(80, lt * 10);
  const A = Math.min(w, h) * 0.23;
  const step = o.lite || Math.min(w, h) < 200 ? 0.04 : 0.02;
  const P = (tt) => {
    const e = Math.exp(-d * tt);
    return [A * e * (Math.sin(f1 * tt + p1) + Math.sin(f2 * tt + p2)), A * e * (Math.sin(f3 * tt + p3) + Math.sin(f4 * tt + p4))];
  };
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(t * 0.03);
  ctx.globalCompositeOperation = 'lighter';
  ctx.beginPath();
  let q = P(0);
  ctx.moveTo(q[0], q[1]);
  for (let tt = step; tt <= Tmax; tt += step) { q = P(tt); ctx.lineTo(q[0], q[1]); }
  const small = Math.min(w, h) < 200;
  ctx.strokeStyle = `rgba(201,169,110,${0.1 * fade})`;
  ctx.lineWidth = small ? 2 : 3;
  ctx.stroke();
  ctx.strokeStyle = `rgba(243,232,206,${0.6 * fade})`;
  ctx.lineWidth = small ? 0.6 : 0.7;
  ctx.stroke();
  q = P(Tmax);
  glow(ctx, q[0], q[1], small ? 6 : 10, fade);
  ctx.restore();
}

const SCENES = {
  origin: { make: makeOrigin, still: 7.6 },
  galaxy: { make: () => galaxy, still: 9 },
  chaos: { make: () => chaos, still: 11 },
  colour: { make: () => colour, still: 4.5 },
  harmony: { make: () => harmony, still: 8 }
};

export default function MathArt({ scene = 'galaxy', lang = 'el', labels = true, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const def = SCENES[scene] || SCENES.galaxy;
    const draw = def.make();
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const opts = { lang, labels, lite: false };
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let started = 0;   // χρόνος έναρξης (ms)
    let pausedAt = 0;  // το animation συνεχίζει από εκεί που σταμάτησε

    const fit = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pw = Math.max(1, Math.round(w * dpr));
      const ph = Math.max(1, Math.round(h * dpr));
      if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      opts.lite = w < 520 || (navigator.hardwareConcurrency || 8) <= 4;
    };
    const render = (t) => {
      if (w < 2 || h < 2) return;
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, t, opts);
    };
    const elapsed = () => (performance.now() - started) / 1000;
    const loop = () => { render(elapsed()); raf = requestAnimationFrame(loop); };
    const start = () => {
      if (running || reduce) return;
      running = true;
      started = performance.now() - pausedAt * 1000;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      pausedAt = elapsed();
      cancelAnimationFrame(raf);
    };

    fit();
    render(def.still); // ολοκληρωμένη στατική εικόνα πριν ξεκινήσει (και για reduced motion)

    let visible = false;
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !document.hidden) start(); else stop();
      }, { rootMargin: '120px' })
      : null;
    if (io) io.observe(canvas); else { visible = true; start(); }

    const onVis = () => { if (document.hidden) stop(); else if (visible) start(); };
    document.addEventListener('visibilitychange', onVis);

    const ro = 'ResizeObserver' in window
      ? new ResizeObserver(() => { fit(); render(running ? elapsed() : (reduce ? def.still : pausedAt || def.still)); })
      : null;
    if (ro) ro.observe(canvas);

    return () => {
      stop();
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [scene, lang, labels]);

  return <canvas ref={ref} className={`math-art ${className}`.trim()} aria-hidden="true" />;
}
