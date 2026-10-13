// Συγκατάθεση για cookies (Google Analytics, χάρτης Google).
// Κατά τις συστάσεις της ΑΠΔΠΧ (25/2/2020): τίποτα μη απαραίτητο πριν από επιλογή, «Αποδοχή» και «Απόρριψη»
// ισότιμα στο ίδιο επίπεδο, η επιλογή αλλάζει από το footer, και ξαναρωτάμε μετά το ίδιο διάστημα σε όποια επιλογή.

export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-S7ZQL4YMJ7';
const KEY = 'ahs_consent_v1';
const MAX_AGE_DAYS = 180;

// Τρέχει μέσα στο <head> πριν από το React: αν υπάρχει ισχύουσα αποδοχή, φορτώνει το Google Analytics.
export const CONSENT_BOOT = `(function(){try{var c=JSON.parse(localStorage.getItem('${KEY}')||'null');
if(!c||c.v!=='granted'||Date.now()-c.t>${MAX_AGE_DAYS}*864e5)return;
window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};
gtag('js',new Date());gtag('config','${GA_ID}');
var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
document.head.appendChild(s);}catch(e){}})();`;

export function getConsent() {
  try {
    const c = JSON.parse(window.localStorage.getItem(KEY) || 'null');
    if (!c || Date.now() - c.t > MAX_AGE_DAYS * 864e5) return null;
    return c.v;
  } catch {
    return null;
  }
}

function loadAnalytics() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

export function setConsent(v) {
  try { window.localStorage.setItem(KEY, JSON.stringify({ v, t: Date.now() })); } catch { /* ιδιωτική περιήγηση */ }
  if (v === 'granted') {
    loadAnalytics();
  } else if (window.gtag) {
    // Ανάκληση: σταματάμε αμέσως την αποστολή και σβήνουμε τα cookies του Analytics.
    window[`ga-disable-${GA_ID}`] = true;
    document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => n === '_ga' || n.startsWith('_ga_'))
      .forEach((n) => {
        const host = window.location.hostname.replace(/^www\./, '');
        [host, `.${host}`, ''].forEach((d) => {
          document.cookie = `${n}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`;
        });
      });
  }
  window.dispatchEvent(new CustomEvent('ahs-consent', { detail: v }));
}

export const openConsent = () => window.dispatchEvent(new Event('ahs-consent-open'));
