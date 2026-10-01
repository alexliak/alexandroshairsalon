#!/usr/bin/env python3
"""Builds the static pages in public/: /kratisi/ (Treatwell widget) and the SEO service pages.

Run from the repo root:  python3 scripts/build-static-pages.py
Prices come from the MENU below. Keep it the same as Treatwell and src/data/menu.js.
"""
import json
import html
import pathlib

ICONS = json.loads((pathlib.Path(__file__).parent / 'icons.json').read_text(encoding='utf-8'))  # from export-icons.js

SITE = "https://alexandroshairsalon.gr"
WIDGET = "https://widget.treatwell.gr/place/523778/menu/"
TW_JS = "https://widget.treatwell.gr/common/venue-menu/javascript/widget-button.js?v1"
TW_CSS = "https://widget.treatwell.gr/common/venue-menu/css/widget-button.css"
PHONE = "+302103465554"
PHONE_TXT = "210 346 5554"
GOOGLE = "https://maps.google.com/?cid=216820567926321844"
ADDRESS = "Ερυσίχθονος 3-5, Θησείο, Αθήνα 118 51"

# (option, duration, price)
MENU = {
    "women_cut": ("Γυναικείο κούρεμα", [("Έως τους ώμους", "30′", 28), ("Κάτω από τους ώμους ή πυκνά έως τους ώμους", "35′", 31), ("Μακριά & πυκνά ή extensions", "45′", 38)]),
    "men_cut": ("Ανδρικό κούρεμα", [("", "30′", 24)]),
    "kids_cut": ("Παιδικό κούρεμα", [("", "30′", 20)]),
    "cut_blowout": ("Κούρεμα & Blowout (πακέτο)", [("Έως τους ώμους", "45′", 38), ("Κάτω από τους ώμους ή πυκνά", "55′", 45)]),
    "root": ("Βαφή ρίζας – κάλυψη λευκών", [("Έως 6 εβδομάδες · Farcom", "40′", 35), ("Express 10′ · Redken", "40′", 39), ("Έως 6 εβδομάδες · Majirel", "40′", 42), ("Χωρίς αμμωνία · INOA / Redken", "50′", 44), ("Μεγάλη ρίζα 6+ εβδομάδες · Majirel", "50′", 49), ("Χωρίς αμμωνία · μεγάλη ρίζα", "50′", 55)]),
    "extra": ("+ Πολύ πυκνά ή πολύ μακριά μαλλιά", [("Προσθήκη στη βαφή", "15′", 19)]),
    "root_gloss": ("Βαφή ρίζας + ρεφλέ (gloss)", [("Κοντά", "1 ώρα", 52), ("Έως τους ώμους", "1 ώρα", 64), ("Κάτω από τους ώμους", "1 ώρα 05′", 79)]),
    "gloss": ("Ρεφλέ / Gloss – λάμψη & τόνος", [("Κοντά", "45′", 31), ("Έως τους ώμους", "50′", 43), ("Κάτω από τους ώμους", "1 ώρα", 53)]),
    "correction": ("Διόρθωση χρώματος – διάγνωση", [("Πλάνο και ακριβής τιμή πριν ξεκινήσουμε", "1 ώρα 20′", 40)]),
    "root_blowout": ("Βαφή ρίζας & Blowout (πακέτο)", [("", "1 ώρα 15′", 52)]),
    "colour_cut": ("Βαφή ρίζας, κούρεμα & Blowout (πακέτο)", [("Έως τους ώμους", "1 ώρα 30′", 63), ("Κάτω από τους ώμους ή πυκνά", "1 ώρα 40′", 70)]),
    "face_frame": ("Face framing – φως στο πρόσωπο", [("", "1 ώρα 15′", 46)]),
    "partial": ("Balayage ή ανταύγειες – μερικές", [("Κοντά", "1 ώρα 35′", 55), ("Έως τους ώμους", "1 ώρα 50′", 79), ("Κάτω από τους ώμους", "2 ώρες", 104)]),
    "full": ("Balayage ή ανταύγειες – ολόκληρες", [("Κοντά", "2 ώρες 10′", 76), ("Έως τους ώμους", "2 ώρες 25′", 100), ("Κάτω από τους ώμους", "2 ώρες 45′", 126)]),
    "nobleach": ("No-Bleach ανταύγειες – χωρίς ντεκαπάζ", [("Φωτισμός προσώπου · 9–15 τούφες", "1 ώρα 20′", 51), ("Μερικές · 15–25 τούφες · έως τους ώμους", "1 ώρα 50′", 85)]),
    "balayage_pack": ("Balayage, κούρεμα & Blowout (πακέτο)", [("Μερικές · έως τους ώμους", "2 ώρες 40′", 100), ("Μερικές · κάτω από τους ώμους", "3 ώρες 10′", 133)]),
}

