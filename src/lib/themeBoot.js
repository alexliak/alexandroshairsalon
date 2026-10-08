// Θέμα του site: ανοιχτό ή σκούρο, όπως είναι ρυθμισμένη η συσκευή του επισκέπτη.
//
// Σειρά προτεραιότητας:
//   1. Επιλογή του επισκέπτη από τον διακόπτη του site (Αυτόματο / Ανοιχτό / Σκούρο), κρατιέται στη συσκευή.
//   2. Ρύθμιση της συσκευής (prefers-color-scheme). Όποιος έχει «Αυτόματο» στο iPhone/Android/Mac/Windows
//      βλέπει λευκό την ημέρα και σκούρο τη νύχτα, αφού το αλλάζει το ίδιο το σύστημα στο σούρουπο.
//   3. Αν ο browser δεν δίνει ρύθμιση (πολύ παλιός): λευκό από την ανατολή ως τη δύση, κατά προσέγγιση
//      (πλάτος ~38°, ηλιακό μεσημέρι 12:25 + θερινή ώρα, με «εξίσωση του χρόνου»).
//
// Τρέχει μέσα στο <head> πριν ζωγραφιστεί η σελίδα (χωρίς «αναβόσβημα») και αλλάζει αμέσως
// όταν αλλάξει η ρύθμιση της συσκευής, χωρίς ανανέωση της σελίδας.
//
// Δοκιμή: ?theme=light ή ?theme=dark στη διεύθυνση (μόνο για την καρτέλα), ?theme=auto για επαναφορά.
//
// Το ίδιο κείμενο μπαίνει και στις στατικές σελίδες (scripts/build-static-pages.py το διαβάζει από εδώ).
export const THEME_BOOT = `(function(){
var d=document.documentElement,KS='ahs-theme',KL='ahs-theme-mode';
var LIGHT='#f8f5ef',DARK='#12100e';
var mq=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;
var mqOk=!!(window.matchMedia&&window.matchMedia('(prefers-color-scheme)').matches);
function urlForced(){
  var m=/[?&]theme=(light|dark|auto)\\b/.exec(location.search),v=null;
  try{
    if(m){if(m[1]==='auto'){sessionStorage.removeItem(KS);}else{sessionStorage.setItem(KS,m[1]);}}
    v=sessionStorage.getItem(KS);
  }catch(e){v=m&&m[1]!=='auto'?m[1]:null;}
  return v;
}
function mode(){
  var v=null;try{v=localStorage.getItem(KL);}catch(e){}
  return v==='light'||v==='dark'?v:'auto';
}
function isDay(n){
  var y=n.getFullYear(),jan=new Date(y,0,1).getTimezoneOffset(),jul=new Date(y,6,1).getTimezoneOffset();
  var dst=n.getTimezoneOffset()<Math.max(jan,jul)?1:0;
  var lat=(jan<jul?-35:38)*Math.PI/180;
  var doy=Math.floor((n-new Date(y,0,0))/864e5);
  var dec=23.44*Math.PI/180*Math.sin(2*Math.PI*(284+doy)/365);
  var c=(Math.sin(-0.833*Math.PI/180)-Math.sin(lat)*Math.sin(dec))/(Math.cos(lat)*Math.cos(dec));
  var half=Math.acos(Math.max(-1,Math.min(1,c)))*12/Math.PI;
  var B=2*Math.PI*(doy-81)/364,eot=9.87*Math.sin(2*B)-7.53*Math.cos(B)-1.5*Math.sin(B);
  var noon=12.42+dst-eot/60,h=n.getHours()+n.getMinutes()/60;
  return h>=noon-half&&h<noon+half;
}
function resolve(){
  var f=urlForced();if(f)return f;
  var m=mode();if(m!=='auto')return m;
  if(mq&&mqOk)return mq.matches?'dark':'light';
  return isDay(new Date())?'light':'dark';
}
function apply(){
  var t=resolve();
  d.setAttribute('data-theme-mode',mode());
  if(d.getAttribute('data-theme')===t)return;
  d.setAttribute('data-theme',t);
  d.style.colorScheme=t;
  var m=document.querySelector('meta[name="theme-color"]');
  if(m)m.setAttribute('content',t==='light'?LIGHT:DARK);
  try{window.dispatchEvent(new Event('ahs-theme'));}catch(e){}
}
window.ahsTheme={
  mode:mode,
  set:function(v){
    try{if(v==='light'||v==='dark'){localStorage.setItem(KL,v);}else{localStorage.removeItem(KL);}sessionStorage.removeItem(KS);}catch(e){}
    apply();try{window.dispatchEvent(new Event('ahs-theme'));}catch(e){}
  }
};
apply();
if(mq){if(mq.addEventListener){mq.addEventListener('change',apply);}else if(mq.addListener){mq.addListener(apply);}}
if(!mqOk)setInterval(apply,60000);
document.addEventListener('visibilitychange',function(){if(!document.hidden)apply();});
})();`;

/** Τρέχον θέμα στον browser ('light' | 'dark'). Στο build (χωρίς document) επιστρέφει 'dark'. */
export function currentTheme() {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

/** Επιλογή του επισκέπτη: 'auto' (ρύθμιση συσκευής), 'light' ή 'dark'. */
export function themeMode() {
  if (typeof window === 'undefined' || !window.ahsTheme) return 'auto';
  return window.ahsTheme.mode();
}

export function setThemeMode(mode) {
  if (typeof window !== 'undefined' && window.ahsTheme) window.ahsTheme.set(mode);
}
