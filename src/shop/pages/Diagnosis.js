import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS, imageSrc, productUrl } from '../catalog';
import { WHATSAPP } from '../config';
import './Diagnosis.css';

/*
 * «Διάγνωση μαλλιών»: 3 ερωτήσεις → η ρουτίνα της L'Oréal Professionnel που αντιστοιχεί.
 * Πηγές: 00_LP_ECOM_BUNDLES_2024.xlsx (επίσημα σετ/ρουτίνες βήμα-βήμα) και
 * LP_Assortment_Info.xlsx (Hair_type ανά σειρά), από το υλικό της L'Oréal.
 * Τα κείμενα μένουν ουδέτερα: περιγράφουν τη σειρά, δεν λένε ότι την επέλεξε το κομμωτήριο.
 */

const LINES = {
  'Absolut Repair': { img: 'absolut-repair', color: '#d59a3c',
    sub: { el: 'Θρέψη και αναδόμηση για ταλαιπωρημένα μαλλιά', en: 'Nourishing repair for damaged hair' } },
  'Absolut Repair Molecular': { img: 'absolut-repair-molecular', color: '#8a7560',
    sub: { el: 'Μοριακή επανόρθωση για πολύ ταλαιπωρημένα μαλλιά', en: 'Molecular repair for very damaged hair' } },
  'Metal Detox': { img: 'metal-detox', color: '#7d8287',
    sub: { el: 'Για βαμμένα μαλλιά, κατά του σπασίματος', en: 'For colour-treated hair, against breakage' } },
  'Pro Longer': { img: 'pro-longer', color: '#d94f6e',
    sub: { el: 'Για μακριά μαλλιά με λεπτές άκρες', en: 'For long hair with thin ends' } },
  'Vitamino Color': { img: 'vitamino-color', color: '#e88aa0',
    sub: { el: 'Προστασία χρώματος για βαμμένα μαλλιά', en: 'Colour protection for colour-treated hair' } },
  'Curl Expression': { img: 'curl-expression', color: '#8e2a5c',
    sub: { el: 'Ενυδάτωση για σγουρά μαλλιά', en: 'Moisture for curly hair' } },
  'Keratin Alpha Sleek': { img: 'keratin-alpha-sleek', color: '#6b3fb0',
    sub: { el: 'Λείανση για φριζαρισμένα μαλλιά', en: 'Smoothing for frizzy hair' } },
  'Serioxyl Advanced': { img: 'serioxyl', color: '#9aa3a8',
    sub: { el: 'Για μαλλιά που αραιώνουν', en: 'For thinning hair' } },
  'Scalp Advanced': { img: 'scalp-advanced', color: '#1f8a86',
    sub: { el: 'Φροντίδα για ευαίσθητο ή λιπαρό τριχωτό', en: 'Care for a sensitive or oily scalp' } },
  Blondifier: { img: null, color: '#c9a24a',
    sub: { el: 'Λάμψη και θρέψη για ξανθά μαλλιά', en: 'Shine and nourishment for blonde hair' } },
  Silver: { img: null, color: '#8c84b0',
    sub: { el: 'Κατά των ανεπιθύμητων κίτρινων τόνων', en: 'Against unwanted yellow tones' } }
};