LANG_JS = """<script>
(function(){
  var KEY='ahs-lang', els=[].slice.call(document.querySelectorAll('[data-en]'));
  els.forEach(function(e){e.setAttribute('data-el', e.innerHTML);});
  var b=document.querySelector('[data-lang-toggle]');
  function set(l){
    els.forEach(function(e){e.innerHTML=e.getAttribute(l==='en'?'data-en':'data-el');});
    document.documentElement.lang=l;
    if(b){b.textContent=l==='en'?'EL':'EN';b.setAttribute('aria-label',l==='en'?'Αλλαγή στα Ελληνικά':'Switch to English');}
    try{localStorage.setItem(KEY,l);}catch(e){}
  }
  var cur='el';try{cur=localStorage.getItem(KEY)||'el';}catch(e){}
  if(cur==='en')set('en');
  if(b)b.addEventListener('click',function(){cur=(cur==='en'?'el':'en');set(cur);});
})();
</script>"""

GA = """<script async src="https://www.googletagmanager.com/gtag/js?id=G-S7ZQL4YMJ7"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-S7ZQL4YMJ7');</script>"""

CSS = """
:root{--bg:#12100e;--panel:#1c1915;--line:#2e2a24;--text:#f3eee6;--muted:#b3aa9c;--soft:#cfc6b8;--gold:#c9a96e;--ink:#17140f;--serif:Fraunces,Georgia,serif;--sans:Manrope,system-ui,sans-serif}
*{box-sizing:border-box}html,body{margin:0}
body{background:var(--bg);color:var(--text);font-family:var(--sans);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:var(--gold)}
.wrap{max-width:980px;margin:0 auto;padding:0 16px}
header.top{position:sticky;top:0;z-index:20;background:rgba(18,16,14,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
header.top .wrap{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:72px}
.logo{display:flex;flex-direction:column;text-decoration:none;color:var(--text)}
.logo b{font-family:var(--serif);font-weight:500;font-size:22px;line-height:1.1}
.logo span{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:var(--muted)}
.top nav{display:flex;gap:22px;align-items:center;font-size:15px}
.top nav a{color:var(--soft);text-decoration:none}.top nav a:hover{color:var(--gold)}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 24px;border-radius:999px;font-weight:800;text-decoration:none;border:1px solid var(--gold);font-size:16px;cursor:pointer}
.btn.gold{background:var(--gold);color:var(--ink)}.btn.ghost{background:transparent;color:var(--text);border-color:#5a5247}
.top .btn{min-height:40px;padding:0 18px;font-size:14px}
.eyebrow{font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:var(--gold)}
h1{font-family:var(--serif);font-weight:300;font-size:clamp(38px,6vw,68px);line-height:1.02;letter-spacing:-.02em;margin:14px 0 18px}
h1 em,h2 em{font-style:italic;color:var(--gold)}
h2{font-family:var(--serif);font-weight:300;font-size:clamp(28px,3.6vw,40px);line-height:1.1;margin:0 0 16px}
h3{font-size:17px;margin:0}
.lead{font-size:18px;color:var(--soft);max-width:720px;margin:0 0 24px}
.hero{padding:48px 0 32px}
.cta{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.facts{display:flex;flex-wrap:wrap;gap:6px 22px;margin:20px 0 0;padding:0;list-style:none;font-size:14px;color:var(--muted)}
.facts li:before{content:"✓ ";color:var(--gold)}
section.block{padding:40px 0;border-top:1px solid var(--line)}
.prose p{color:var(--soft);max-width:760px}
.svc{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:18px 20px;margin:12px 0}
.svc ul{list-style:none;margin:10px 0 0;padding:0}
.svc li{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-top:1px dashed var(--line);font-size:15px}
.svc li:first-child{border-top:0}.svc .d{color:var(--muted);white-space:nowrap}.svc .p{font-weight:800;white-space:nowrap;color:var(--gold)}
details{border-top:1px solid var(--line);padding:14px 0}details:last-of-type{border-bottom:1px solid var(--line)}
summary{cursor:pointer;font-weight:700;font-size:17px}details p{color:var(--soft);margin:10px 0 0}
.links{display:flex;flex-wrap:wrap;gap:10px}.links a{padding:8px 14px;border:1px solid var(--line);border-radius:999px;color:var(--text);text-decoration:none;font-size:14px}.links a:hover{border-color:var(--gold);color:var(--gold)}
footer.bottom{margin-top:48px;padding:28px 0 100px;border-top:1px solid var(--line);font-size:14px;color:var(--muted)}
footer.bottom a{color:var(--muted)}
.mbar{display:none}
@media (max-width:760px){
 .top nav a.hide-m{display:none}
 .top nav{gap:12px}
 .cta .btn{flex:1 1 100%}
 .mbar{display:flex;position:fixed;left:12px;right:12px;bottom:14px;z-index:20;align-items:center;justify-content:space-between;padding:8px 8px 8px 18px;border-radius:999px;background:var(--panel);border:1px solid #3a342c;box-shadow:0 10px 30px rgba(0,0,0,.5)}
 .mbar span{font-size:14px;font-weight:700}
 main:focus{outline:none}.mbar .btn{min-height:44px}
}
.skip{position:absolute;left:12px;top:-60px;z-index:100;padding:12px 18px;border-radius:999px;background:var(--gold);color:var(--ink);font-weight:800;text-decoration:none}
.skip:focus{top:12px}
a:focus-visible,button:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.icons{display:flex;gap:8px;align-items:center}
.icons a{width:40px;height:40px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #5a5247;color:var(--text)}
.icons a svg{width:18px;height:18px}
.icons a.wa:hover,.icons a.wa:focus-visible{background:#25d366;border-color:#25d366;color:#0b1f12}
.icons a.vb:hover,.icons a.vb:focus-visible{background:#7360f2;border-color:#7360f2;color:#fff}
.icons a.mp:hover,.icons a.mp:focus-visible{background:#ea4335;border-color:#ea4335;color:#fff}
.icons a.ph:hover,.icons a.ph:focus-visible,.icons a.ft:hover,.icons a.ft:focus-visible{background:var(--gold);border-color:var(--gold);color:var(--ink)}
.totop{position:fixed;right:20px;bottom:24px;z-index:31;width:48px;height:48px;border-radius:999px;border:1px solid var(--gold);background:rgba(18,16,14,.92);color:var(--gold);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;visibility:hidden;transition:opacity .2s,visibility .2s}
.totop svg{width:18px;height:18px}.totop.on{opacity:1;visibility:visible}.totop:hover{background:var(--gold);color:var(--ink)}
@media (max-width:760px){.top .btn.gold{display:none}.icons a{width:34px;height:34px}.icons a svg{width:16px;height:16px}.icons{gap:5px}.logo b{font-size:19px}.logo span{letter-spacing:.1em;font-size:9px}.totop{bottom:96px;right:14px;width:44px;height:44px}}
@media (prefers-reduced-motion:reduce){.totop{transition:none}}
.lang{flex:none;min-width:40px;height:40px;border-radius:999px;border:1px solid #5a5247;background:transparent;color:var(--text);font:700 13px var(--sans);cursor:pointer}.lang:hover{border-color:var(--gold);color:var(--gold)}
@media (max-width:760px){.lang{min-width:34px;height:34px}}
.mbar{gap:10px}.mbar span{white-space:nowrap;font-size:12.5px}.mbar .btn{white-space:nowrap;padding:0 16px}
"""


