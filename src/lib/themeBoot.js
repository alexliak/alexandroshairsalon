// Ημέρα = λευκό θέμα, νύχτα = σκούρο θέμα, με βάση την ώρα και την ημερομηνία της συσκευής του επισκέπτη.
//
// Τρέχει μέσα στο <head> πριν ζωγραφιστεί η σελίδα (χωρίς «αναβόσβημα») και ξαναελέγχει
// κάθε λεπτό, ώστε μια σελίδα που μένει ανοιχτή να αλλάξει μόνη της στο σούρουπο.
// Η ανατολή/δύση υπολογίζεται κατά προσέγγιση: διάρκεια ημέρας από την ημερομηνία
// (γεωγρ. πλάτος ~38°, ή νότιο ημισφαίριο αν η ζώνη ώρας έχει θερινή ώρα τον Ιανουάριο)
// και ηλιακό μεσημέρι 12:25 (+1 ώρα με θερινή ώρα, διόρθωση «εξίσωσης του χρόνου»). Για την Αθήνα πέφτει μέσα σε ~5′.
//
// Δοκιμή: ?theme=light ή ?theme=dark στη διεύθυνση (κρατιέται για την καρτέλα), ?theme=auto για επαναφορά.
//
// Το ίδιο κείμενο μπαίνει και στις στατικές σελίδες (scripts/build-static-pages.py το διαβάζει από εδώ).
export const THEME_BOOT = `(function(){
var d=document.documentElement,K='ahs-theme';
var LIGHT='#f8f5ef',DARK='#12100e';
function forced(){
  var m=/[?&]theme=(light|dark|auto)\\b/.exec(location.search),v=null;
  try{
    if(m){if(m[1]==='auto'){sessionStorage.removeItem(K);}else{sessionStorage.setItem(K,m[1]);}}
    v=sessionStorage.getItem(K);
  }catch(e){v=m&&m[1]!=='auto'?m[1]:null;}
  return v;
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
function apply(){
  var t=forced()||(isDay(new Date())?'light':'dark');
  if(d.getAttribute('data-theme')===t)return;
  d.setAttribute('data-theme',t);
  d.style.colorScheme=t;
  var m=document.querySelector('meta[name="theme-color"]');
  if(m)m.setAttribute('content',t==='light'?LIGHT:DARK);
  try{window.dispatchEvent(new Event('ahs-theme'));}catch(e){}
}
apply();
setInterval(apply,60000);
document.addEventListener('visibilitychange',function(){if(!document.hidden)apply();});
})();`;

/** Τρέχον θέμα στον browser ('light' | 'dark'). Στο build (χωρίς document) επιστρέφει 'dark'. */
export function currentTheme() {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}