// [τίτλος βήματος, οδηγία] σε el / en
const S = (elT, elD, enT, enD) => ({ el: [elT, elD], en: [enT, enD] });
const ROUTINES = {
  'Absolut Repair': [
    S('Σαμπουάν', 'Σε βρεγμένα μαλλιά, ξέβγαλμα.', 'Shampoo', 'On wet hair, rinse.'),
    S('Μάσκα', 'Σε ταμποναρισμένα μαλλιά για 3–5 λεπτά, 1–2 φορές την εβδομάδα.', 'Mask', 'On towel-dried hair for 3–5 minutes, 1–2 times a week.'),
    S('Έλαιο', 'Λίγο στα μήκη και τις άκρες, χωρίς ξέβγαλμα.', 'Oil', 'A little on lengths and ends, leave in.')],
  'Absolut Repair Molecular': [
    S('Σαμπουάν', 'Χωρίς θειικά άλατα, σε βρεγμένα μαλλιά.', 'Shampoo', 'Sulfate-free, on wet hair.'),
    S('Serum που ξεβγάζεται', 'Στη θέση της μάσκας, από τα μήκη ως τις άκρες, ξέβγαλμα.', 'Rinse-out serum', 'Instead of a mask, lengths to ends, rinse.'),
    S('Leave-in μάσκα', 'Σε νωπά μαλλιά, χωρίς ξέβγαλμα.', 'Leave-in mask', 'On damp hair, leave in.')],
  'Metal Detox': [
    S('Σαμπουάν', 'Σε βρεγμένα μαλλιά, ξέβγαλμα.', 'Shampoo', 'On wet hair, rinse.'),
    S('Μάσκα', 'Σε νωπά μαλλιά για 3–5 λεπτά.', 'Mask', 'On damp hair for 3–5 minutes.'),
    S('Έλαιο', 'Καθημερινά στα μήκη, μετά από βαφή, balayage ή ξάνοιγμα.', 'Oil', 'Daily on lengths, after colour, balayage or lightening.')],
  'Pro Longer': [
    S('Σαμπουάν', 'Σε βρεγμένα μαλλιά, ξέβγαλμα.', 'Shampoo', 'On wet hair, rinse.'),
    S('Μάσκα ή conditioner', 'Σε ταμποναρισμένα μαλλιά, ξέβγαλμα.', 'Mask or conditioner', 'On towel-dried hair, rinse.'),
    S('Leave-in κρέμα', 'Λίγη ποσότητα στα μήκη, χωρίς ξέβγαλμα.', 'Leave-in cream', 'A little on the lengths, leave in.')],
  'Vitamino Color': [
    S('Σαμπουάν', 'Σε βρεγμένα μαλλιά, ξέβγαλμα.', 'Shampoo', 'On wet hair, rinse.'),
    S('Μάσκα', 'Σε νωπά μαλλιά για 3–5 λεπτά.', 'Mask', 'On damp hair for 3–5 minutes.'),
    S('Σπρέι 10-σε-1', 'Σε ταμποναρισμένα μαλλιά πριν το στέγνωμα, χωρίς ξέβγαλμα.', '10-in-1 spray', 'On towel-dried hair before drying, leave in.')],
  'Curl Expression': [
    S('Σαμπουάν ενυδάτωσης', 'Μία φορά την εβδομάδα.', 'Moisturising shampoo', 'Once a week.'),
    S('Μάσκα', 'Σε σκουπισμένα μαλλιά για 10 λεπτά, ξέβγαλμα.', 'Mask', 'On towel-dried hair for 10 minutes, rinse.'),
    S('Leave-in κρέμα', 'Λίγη ποσότητα στα μήκη, χωρίς ξέβγαλμα.', 'Leave-in cream', 'A little on the lengths, leave in.')],
  'Keratin Alpha Sleek': [
    S('Σαμπουάν', 'Σε βρεγμένα μαλλιά, ξέβγαλμα.', 'Shampoo', 'On wet hair, rinse.'),
    S('Μάσκα', 'Στα μήκη, ξέβγαλμα.', 'Mask', 'On the lengths, rinse.'),
    S('Smooth Transformer', 'Προοδευτική περιποίηση λείανσης πριν το στέγνωμα.', 'Smooth Transformer', 'Progressive smoothing treatment before drying.')],
  'Serioxyl Advanced': [
    S('Σαμπουάν', 'Απαλά στη ρίζα, ξέβγαλμα.', 'Shampoo', 'Gently at the roots, rinse.'),
    S('Serum', 'Στο τριχωτό, ιδανικά το βράδυ, χωρίς ξέβγαλμα.', 'Serum', 'On the scalp, ideally at night, leave in.')],
  'Scalp Advanced': [
    S('Σαμπουάν', 'Απαλό μασάζ στο τριχωτό, χωρίς έντονο τρίψιμο.', 'Shampoo', 'Gentle scalp massage, no hard rubbing.'),
    S('Περιποίηση', 'Για 3–5 λεπτά, ξέβγαλμα.', 'Treatment', 'For 3–5 minutes, rinse.')],
  Blondifier: [
    S('Σαμπουάν', 'Σε βρεγμένα μαλλιά, ξέβγαλμα.', 'Shampoo', 'On wet hair, rinse.'),
    S('Μάσκα', 'Στα μήκη, ξέβγαλμα.', 'Mask', 'On the lengths, rinse.')],
  Silver: [
    S('Σαμπουάν', 'Σε βρεγμένα μαλλιά, ξέβγαλμα.', 'Shampoo', 'On wet hair, rinse.'),
    S('Conditioner', 'Στα μήκη, ξέβγαλμα.', 'Conditioner', 'On the lengths, rinse.')]
};