def esc(s):
    return html.escape(str(s), quote=True)


def svc_html(key):
    name, opts = MENU[key]
    rows = "".join(
        f'<li><span>{esc(o) + " · " if o else ""}<span class="d">{esc(d)}</span></span><span class="p">€{p}</span></li>'
        for o, d, p in opts
    )
    return f'<article class="svc"><h3>{esc(name)}</h3><ul>{rows}</ul></article>'


def offers(keys):
    out = []
    for k in keys:
        name, opts = MENU[k]
        prices = [p for _, _, p in opts]
        out.append({"@type": "Offer", "name": name, "priceCurrency": "EUR",
                    "price": str(min(prices)) if len(prices) == 1 else None,
                    "priceSpecification": None if len(prices) == 1 else {
                        "@type": "PriceSpecification", "minPrice": min(prices), "maxPrice": max(prices), "priceCurrency": "EUR"}})
    return [{k: v for k, v in o.items() if v is not None} for o in out]


def page(path, title, desc, body, ld, extra_head="", mbar=True, bilingual=False):
    ld_tags = "\n".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in ld)
    doc = f"""<!doctype html>
<html lang="el">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{GA}
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{SITE}{path}">
<meta property="og:type" content="website"><meta property="og:locale" content="el_GR">
<meta property="og:url" content="{SITE}{path}"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}">
<meta property="og:image" content="{SITE}/logo512.png">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,300&family=Manrope:wght@400;500;700;800&display=swap">
<style>{CSS}</style>
{extra_head}
{ld_tags}
</head>
<body>
<a class="skip" href="#main">Μετάβαση στο περιεχόμενο</a>
<header class="top"><div class="wrap">
  <a class="logo" href="/"><b>Alexandros</b><span>Hair Salon · Θησείο</span></a>
  <nav aria-label="Κύριο μενού">
    <a class="hide-m" href="/services" data-en="Services &amp; prices">Υπηρεσίες &amp; τιμές</a>
    <a class="hide-m" href="/hours" data-en="Hours">Ωράριο</a>
    <a class="hide-m" href="/montela" style="color:var(--gold)" data-en="Be our model">Γίνε μοντέλο</a>
    <a class="hide-m" href="/douleia" style="color:var(--gold)">We are hiring</a>
    <span class="icons" role="group" aria-label="Επικοινωνία στο κινητό">
      <a class="mp" href="https://www.google.com/maps/place/alexandroshairsalon/@37.976933,23.7162736,17z/data=!3m1!4b1!4m6!3m5!1s0x14a1bd200f79f18d:0x3024d28633f32b4!8m2!3d37.976933!4d23.7162736!16s%2Fg%2F11cm0h21cx" target="_blank" rel="noopener" aria-label="Πού θα μας βρεις: άνοιγμα στο Google Maps" title="Google Maps">{ICONS['FaMapMarkerAlt']}</a>
      <a class="ph" href="tel:+306981319000" aria-label="Κλήση στο κινητό" title="Κλήση στο κινητό">{ICONS['FaPhoneAlt']}</a>
      <a class="wa" href="https://wa.me/306981319000" target="_blank" rel="noopener" aria-label="Μήνυμα στο WhatsApp" title="WhatsApp">{ICONS['FaWhatsapp']}</a>
      <a class="vb" href="viber://chat?number=%2B306981319000" aria-label="Μήνυμα στο Viber" title="Viber">{ICONS['FaViber']}</a>
    </span>
    <a class="btn gold" href="/kratisi/" data-en="Book now">Κλείσε ραντεβού</a>
    {'<button type="button" class="lang" data-lang-toggle aria-label="Switch to English">EN</button>' if bilingual else ''}
  </nav>
</div></header>
<main class="wrap" id="main" tabindex="-1">
{body}
</main>
<footer class="bottom"><div class="wrap">
  <p><strong>Alexandros Hair Salon</strong> · {ADDRESS} · <a href="tel:{PHONE}">{PHONE_TXT}</a> · <a href="tel:+306981319000">Κλήση κινητού</a> · <a href="https://wa.me/306981319000" target="_blank" rel="noopener">WhatsApp</a> · <a href="viber://chat?number=%2B306981319000">Viber</a> · <a href="{GOOGLE}" target="_blank" rel="noopener">Ωράριο &amp; οδηγίες στο Google</a></p>
  <p class="links"><a href="/">Αρχική</a><a href="/services">Όλες οι τιμές</a><a href="/kourema-athina/">Κούρεμα στην Αθήνα</a><a href="/vafi-mallion-athina/">Βαφή μαλλιών στην Αθήνα</a><a href="/balayage-athina/">Balayage στην Αθήνα</a><a href="/kratisi/">Κράτηση online</a><a href="/shop">Shop</a></p>
</div></footer>
{'<div class="mbar"><span>Θησείο · από το 1992</span><a class="btn gold" href="/kratisi/">Κλείσε ραντεβού</a></div>' if mbar else ''}
<button type="button" class="totop" aria-label="Επιστροφή στην κορυφή" title="Επιστροφή στην κορυφή" tabindex="-1">{ICONS['FaArrowUp']}</button>
<script>
(function(){{var b=document.querySelector('.totop');function f(){{var on=window.scrollY>600;b.classList.toggle('on',on);b.tabIndex=on?0:-1;}}
window.addEventListener('scroll',f,{{passive:true}});f();
b.addEventListener('click',function(){{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;window.scrollTo({{top:0,behavior:r?'auto':'smooth'}});document.getElementById('main').focus({{preventScroll:true}});}});}})();
</script>
{LANG_JS if bilingual else ''}
</body>
</html>
"""
    out = pathlib.Path("public") / path.strip("/") / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(doc, encoding="utf-8")
    print("wrote", out)