const WHY = {
  'Absolut Repair': { el: 'Η L’Oréal προτείνει αυτή τη σειρά για ταλαιπωρημένα μαλλιά: θρέψη και αναδόμηση.', en: 'L’Oréal recommends this range for damaged hair: nourishment and repair.' },
  'Absolut Repair Molecular': { el: 'Για μαλλιά που έχουν ξανοιχτεί και σπάνε, η L’Oréal προτείνει τη μοριακή σειρά επανόρθωσης.', en: 'For lightened hair that breaks, L’Oréal recommends its molecular repair range.' },
  'Metal Detox': { el: 'Η σειρά απευθύνεται σε βαμμένα μαλλιά που σπάνε. Στόχος της είναι λιγότερο σπάσιμο και προστασία του χρώματος.', en: 'A range for colour-treated hair that breaks, aiming at less breakage and colour protection.' },
  'Pro Longer': { el: 'Για όσους μακραίνουν τα μαλλιά τους: ενδυναμώνει τα μήκη και τις λεπτές άκρες.', en: 'For growing your hair: strengthens lengths and thin ends.' },
  'Vitamino Color': { el: 'Η σειρά της L’Oréal για βαμμένα μαλλιά, με στόχο την προστασία και τη λάμψη του χρώματος.', en: 'L’Oréal’s range for colour-treated hair, for colour protection and shine.' },
  'Curl Expression': { el: 'Η σειρά για σγουρά μαλλιά: ενυδάτωση και ξεμπέρδεμα, χωρίς βάρος.', en: 'The range for curly hair: moisture and detangling without weight.' },
  'Keratin Alpha Sleek': { el: 'Η σειρά για φριζαρισμένα και ατίθασα μαλλιά, με προοδευτική λείανση.', en: 'The range for frizzy, unruly hair, with progressive smoothing.' },
  'Serioxyl Advanced': { el: 'Η ρουτίνα της L’Oréal για μαλλιά που αραιώνουν, με φροντίδα στη ρίζα και στο τριχωτό.', en: 'L’Oréal’s routine for thinning hair, caring for roots and scalp.' },
  'Scalp Advanced': { el: 'Όταν το θέμα είναι η ρίζα, η φροντίδα ξεκινά από το τριχωτό. Υπάρχει έκδοση για ευαίσθητο και για λιπαρό τριχωτό.', en: 'When the issue is at the roots, care starts at the scalp. There are versions for sensitive and for oily scalps.' },
  Blondifier: { el: 'Η σειρά για ξανθά μαλλιά, για λάμψη και θρέψη.', en: 'The range for blonde hair, for shine and nourishment.' },
  Silver: { el: 'Η σειρά για ξανθά, λευκά και γκρι μαλλιά, κατά των ανεπιθύμητων κίτρινων τόνων.', en: 'The range for blonde, white and grey hair, against unwanted yellow tones.' }
};

const TIP = {
  fine: { el: 'Λεπτά μαλλιά: λίγη ποσότητα και μόνο στα μήκη, για να μη βαραίνουν.', en: 'Fine hair: use a small amount, on the lengths only, so it isn’t weighed down.' },
  thick: { el: 'Πυκνά μαλλιά: χώρισε τα μαλλιά σε τμήματα για να απλωθεί σωστά η περιποίηση.', en: 'Thick hair: work in sections so the treatment spreads evenly.' },
  curly: { el: 'Σγουρά μαλλιά: εφάρμοσε σε βρεγμένα μαλλιά και στέγνωσε με διαχυτή.', en: 'Curly hair: apply on wet hair and dry with a diffuser.' },
  normal: { el: 'Για να δεις διαφορά, κράτα τη ρουτίνα σταθερή μερικές εβδομάδες.', en: 'Keep the routine steady for a few weeks to see the difference.' }
};

const TEXT = {
  el: {
    eyebrow: 'Online shop · Διάγνωση',
    title: 'Η ρουτίνα που σου <em>ταιριάζει.</em>',
    lead: 'Τρεις ερωτήσεις, δέκα δευτερόλεπτα. Βλέπεις τη ρουτίνα της L’Oréal Professionnel που αντιστοιχεί στα μαλλιά σου, βήμα προς βήμα. Αν θες, ρώτα μας.',
    facts: ['Ρουτίνες της L’Oréal Professionnel', 'Χωρίς λογαριασμό'],
    start: 'Ξεκίνα τη διάγνωση',
    step: (i) => `Ερώτηση ${i} από 3`,
    back: '← Πίσω',
    composing: 'Συνθέτουμε τη <em>ρουτίνα σου</em>',
    a1: 'Τύπος μαλλιών', a2: 'Ανάγκη', a3: 'Χρώμα',
    card: 'Η κάρτα των μαλλιών σου',
    routine: 'Η ρουτίνα σου',
    live: 'Διαθέσιμα τώρα στο shop',
    ask: 'Ζήτα τιμές για τη ρουτίνα σου',
    keep: 'Κράτησέ τα για το ραντεβού μου',
    again: '↺ Κάνε ξανά τη διάγνωση',
    toShop: 'Δες όλο το shop',
    extraOil: 'Έλαιο Metal Detox',
    extraOilD: 'Καθημερινά στα μήκη, μετά από βαφή, balayage ή ξάνοιγμα.',
    wa: (s) => `Γεια σας! Έκανα τη διάγνωση στο site. Μαλλιά: ${s}.`,
    waAsk: 'Θα ήθελα τιμές και διαθεσιμότητα.',
    waKeep: 'Θέλω να τα παραλάβω στο επόμενο ραντεβού μου.',
    proposal: 'Πρόταση'
  },
  en: {
    eyebrow: 'Online shop · Diagnosis',
    title: 'The routine that <em>suits you.</em>',
    lead: 'Three questions, ten seconds. See the L’Oréal Professionnel routine that matches your hair, step by step. Ask us if you like.',
    facts: ['L’Oréal Professionnel routines', 'No account needed'],
    start: 'Start the diagnosis',
    step: (i) => `Question ${i} of 3`,
    back: '← Back',
    composing: 'Composing <em>your routine</em>',
    a1: 'Hair type', a2: 'Need', a3: 'Colour',
    card: 'Your hair card',
    routine: 'Your routine',
    live: 'Available now in the shop',
    ask: 'Ask for prices for your routine',
    keep: 'Keep them for my appointment',
    again: '↺ Take the diagnosis again',
    toShop: 'Browse the whole shop',
    extraOil: 'Metal Detox oil',
    extraOilD: 'Daily on the lengths, after colour, balayage or lightening.',
    wa: (s) => `Hello! I took the hair diagnosis on your site. Hair: ${s}.`,
    waAsk: 'I would like prices and availability.',
    waKeep: 'I would like to collect them at my next appointment.',
    proposal: 'Suggestion'
  }
};