SALON_REF = {"@type": "HairSalon", "@id": f"{SITE}/#salon", "name": "Alexandros Hair Salon",
             "address": {"@type": "PostalAddress", "streetAddress": "Ερυσίχθονος 3-5", "addressLocality": "Αθήνα", "postalCode": "11851", "addressCountry": "GR"},
             "telephone": PHONE, "url": f"{SITE}/"}


def crumbs(name, path):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Αρχική", "item": f"{SITE}/"},
        {"@type": "ListItem", "position": 2, "name": name, "item": f"{SITE}{path}"}]}


def faq_block(faqs):
    items = "".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in faqs)
    ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]}
    return f'<section class="block"><h2>Συχνές ερωτήσεις</h2>{items}</section>', ld


def service_page(path, crumb, title, desc, eyebrow, h1, lead, facts, prose, keys, faqs, service_type, related):
    faq_html, faq_ld = faq_block(faqs)
    facts_html = "".join(f"<li>{esc(f)}</li>" for f in facts)
    rel = "".join(f'<a href="{h}">{esc(t)}</a>' for t, h in related)
    body = f"""
<section class="hero">
  <span class="eyebrow">{esc(eyebrow)}</span>
  <h1>{h1}</h1>
  <p class="lead">{esc(lead)}</p>
  <div class="cta"><a class="btn gold" href="/kratisi/">Δες ελεύθερες ώρες &amp; κλείσε</a><a class="btn ghost" href="tel:{PHONE}">Κάλεσε {PHONE_TXT}</a></div>
  <ul class="facts">{facts_html}</ul>
</section>
<section class="block"><h2>Τιμές &amp; χρόνοι</h2>{''.join(svc_html(k) for k in keys)}
  <p class="cta" style="margin-top:20px"><a class="btn gold" href="/kratisi/">Κλείσε online</a><a href="/services">Όλος ο τιμοκατάλογος →</a></p>
</section>
<section class="block prose">{prose}</section>
{faq_html}
<section class="block"><h2>Δες επίσης</h2><p class="links">{rel}</p></section>
"""
    service_ld = {"@context": "https://schema.org", "@type": "Service", "name": crumb, "serviceType": service_type,
                  "areaServed": {"@type": "City", "name": "Αθήνα"}, "provider": SALON_REF, "url": f"{SITE}{path}",
                  "offers": offers(keys)}
    page(path, title, desc, body, [service_ld, faq_ld, crumbs(crumb, path)])


COMMON_FACTS = ["Θησείο, ~5′ με τα πόδια από τον σταθμό", "Πληρώνεις στο κομμωτήριο", "Online κράτηση 24/7"]

# ---------- /kourema-athina/ ----------
service_page(
    "/kourema-athina/", "Κούρεμα στην Αθήνα",
    "Κούρεμα στην Αθήνα – Θησείο | Γυναικείο από €28 | Alexandros Hair Salon",
    "Γυναικείο κούρεμα από €28, ανδρικό €24, παιδικό €20 στο Θησείο, κέντρο Αθήνας. Pixie, mullet, butterfly, curtain bangs, bob, φιλάρισμα. Κομμωτήριο από το 1992. Κλείσε online.",
    "Κούρεμα · Θησείο, κέντρο Αθήνας",
    "Κούρεμα στην Αθήνα, <em>με τρεις δεκαετίες εμπειρίας.</em>",
    "Το κούρεμα είναι σχήμα πάνω στο πρόσωπο: μπορεί να το αναδείξει ή να το κρύψει. Κάθε πρόσωπο έχει όμορφα χαρακτηριστικά· τα βρίσκουμε και σχεδιάζουμε το κούρεμα που τα αναδεικνύει, μαζί με το σωστό styling. Γυναικείο, ανδρικό και παιδικό κούρεμα στο Θησείο, από το 1992.",
    ["Γυναικείο από €28"] + COMMON_FACTS,
    """<h2>Πώς δουλεύουμε το κούρεμα</h2>
<p>Ξεκινάμε με λίγη κουβέντα: τι σε ενοχλεί σήμερα, πώς χτενίζεσαι στο σπίτι και πόσο συχνά θέλεις να έρχεσαι. Μετά προτείνουμε γραμμή και μήκος που θα στέκονται σωστά και όταν τα φορμάρεις μόνη σου.</p>
<p>Κάνουμε κλασικά και σύγχρονα κουρέματα: pixie, mullet, bob και lob, butterfly, curtain bangs, φιλάρισμα για όγκο ή ελάφρυνση, καθαρό φρεσκάρισμα άκρων. Η τιμή του γυναικείου κουρέματος εξαρτάται από το μήκος και την πυκνότητα, ώστε να πληρώνεις για τον χρόνο που πραγματικά χρειάζεται.</p>
<p>Θέλεις να φύγεις έτοιμη; Διάλεξε το πακέτο <strong>Κούρεμα &amp; Blowout</strong>, που είναι φθηνότερο από τις δύο υπηρεσίες χωριστά.</p>""",
    ["women_cut", "cut_blowout", "men_cut", "kids_cut"],
    [("Πόσο κοστίζει ένα γυναικείο κούρεμα;", "Από €28 για μαλλιά έως τους ώμους, €31 κάτω από τους ώμους ή για πυκνά μαλλιά έως τους ώμους και €38 για μακριά και πυκνά μαλλιά ή extensions."),
     ("Κάνετε και ανδρικά ή παιδικά κουρέματα;", "Ναι. Ανδρικό κούρεμα €24 και παιδικό €20."),
     ("Πρέπει να κλείσω ραντεβού;", "Προτείνουμε ραντεβού για να σε περιμένουμε στην ώρα σου. Κλείνεις online στο alexandroshairsalon.gr/kratisi ή τηλεφωνικά στο 210 346 5554."),
     ("Πού βρίσκεστε;", "Ερυσίχθονος 3-5 στο Θησείο, περίπου 5 λεπτά με τα πόδια από τον σταθμό Θησείο, στο κέντρο της Αθήνας."),
     ("Πώς πληρώνω;", "Όπως προτιμάς: online κατά την κράτηση ή στο κομμωτήριο, μετά την υπηρεσία.")],
    "Κούρεμα μαλλιών",
    [("Βαφή μαλλιών στην Αθήνα", "/vafi-mallion-athina/"), ("Balayage στην Αθήνα", "/balayage-athina/"), ("Όλες οι τιμές", "/services")],
)