const QUESTIONS = [
  { key: 'texture', q: { el: 'Πώς είναι <em>τα μαλλιά σου;</em>', en: 'What is <em>your hair like?</em>' }, opts: [
    ['fine', 'Λεπτά', 'Fine'], ['normal', 'Κανονικά', 'Normal'], ['thick', 'Πυκνά', 'Thick'], ['curly', 'Σγουρά ή κυματιστά', 'Curly or wavy']] },
  { key: 'concern', q: { el: 'Τι σε απασχολεί <em>περισσότερο;</em>', en: 'What bothers you <em>most?</em>' }, opts: [
    ['damage', 'Σπάνε, είναι ταλαιπωρημένα', 'It breaks, it’s damaged'], ['dry', 'Είναι ξηρά, χωρίς λάμψη', 'It’s dry and dull'],
    ['frizz', 'Φριζάρουν', 'Frizz'], ['length', 'Θέλω να μακρύνουν, έχω ψαλίδα', 'I want length, I have split ends'],
    ['fade', 'Το χρώμα ξεθωριάζει γρήγορα', 'My colour fades fast'], ['brass', 'Κιτρινίζουν (ξανθά ή γκρι)', 'It turns yellow (blonde or grey)'],
    ['thin', 'Αραιώνουν', 'It’s thinning'], ['scalp', 'Λιπαρή ρίζα ή ευαίσθητο τριχωτό', 'Oily roots or sensitive scalp']] },
  { key: 'chem', q: { el: 'Έχουν <em>χρώμα ή ξάνοιγμα;</em>', en: 'Is it <em>coloured or lightened?</em>' }, opts: [
    ['none', 'Όχι, είναι φυσικά', 'No, it’s natural'], ['colored', 'Είναι βαμμένα', 'It’s coloured'], ['lightened', 'Έχουν ανταύγειες ή ντεκαπάζ', 'It has highlights or bleach']] }
];
const LABEL = {};
QUESTIONS.forEach((q) => q.opts.forEach(([k, el, en]) => { LABEL[k] = { el, en }; }));