# ---------- /vafi-mallion-athina/ ----------
service_page(
    "/vafi-mallion-athina/", "Βαφή μαλλιών στην Αθήνα",
    "Βαφή Μαλλιών Αθήνα – Θησείο | Κάλυψη λευκών από €35 | L’Oréal & Redken",
    "Βαφή ρίζας και κάλυψη λευκών από €35 με L’Oréal Professionnel (Majirel, INOA χωρίς αμμωνία) και Redken, ρεφλέ/gloss από €31. Κομμωτήριο στο Θησείο, Αθήνα. Κλείσε online.",
    "Χρώμα · L’Oréal Professionnel & Redken",
    "Βαφή μαλλιών στην Αθήνα, <em>με L’Oréal &amp; Redken.</em>",
    "Κάλυψη λευκών στη ρίζα, βαφή χωρίς αμμωνία, ρεφλέ για λάμψη και τόνο. Διαλέγεις τη βαφή που σου ταιριάζει και βλέπεις από πριν την τιμή και τον χρόνο.",
    ["Βαφή ρίζας από €35", "Δωρεάν τεστ ευαισθησίας"] + COMMON_FACTS[:2],
    """<h2>Ποια βαφή να διαλέξω;</h2>
<p><strong>Majirel (L’Oréal Professionnel)</strong>: η κλασική μόνιμη βαφή για σίγουρη κάλυψη λευκών. <strong>INOA ή Redken χωρίς αμμωνία</strong>: πιο ήπια επιλογή για ευαίσθητο τριχωτό ή όσες προτιμούν βαφή χωρίς αμμωνία. <strong>Redken Express</strong>: γρήγορος χρόνος δράσης για όσες βιάζονται. <strong>Farcom</strong>: η πιο οικονομική επιλογή για τακτική ρίζα.</p>
<p>Αν έχουν περάσει πάνω από 6 εβδομάδες, διάλεξε τη <strong>μεγάλη ρίζα</strong>. Για πολύ πυκνά ή πολύ μακριά μαλλιά υπάρχει η προσθήκη +€19 για την επιπλέον ποσότητα και τον χρόνο.</p>
<h2>Ρίζα + ρεφλέ</h2>
<p>Με το <strong>ρεφλέ (gloss)</strong> στα μήκη το χρώμα δένει από τη ρίζα ως τις άκρες και τα μαλλιά αποκτούν λάμψη. Είναι ξεχωριστή εφαρμογή στα μήκη, όχι απλό τράβηγμα της βαφής της ρίζας. Αν θέλεις μεγάλη αλλαγή ή διόρθωση προηγούμενου χρώματος, ξεκινάμε με διάγνωση ώστε να ξέρεις πλάνο και τιμή πριν από οτιδήποτε.</p>""",
    ["root", "extra", "root_gloss", "gloss", "root_blowout", "colour_cut", "correction"],
    [("Πόσο κοστίζει η βαφή ρίζας;", "Από €35 (Farcom) έως €55 (μεγάλη ρίζα χωρίς αμμωνία), ανάλογα με τη βαφή και το πόσο έχει μεγαλώσει η ρίζα."),
     ("Έχετε βαφή χωρίς αμμωνία;", "Ναι, INOA της L’Oréal Professionnel ή Redken χωρίς αμμωνία, από €44."),
     ("Κάνετε τεστ ευαισθησίας;", "Ναι, δωρεάν πριν από την πρώτη σου βαφή."),
     ("Πόση ώρα διαρκεί η βαφή ρίζας;", "Περίπου 40–50 λεπτά. Με ρεφλέ στα μήκη περίπου μία ώρα."),
     ("Πώς κλείνω ραντεβού για βαφή;", "Online στο alexandroshairsalon.gr/kratisi, όπου βλέπεις ελεύθερες ώρες, ή στο 210 346 5554. Πληρώνεις στο κομμωτήριο.")],
    "Βαφή μαλλιών",
    [("Balayage στην Αθήνα", "/balayage-athina/"), ("Κούρεμα στην Αθήνα", "/kourema-athina/"), ("Όλες οι τιμές", "/services")],
)

# ---------- /balayage-athina/ ----------
service_page(
    "/balayage-athina/", "Balayage στην Αθήνα",
    "Balayage Αθήνα – Θησείο | Ανταύγειες από €46 | Alexandros Hair Salon",
    "Balayage και ανταύγειες στο Θησείο, κέντρο Αθήνας: face framing €46, μερικές από €55, ολόκληρες από €76, no-bleach από €51. Φυσικό αποτέλεσμα με L’Oréal & Redken. Κλείσε online.",
    "Ανταύγειες & Balayage · Θησείο",
    "Balayage στην Αθήνα, <em>φυσικό και φωτεινό.</em>",
    "Ανταύγειες και balayage για απαλό, φυσικό φως που μεγαλώνει όμορφα. Από διακριτικό face framing έως ολόκληρο balayage, με τιμή ανάλογα με το μήκος.",
    ["Face framing €46", "No-bleach επιλογή"] + COMMON_FACTS[:2],
    """<h2>Ποιο να διαλέξω;</h2>
<p><strong>Face framing</strong>: φως γύρω από το πρόσωπο, ιδανικό για πρώτη φορά ή για φρεσκάρισμα ανάμεσα σε ραντεβού. <strong>Μερικές ανταύγειες ή balayage</strong>: φως στο πάνω μέρος και στα σημεία που φαίνονται. <strong>Ολόκληρες</strong>: φωτεινότητα σε όλο το κεφάλι. <strong>No-bleach</strong>: απαλό αποτέλεσμα χωρίς ντεκαπάζ, με μετρημένο αριθμό τούφων.</p>
<p>Στόχος μας είναι ένα φυσικό αποτέλεσμα που δεν θέλει συχνή συντήρηση. Δουλεύουμε με προϊόντα L’Oréal Professionnel και Redken και εκπαιδευόμαστε συνεχώς στις νέες τεχνικές τους.</p>
<p>Για πολύ έντονη αλλαγή, πλατινέ ή διόρθωση παλιού χρώματος κλείσε πρώτα <strong>διάγνωση χρώματος</strong>, ώστε να συμφωνήσουμε ρεαλιστικό πλάνο και ακριβή τιμή πριν ξεκινήσουμε.</p>""",
    ["face_frame", "partial", "full", "nobleach", "balayage_pack", "correction"],
    [("Πόσο κοστίζει το balayage στην Αθήνα;", "Στο κομμωτήριό μας: μερικό balayage από €55 (κοντά) έως €104 (κάτω από τους ώμους) και ολόκληρο από €76 έως €126. Face framing €46."),
     ("Πόση ώρα διαρκεί;", "Από 1 ώρα 15′ για face framing έως περίπου 2 ώρες 45′ για ολόκληρο balayage σε μακριά μαλλιά."),
     ("Υπάρχει επιλογή χωρίς ντεκαπάζ;", "Ναι, οι no-bleach ανταύγειες, από €51, για πιο απαλό φως χωρίς ντεκαπάζ."),
     ("Περιλαμβάνει κούρεμα και χτένισμα;", "Για κούρεμα και Blowout στο ίδιο ραντεβού διάλεξε το πακέτο Balayage, κούρεμα & Blowout, από €100."),
     ("Πώς κλείνω ραντεβού;", "Online στο alexandroshairsalon.gr/kratisi ή στο 210 346 5554. Αν δεν είσαι σίγουρη τι χρειάζεσαι, κλείσε διάγνωση χρώματος.")],
    "Balayage και ανταύγειες",
    [("Βαφή μαλλιών στην Αθήνα", "/vafi-mallion-athina/"), ("Κούρεμα στην Αθήνα", "/kourema-athina/"), ("Όλες οι τιμές", "/services")],
)