export function pickRoutine(a) {
  const lit = a.chem === 'lightened';
  const col = a.chem === 'colored';
  const curly = a.texture === 'curly';
  let main;
  switch (a.concern) {
    case 'damage': main = lit ? 'Absolut Repair Molecular' : col ? 'Metal Detox' : 'Absolut Repair'; break;
    case 'dry': main = curly ? 'Curl Expression' : lit ? 'Blondifier' : 'Absolut Repair'; break;
    case 'frizz': main = curly ? 'Curl Expression' : 'Keratin Alpha Sleek'; break;
    case 'length': main = 'Pro Longer'; break;
    case 'fade': main = 'Vitamino Color'; break;
    case 'brass': main = 'Silver'; break;
    case 'thin': main = 'Serioxyl Advanced'; break;
    default: main = 'Scalp Advanced';
  }
  // Η L'Oréal προτείνει το έλαιο Metal Detox μετά από βαφή, balayage ή ξάνοιγμα
  const extra = a.chem !== 'none' && main !== 'Metal Detox' && a.concern !== 'scalp' && a.concern !== 'thin' ? 'Metal Detox' : null;
  return { main, extra };
}

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Σωματίδια που συγκλίνουν στη χρυσή γωνία (137,5°) κατά τη «σύνθεση»
const Orb = ({ duration, onDone }) => {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext('2d');
    const W = 440; const C = W / 2; const N = 520; const R = 190;
    const GA = Math.PI * (3 - Math.sqrt(5));
    const seeds = Array.from({ length: N }, () => ({ a: Math.random() * 6.283, d: R * (1.1 + Math.random() * 0.8) }));
    const t0 = performance.now();
    let raf = 0; let timer = 0;
    const frame = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      ctx.clearRect(0, 0, W, W);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 1; i < N; i += 1) {
        const ta = i * GA + now * 0.0004;
        const tr = R * 0.92 * Math.sqrt(i / N);
        const s = seeds[i];
        const x = C + Math.cos(s.a) * s.d * (1 - e) + Math.cos(ta) * tr * e;
        const y = C + Math.sin(s.a) * s.d * (1 - e) + Math.sin(ta) * tr * e;
        const k = i / N;
        const al = (0.25 + 0.6 * e) * (0.6 + 0.4 * Math.sin(now * 0.004 - k * 9));
        ctx.fillStyle = `rgba(${(243 - 42 * k) | 0},${(232 - 63 * k) | 0},${(206 - 96 * k) | 0},${al.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 1 + 1.8 * k, 0, 6.283);
        ctx.fill();
      }
      if (t < 1) raf = requestAnimationFrame(frame); else timer = setTimeout(onDone, 250);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [duration, onDone]);
  return <canvas ref={ref} width="440" height="440" className="dx-orb" aria-hidden="true" />;
};

const Diagnosis = ({ lang = 'el' }) => {
  const L = lang === 'en' ? 'en' : 'el';
  const T = TEXT[L];
  const [stage, setStage] = useState('intro'); // intro | q0 | q1 | q2 | analyse | result
  const [ans, setAns] = useState({});
  const [lit, setLit] = useState(0);
  const topRef = useRef(null);

  useEffect(() => {
    document.title = L === 'en' ? 'Hair diagnosis | Alexandros Hair Salon' : 'Διάγνωση μαλλιών | Alexandros Hair Salon';
  }, [L]);

  // Κάθε νέα οθόνη ξεκινά από πάνω (σημαντικό στο κινητό)
  useEffect(() => {
    if (stage !== 'intro' && topRef.current) topRef.current.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' });
  }, [stage]);

  useEffect(() => {
    if (stage !== 'analyse') return undefined;
    setLit(0);
    const ids = [1, 2, 3].map((n) => setTimeout(() => setLit(n), 350 + (n - 1) * 450));
    return () => ids.forEach(clearTimeout);
  }, [stage]);

  const choose = (qi, key) => {
    const next = { ...ans, [QUESTIONS[qi].key]: key };
    setAns(next);
    setTimeout(() => {
      if (qi < 2) setStage(`q${qi + 1}`);
      else setStage(reduceMotion() ? 'result' : 'analyse');
    }, reduceMotion() ? 0 : 180);
  };

  const finish = React.useCallback(() => setStage('result'), []);
  const dots = stage === 'intro' ? 0 : stage.startsWith('q') ? Number(stage[1]) : 3;

  let body;
  if (stage === 'intro') {
    body = (
      <section className="dx-screen">
        <span className="nh-eyebrow">{T.eyebrow}</span>
        <h1 className="dx-h1" dangerouslySetInnerHTML={{ __html: T.title }} />
        <p className="dx-lead">{T.lead}</p>
        <ul className="dx-facts">{T.facts.map((f) => <li key={f}>{f}</li>)}</ul>
        <button type="button" className="nh-btn nh-btn-gold dx-start" onClick={() => setStage('q0')}>{T.start}</button>
      </section>
    );
  } else if (stage.startsWith('q')) {
    const qi = Number(stage[1]);
    const q = QUESTIONS[qi];
    body = (
      <section className="dx-screen" key={stage}>
        <span className="dx-step">{T.step(qi + 1)}</span>
        <h2 className="dx-h2" dangerouslySetInnerHTML={{ __html: q.q[L] }} />
        <div className="dx-opts">
          {q.opts.map(([k, el, en]) => (
            <button key={k} type="button" className={`dx-opt${ans[q.key] === k ? ' is-sel' : ''}`} onClick={() => choose(qi, k)}>
              <span>{L === 'en' ? en : el}</span><span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
        <button type="button" className="dx-link" onClick={() => setStage(qi === 0 ? 'intro' : `q${qi - 1}`)}>{T.back}</button>
      </section>
    );
  } else if (stage === 'analyse') {
    body = (
      <section className="dx-screen dx-analysis">
        <Orb duration={2100} onDone={finish} />
        <h2 className="dx-h2" dangerouslySetInnerHTML={{ __html: T.composing }} />
        <ol className="dx-steps">
          <li className={lit >= 1 ? 'is-on' : ''}>{T.a1} · {LABEL[ans.texture][L]}</li>
          <li className={lit >= 2 ? 'is-on' : ''}>{T.a2} · {LABEL[ans.concern][L]}</li>
          <li className={lit >= 3 ? 'is-on' : ''}>{T.a3} · {LABEL[ans.chem][L]}</li>
        </ol>
      </section>
    );
  } else {
    const { main, extra } = pickRoutine(ans);
    const info = LINES[main];
    const steps = ROUTINES[main].map((s) => [`${s[L][0]} ${main}`, s[L][1]]);
    if (extra) steps.push([T.extraOil, T.extraOilD]);
    const live = PRODUCTS.filter((p) => (p.line === main || p.line === extra) && p.image);
    const summary = `${LABEL[ans.texture][L]}, ${LABEL[ans.concern][L].toLowerCase()}, ${LABEL[ans.chem][L].toLowerCase()}. ${T.proposal}: ${main}${extra ? ` + ${extra}` : ''}.`;
    const wa = (tail) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`${T.wa(summary)} ${tail}`)}`;
    body = (
      <section className="dx-screen">
        <span className="nh-eyebrow">{T.card}</span>
        <article className="dx-card" style={{ '--dx-accent': info.color }}>
          <div className="dx-card-head">
            <div className="dx-halo">
              {info.img
                ? <img src={imageSrc(info.img, 400)} alt={main} width="76" height="76" />
                : <span className="dx-mono">{main.split(' ').map((w) => w[0]).join('')}</span>}
            </div>
            <div>
              <div className="dx-line">{main}</div>
              <div className="dx-sub">{info.sub[L]}</div>
            </div>
          </div>
          <ul className="dx-chips">
            <li>{LABEL[ans.texture][L]}</li><li>{LABEL[ans.concern][L]}</li><li>{LABEL[ans.chem][L]}</li>
          </ul>
          <p className="dx-why">{WHY[main][L]}</p>
          <div>
            <div className="dx-label">{T.routine}</div>
            <ol className="dx-routine">
              {steps.map(([a, b]) => <li key={a}><div><b>{a}</b><span>{b}</span></div></li>)}
            </ol>
          </div>
          {live.length > 0 && (
            <div className="dx-live">
              <div className="dx-label">{T.live}</div>
              {live.map((p) => (
                <Link key={p.id} to={productUrl(p)} className="dx-prod">
                  <img src={imageSrc(p.image, 400)} alt="" width="56" height="56" loading="lazy" />
                  <div><b>{p.name[L] || p.name.el}</b><span>{p.brand}</span></div>
                </Link>
              ))}
            </div>
          )}
          <p className="dx-tip">{TIP[ans.texture][L]}</p>
          <div className="dx-ctas">
            <a className="nh-btn nh-btn-gold" href={wa(T.waAsk)} target="_blank" rel="noopener noreferrer">{T.ask}</a>
            <a className="nh-btn nh-btn-ghost" href={wa(T.waKeep)} target="_blank" rel="noopener noreferrer">{T.keep}</a>
          </div>
        </article>
        <div className="dx-after">
          <button type="button" className="dx-link" onClick={() => { setAns({}); setStage('intro'); }}>{T.again}</button>
          <Link to="/shop" className="nh-underline">{T.toShop}</Link>
        </div>
      </section>
    );
  }

  return (
    <div className="dx" ref={topRef}>
      <div className="dx-dots" aria-hidden="true">{[1, 2, 3].map((n) => <i key={n} className={n <= dots ? 'is-on' : ''} />)}</div>
      <div aria-live="polite">{body}</div>
    </div>
  );
};

export default Diagnosis;