# ---------- /kratisi/ : official Treatwell Connect widget (no marketplace commission) ----------
kratisi_head = f"""<script src="{TW_JS}"></script>
<link rel="stylesheet" href="{TW_CSS}" media="screen">
<style>
#wahanda-online-booking-widget-iframe{{min-height:720px;background:#fff;border-radius:16px;overflow:hidden}}
#wahanda-online-booking-widget-iframe iframe{{display:block;width:100%!important;min-height:720px;border:0}}
.tw-fallback{{font-size:14px;color:var(--muted);margin-top:12px}}
/* Treatwell button: keep the site's gold style instead of Treatwell's green */
a#wahanda-online-booking-widget.btn{{display:inline-flex!important;align-items:center!important;justify-content:center!important;background:var(--gold)!important;color:var(--ink)!important;border:1px solid var(--gold)!important;border-radius:999px!important;font:800 16px/1 var(--sans)!important;text-transform:none!important;letter-spacing:0!important;padding:0 24px!important;height:auto!important;min-height:48px!important;width:auto!important;box-shadow:none!important;background-image:none!important}}
a#wahanda-online-booking-widget.btn span{{background:none!important;padding:0!important;font:inherit!important;color:inherit!important;text-transform:none!important;line-height:1.2!important;height:auto!important}}
a#wahanda-online-booking-widget.btn:hover{{filter:brightness(1.08)}}
</style>"""
kratisi_body = f"""
<section class="hero" style="padding-bottom:20px">
  <span class="eyebrow" data-en="Book online">Online κράτηση</span>
  <h1 data-en="Book in <em>one minute.</em>">Κλείσε ραντεβού <em>σε ένα λεπτό.</em></h1>
  <p class="lead" data-en="Choose a service and time below. You see the price and duration and pay online or at the salon.">Διάλεξε υπηρεσία και ώρα παρακάτω. Βλέπεις τιμή και διάρκεια και πληρώνεις online ή στο κομμωτήριο.</p>
  <div class="cta">
    <a class="btn gold" href="{WIDGET}" id="wahanda-online-booking-widget" onclick='wahanda.openOnlineBookingWidget("{WIDGET}"); return false;' target="_blank"><span data-en="Open full screen">Άνοιγμα σε πλήρη οθόνη</span></a>
    <a class="btn ghost" href="tel:{PHONE}" data-en="Call {PHONE_TXT}">Κάλεσε {PHONE_TXT}</a>
  </div>
</section>
<section style="padding-bottom:24px">
  <div id="wahanda-online-booking-widget-iframe" data-widget-url="{WIDGET}"></div>
  <p class="tw-fallback" data-en='Calendar not showing? <a href="{WIDGET}" target="_blank" rel="noopener">Open the booking here</a> or call <a href="tel:{PHONE}">{PHONE_TXT}</a>.'>Δεν εμφανίζεται το ημερολόγιο; <a href="{WIDGET}" target="_blank" rel="noopener">Άνοιξε την κράτηση εδώ</a> ή κάλεσε στο <a href="tel:{PHONE}">{PHONE_TXT}</a>.</p>
</section>
<section class="block prose">
  <h2 data-en="Good to know">Καλό να ξέρεις</h2>
  <p data-en="Prices and times are approximate. Long or thick hair often needs a little more product and time; for colour on very thick or very long hair there is a +€19 add-on. Free sensitivity test before your first colour. Wearing extensions? Mention it when you book so we reserve the right time.">Οι τιμές και οι χρόνοι είναι κατά προσέγγιση. Τα μακριά ή πυκνά μαλλιά θέλουν συχνά λίγο παραπάνω προϊόν και χρόνο· στη βαφή για πολύ πυκνά ή πολύ μακριά μαλλιά υπάρχει η προσθήκη +€19. Δωρεάν τεστ ευαισθησίας πριν από την πρώτη σου βαφή. Έχεις extensions; Γράψ’ το στην κράτηση για να κρατήσουμε τον σωστό χρόνο.</p>
  <p><a href="/services" data-en="Full price list with descriptions →">Όλος ο τιμοκατάλογος με περιγραφές →</a></p>
</section>
"""
kratisi_ld = [{"@context": "https://schema.org", **{k: v for k, v in SALON_REF.items() if k != "@type"}, "@type": "HairSalon",
               "potentialAction": {"@type": "ReserveAction", "target": f"{SITE}/kratisi/"}}]
page("/kratisi/", "Κράτηση ραντεβού online | Alexandros Hair Salon – Κομμωτήριο Θησείο",
     "Κλείσε online ραντεβού στο Alexandros Hair Salon στο Θησείο, Αθήνα: κούρεμα, Blowout, βαφή, balayage, κερατίνη. Βλέπεις ελεύθερες ώρες, τιμή και διάρκεια. Πληρωμή online ή στο κομμωτήριο.",
     kratisi_body, kratisi_ld, extra_head=kratisi_head, mbar=False, bilingual=True)
