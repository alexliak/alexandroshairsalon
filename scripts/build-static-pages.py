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
# Google Maps «Maps URLs» (api=1): στο κινητό ανοίγει κατευθείαν η εφαρμογή. Ίδια με src/components/NhLayout.js
PLACE_ID = "ChIJjfF5DyC9oRQRtDI_YyhNAgM"
_PLACE_Q = "Alexandros%20Hair%20Salon%2C%20%CE%95%CF%81%CF%85%CF%83%CE%AF%CF%87%CE%B8%CE%BF%CE%BD%CE%BF%CF%82%203-5%2C%20%CE%91%CE%B8%CE%AE%CE%BD%CE%B1%20118%2051"
GOOGLE = f"https://www.google.com/maps/search/?api=1&query={_PLACE_Q}&query_place_id={PLACE_ID}"
DIRECTIONS = f"https://www.google.com/maps/dir/?api=1&destination={_PLACE_Q}&destination_place_id={PLACE_ID}"

# Λευκό θέμα την ημέρα, σκούρο τη νύχτα: το ίδιο script με το υπόλοιπο site (src/lib/themeBoot.js)
import re as _re
THEME_BOOT = _re.search(r"THEME_BOOT = `(.*?)`;", (pathlib.Path(__file__).parent.parent / "src/lib/themeBoot.js").read_text(encoding="utf-8"), _re.S).group(1).replace("\\\\", "\\")  # \\b στο JS template -> \b
# Στο κινητό οι σύνδεσμοι χάρτη ανοίγουν στην ίδια καρτέλα, ώστε να πάνε κατευθείαν στην εφαρμογή Google Maps
MAPS_JS = """<script>(function(){var bs=[].slice.call(document.querySelectorAll('.tsw button'));function s(){var m=window.ahsTheme?ahsTheme.mode():'auto';bs.forEach(function(b){var on=b.getAttribute('data-mode')===m;b.classList.toggle('on',on);b.setAttribute('aria-checked',on);});}bs.forEach(function(b){b.addEventListener('click',function(){if(window.ahsTheme)ahsTheme.set(b.getAttribute('data-mode'));});});window.addEventListener('ahs-theme',s);s();})();</script>
<script>document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[data-maps]');if(!a||!window.matchMedia)return;if(matchMedia('(hover: none) and (pointer: coarse)').matches){e.preventDefault();location.href=a.href;}else if(a.href.indexOf('/maps/dir/')>-1){e.preventDefault();window.open('"""+GOOGLE+"""','_blank','noopener');}});</script>"""
ADDRESS = "Ερυσίχθονος 3-5, Θησείο, Αθήνα 118 51"

# Τιμές από το src/data/menu.json (ίδιο με τον τιμοκατάλογο, το /services και την Treatwell). Κλειδί = ελληνικό όνομα υπηρεσίας.
_MENU_JSON = json.loads((pathlib.Path(__file__).parent.parent / "src/data/menu.json").read_text(encoding="utf-8"))
MENU = {s["name"]["el"]: (s["name"]["el"], [(o["el"], o["time"]["el"], o["price"]) for o in s["options"]])
        for c in _MENU_JSON for s in c["services"]}
DESC = {s["name"]["el"]: s.get("desc", {}).get("el", "") for c in _MENU_JSON for s in c["services"]}


def P(name):
    """Μία τιμή, ή η χαμηλότερη αν η υπηρεσία έχει επιλογές."""
    return min(p for _, _, p in MENU[name][1])


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
  var cur=document.documentElement.lang==='en'?'en':'el';try{cur=localStorage.getItem(KEY)||cur;}catch(e){}
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
.svc .sd{margin:6px 0 0;color:var(--soft);font-size:14.5px;line-height:1.5}
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
@media (hover:none) and (pointer:coarse) and (min-width:761px) and (max-width:1180px){.mbar{display:flex;position:fixed;left:12px;right:12px;max-width:560px;margin:0 auto;bottom:14px;z-index:20;align-items:center;justify-content:space-between;padding:8px 8px 8px 18px;border-radius:999px;background:var(--panel);border:1px solid #3a342c;box-shadow:0 10px 30px rgba(0,0,0,.5)} .mbar span{font-size:14px;font-weight:700} body{padding-bottom:96px}}
@media (prefers-reduced-motion:reduce){.totop{transition:none}}
.lang{flex:none;min-width:40px;height:40px;border-radius:999px;border:1px solid #5a5247;background:transparent;color:var(--text);font:700 13px var(--sans);cursor:pointer}.lang:hover{border-color:var(--gold);color:var(--gold)}
@media (max-width:760px){.lang{min-width:34px;height:34px}}
.mbar{gap:10px}.mbar span{white-space:nowrap;font-size:12.5px}.mbar .btn{white-space:nowrap;padding:0 16px}
.tsw{display:flex;flex-wrap:wrap;align-items:center;gap:6px}.tsw span{margin-right:6px;font-size:13px}
.tsw button{min-height:36px;padding:0 14px;border-radius:999px;border:1px solid #5a5247;background:transparent;color:var(--soft);font:500 13px var(--sans);cursor:pointer}
.tsw button:hover{border-color:var(--gold);color:var(--gold)}.tsw button.on{border-color:var(--gold);color:var(--text);font-weight:700}
html[data-theme=light] .tsw button{border-color:#c4b6a0}

/* Λευκό θέμα ημέρας (data-theme="light" από το THEME_BOOT) */
html[data-theme=light]{color-scheme:light;--bg:#eee8de;--panel:#f6f2eb;--line:#ddd4c6;--text:#2b2620;--muted:#665d4f;--soft:#4f473c;--gold:#80632b;--ink:#17140f;--fill:#c9a96e}
html[data-theme=light] body{background:radial-gradient(110% 55% at 80% -8%,rgba(201,169,110,.12),transparent 62%) var(--bg)}
html[data-theme=light] header.top{background:rgba(238,232,222,.92)}
html[data-theme=light] .btn.gold{background:var(--fill);border-color:var(--fill);color:var(--ink);box-shadow:0 6px 18px rgba(138,106,46,.22)}
html[data-theme=light] .btn.ghost,html[data-theme=light] .icons a,html[data-theme=light] .lang{border-color:#c4b6a0}
html[data-theme=light] .svc{box-shadow:0 1px 2px rgba(70,52,20,.05),0 10px 30px rgba(70,52,20,.06)}
html[data-theme=light] .mbar{background:rgba(246,242,235,.96);border-color:var(--line);box-shadow:0 10px 30px rgba(70,52,20,.16)}
html[data-theme=light] .totop{background:rgba(246,242,235,.94)}
html[data-theme=light] a#wahanda-online-booking-widget.btn{background:var(--fill)!important;border-color:var(--fill)!important;color:var(--ink)!important}
html[data-theme=light] .skip,html[data-theme=light] .totop:hover,html[data-theme=light] .icons a.ph:hover,html[data-theme=light] .icons a.ft:hover{color:#fff}
"""


def esc(s):
    return html.escape(str(s), quote=True)


def svc_html(key):
    name, opts = MENU[key]
    rows = "".join(
        f'<li><span>{esc(o) + " · " if o else ""}<span class="d">{esc(d)}</span></span><span class="p">€{p}</span></li>'
        for o, d, p in opts
    )
    d = f'<p class="sd">{esc(DESC[key])}</p>' if DESC.get(key) else ""
    return f'<article class="svc"><h3>{esc(name)}</h3>{d}<ul>{rows}</ul></article>'


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


def page(path, title, desc, body, ld, extra_head="", mbar=True, bilingual=False, lang="el", image=None):
    ld_tags = "\n".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in ld)
    doc = f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#12100e">
<script>{THEME_BOOT}</script>
{GA}
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{SITE}{path}">
<meta property="og:type" content="website"><meta property="og:locale" content="{"en_US" if lang == "en" else "el_GR"}">
<meta property="og:url" content="{SITE}{path}"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}">
<meta property="og:image" content="{image or (SITE + "/logo512.png")}">
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
      <a class="mp" href="{DIRECTIONS}" data-maps target="_blank" rel="noopener" aria-label="Πού θα μας βρεις: άνοιγμα στο Google Maps" title="Google Maps">{ICONS['FaMapMarkerAlt']}</a>
      <a class="ph" href="tel:{PHONE}" aria-label="Κλήση στο κομμωτήριο {PHONE_TXT}" title="Κλήση στο κομμωτήριο {PHONE_TXT}">{ICONS['FaPhoneAlt']}</a>
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
  <p><strong>Alexandros Hair Salon</strong> · {ADDRESS} · <a href="tel:{PHONE}">{PHONE_TXT}</a> · <a href="tel:+306981319000">Κλήση κινητού</a> · <a href="https://wa.me/306981319000" target="_blank" rel="noopener">WhatsApp</a> · <a href="viber://chat?number=%2B306981319000">Viber</a> · <a href="{GOOGLE}" data-maps target="_blank" rel="noopener">Ωράριο στο Google</a> · <a href="{DIRECTIONS}" data-maps target="_blank" rel="noopener">Οδηγίες</a></p>
  <p class="tsw" role="radiogroup" aria-label="Εμφάνιση"><span>Εμφάνιση</span><button type="button" role="radio" data-mode="auto" title="Όπως η συσκευή σου">Αυτόματο</button><button type="button" role="radio" data-mode="light">Ανοιχτό</button><button type="button" role="radio" data-mode="dark">Σκούρο</button></p>
  <p class="links"><a href="/">Αρχική</a><a href="/services">Όλες οι τιμές</a><a href="/kourema-athina/">Κούρεμα στην Αθήνα</a><a href="/vafi-mallion-athina/">Βαφή μαλλιών στην Αθήνα</a><a href="/balayage-athina/">Balayage στην Αθήνα</a><a href="/dorean-kourema-athina/">Δωρεάν κούρεμα (μοντέλο)</a><a href="/fotografies">Φωτογραφίες</a><a href="/kratisi/">Κράτηση online</a><a href="/hair-salon-athens/" hreflang="en">Hair salon in Athens (English)</a><a href="/shop">Shop</a></p>
</div></footer>
{'<div class="mbar"><span data-en="Thiseio · since 1992">Θησείο · από το 1992</span><a class="btn gold" href="/kratisi/" data-en="Book now">Κλείσε ραντεβού</a></div>' if mbar else ''}
<button type="button" class="totop" aria-label="Επιστροφή στην κορυφή" title="Επιστροφή στην κορυφή" tabindex="-1">{ICONS['FaArrowUp']}</button>
<script>
(function(){{var b=document.querySelector('.totop');function f(){{var on=window.scrollY>600;b.classList.toggle('on',on);b.tabIndex=on?0:-1;}}
window.addEventListener('scroll',f,{{passive:true}});f();
b.addEventListener('click',function(){{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;window.scrollTo({{top:0,behavior:r?'auto':'smooth'}});document.getElementById('main').focus({{preventScroll:true}});}});}})();
</script>
{LANG_JS if bilingual else ''}
{MAPS_JS}
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


# Ώρες που άλλα κομμωτήρια είναι κλειστά: χωρίς ωράριο στο site, το ωράριο είναι μόνο στο Google Business Profile
FAQ_WHEN = ("Μπορώ να κλείσω Δευτέρα ή αργά το απόγευμα;",
            "Συνήθως ναι. Δουλεύουμε και Δευτέρα, και τα απογεύματα της Τετάρτης και του Σαββάτου ως αργά, όταν πολλά κομμωτήρια στην Αθήνα είναι κλειστά ή κλείνουν νωρίς. Τις ελεύθερες ώρες τις βλέπεις ζωντανά στην online κράτηση· το ισχύον ωράριο είναι πάντα στο Google.")
COMMON_FACTS = ["Θησείο, ~5′ με τα πόδια από τον σταθμό", "Πληρωμή online ή στο κομμωτήριο", "Online κράτηση 24/7"]

# ---------- /kourema-athina/ ----------
CUTS = ["Κούρεμα χωρίς στέγνωμα", "Κούρεμα & γρήγορο στέγνωμα", "Κούρεμα & γρήγορο φορμάρισμα", "Κούρεμα & χτένισμα"]
service_page(
    "/kourema-athina/", "Κούρεμα στην Αθήνα",
    f"Κούρεμα Αθήνα – Θησείο | Γυναικείο από €{P(CUTS[0])} | Alexandros Hair Salon",
    f"Γυναικείο κούρεμα από €{P(CUTS[0])}, ανδρικό €{P('Ανδρικό κούρεμα')}, παιδικό €{P('Παιδικό κούρεμα')} στο Θησείο, Αθήνα. Pixie, bob, butterfly, curtain bangs. Από το 1992. Κλείσε online.",
    "Κούρεμα · Θησείο, κέντρο Αθήνας",
    "Κούρεμα στην Αθήνα, <em>με τρεις δεκαετίες εμπειρίας.</em>",
    "Το κούρεμα είναι σχήμα πάνω στο πρόσωπο: μπορεί να το αναδείξει ή να το κρύψει. Κάθε πρόσωπο έχει όμορφα χαρακτηριστικά· τα βρίσκουμε και σχεδιάζουμε το κούρεμα που τα αναδεικνύει, μαζί με το σωστό styling. Γυναικείο, ανδρικό και παιδικό κούρεμα στο Θησείο, από το 1992.",
    [f"Γυναικείο από €{P(CUTS[0])}"] + COMMON_FACTS,
    """<h2>Πώς δουλεύουμε το κούρεμα</h2>
<p>Ξεκινάμε με λίγη κουβέντα: τι σε ενοχλεί σήμερα, πώς χτενίζεσαι στο σπίτι και πόσο συχνά θέλεις να έρχεσαι. Μετά προτείνουμε γραμμή και μήκος που θα στέκονται σωστά και όταν τα φορμάρεις μόνη σου.</p>
<p>Κάνουμε κλασικά και σύγχρονα κουρέματα: pixie, mullet, bob και lob, butterfly, curtain bangs, φιλάρισμα για όγκο ή ελάφρυνση, καθαρό φρεσκάρισμα άκρων.</p>
<h2>Πώς θέλεις να φύγεις;</h2>
<p>Μία τιμή για κάθε μήκος· διαλέγεις μόνο το τέλος. <strong>Χωρίς στέγνωμα</strong>, ιδανικό για σγουρά. <strong>Γρήγορο στέγνωμα</strong>: προϊόν για τη φυσική υφή σου, πιστολάκι ή φυσούνα και δάχτυλα. <strong>Γρήγορο φορμάρισμα</strong>: βούρτσα για όγκο και φόρμα. <strong>Χτένισμα</strong>: θερμοπροστασία, βούρτσα τούφα-τούφα, γυάλισμα και φινίρισμα, που κρατά συνήθως 3 ημέρες ή και περισσότερο.</p>""",
    CUTS + ["Φράτζα", "Ανδρικό κούρεμα", "Ανδρικό με μηχανή", "Παιδικό κούρεμα"],
    [("Πόσο κοστίζει ένα γυναικείο κούρεμα;", f"€{P(CUTS[0])} χωρίς στέγνωμα, €{P(CUTS[1])} με γρήγορο στέγνωμα, €{P(CUTS[2])} με γρήγορο φορμάρισμα και €{P(CUTS[3])} με πλήρες χτένισμα. Ίδια τιμή για όλα τα μήκη."),
     ("Κάνετε και ανδρικά ή παιδικά κουρέματα;", f"Ναι. Ανδρικό κούρεμα €{P('Ανδρικό κούρεμα')}, με μηχανή €{P('Ανδρικό με μηχανή')} και παιδικό (έως 12 ετών) €{P('Παιδικό κούρεμα')}."),
     FAQ_WHEN,
     ("Πρέπει να κλείσω ραντεβού;", "Προτείνουμε ραντεβού για να σε περιμένουμε στην ώρα σου. Κλείνεις online στο alexandroshairsalon.gr/kratisi ή τηλεφωνικά στο 210 346 5554."),
     ("Πού βρίσκεστε;", "Ερυσίχθονος 3-5 στο Θησείο, περίπου 5 λεπτά με τα πόδια από τον σταθμό Θησείο, στο κέντρο της Αθήνας."),
     ("Πώς πληρώνω;", "Όπως προτιμάς: online κατά την κράτηση ή στο κομμωτήριο, μετά την υπηρεσία.")],
    "Κούρεμα μαλλιών",
    [("Βαφή μαλλιών στην Αθήνα", "/vafi-mallion-athina/"), ("Balayage στην Αθήνα", "/balayage-athina/"), ("Όλες οι τιμές", "/services")],
)

# ---------- /vafi-mallion-athina/ ----------
ROOT = "Βαφή ρίζας"
ROOT_OPTS = dict((o, p) for o, _, p in MENU[ROOT][1])
service_page(
    "/vafi-mallion-athina/", "Βαφή μαλλιών στην Αθήνα",
    f"Βαφή Μαλλιών Αθήνα – Θησείο | Ρίζα από €{P(ROOT)} | Alexandros Hair Salon",
    f"Βαφή ρίζας & κάλυψη λευκών από €{P(ROOT)}, χωρίς αμμωνία €{ROOT_OPTS['Ανώτερη']} (INOA, Redken). Ρίζα & ρεφλέ από €{P('Βαφή ρίζας & ρεφλέ στα μήκη')}. Κομμωτήριο στο Θησείο, Αθήνα. Κλείσε online.",
    "Χρώμα · L’Oréal Professionnel & Redken",
    "Βαφή μαλλιών στην Αθήνα, <em>με L’Oréal &amp; Redken.</em>",
    "Κάλυψη λευκών στη ρίζα, βαφή χωρίς αμμωνία, ρεφλέ για λάμψη και τόνο. Μία τιμή για κάθε υπηρεσία, με συγκεκριμένη ποσότητα χρώματος, ώστε να ξέρεις από πριν τι πληρώνεις.",
    [f"Βαφή ρίζας από €{P(ROOT)}", "Τεστ ευαισθησίας 48 ώρες πριν"] + COMMON_FACTS[:2],
    f"""<h2>Κλασική ή Ανώτερη;</h2>
<p><strong>Κλασική (€{ROOT_OPTS['Κλασική']})</strong>: μόνιμη βαφή Farcom για σίγουρη κάλυψη λευκών. <strong>Ανώτερη (€{ROOT_OPTS['Ανώτερη']})</strong>: Majirel της L’Oréal Professionnel, INOA χωρίς αμμωνία ή Redken χωρίς αμμωνία· η τιμή καλύπτει όποια σου ταιριάζει. Και οι δύο περιλαμβάνουν λούσιμο και γρήγορο στέγνωμα.</p>
<p>Η βαφή ρίζας καλύπτει ρίζα έως 6 εβδομάδες και έως 45 g χρώμα. Αν χρειαστεί περισσότερο, το «+ Επιπλέον χρώμα ανά 30 g» (€{P('+ Επιπλέον χρώμα')}) το συμφωνούμε πριν την εφαρμογή.</p>
<h2>Ρίζα + ρεφλέ</h2>
<p>Με το <strong>ρεφλέ (gloss)</strong> στα μήκη το χρώμα δένει από τη ρίζα ως τις άκρες και τα μαλλιά αποκτούν λάμψη. Είναι ξεχωριστή εφαρμογή στα μήκη, έως 60 ml για μαλλιά έως τους ώμους ή 90 ml κάτω από τους ώμους, όχι απλό τράβηγμα της βαφής της ρίζας. Για μεγάλη αλλαγή ή διόρθωση προηγούμενου χρώματος ξεκινάμε με διάγνωση, ώστε να ξέρεις πλάνο και τιμή πριν από οτιδήποτε.</p>""",
    [ROOT, "Βαφή ρίζας & ρεφλέ στα μήκη", "Ρεφλέ", "Βαφή σε όλο το μαλλί", "Ξάνοιγμα ρίζας & ρεφλέ", "+ Επιπλέον χρώμα", "Διόρθωση χρώματος"],
    [("Πόσο κοστίζει η βαφή ρίζας;", f"€{ROOT_OPTS['Κλασική']} η Κλασική και €{ROOT_OPTS['Ανώτερη']} η Ανώτερη (Majirel, INOA ή Redken χωρίς αμμωνία), για ρίζα έως 6 εβδομάδες και έως 45 g χρώμα, με λούσιμο και γρήγορο στέγνωμα."),
     ("Έχετε βαφή χωρίς αμμωνία;", f"Ναι, στην Ανώτερη βαφή ρίζας: INOA της L’Oréal Professionnel ή Redken χωρίς αμμωνία, €{ROOT_OPTS['Ανώτερη']}."),
     ("Κάνετε τεστ ευαισθησίας;", "Ναι, δωρεάν, 48 ώρες πριν από την πρώτη σου βαφή."),
     FAQ_WHEN,
     ("Πόση ώρα διαρκεί η βαφή ρίζας;", "Περίπου μία ώρα μαζί με την αναμονή. Με ρεφλέ στα μήκη από μία ώρα έως μία ώρα και δέκα λεπτά."),
     ("Πώς κλείνω ραντεβού για βαφή;", "Online στο alexandroshairsalon.gr/kratisi, όπου βλέπεις ελεύθερες ώρες, ή στο 210 346 5554. Πληρώνεις online ή στο κομμωτήριο.")],
    "Βαφή μαλλιών",
    [("Balayage στην Αθήνα", "/balayage-athina/"), ("Κούρεμα στην Αθήνα", "/kourema-athina/"), ("Όλες οι τιμές", "/services")],
)

# ---------- /balayage-athina/ ----------
FACE = dict((o, p) for o, _, p in MENU["Ανταύγειες γύρω από το πρόσωπο"][1])
service_page(
    "/balayage-athina/", "Balayage στην Αθήνα",
    f"Μπαλαγιάζ (Balayage) Αθήνα – Θησείο | από €{P('Ανταύγειες γύρω από το πρόσωπο')} | Alexandros Hair Salon",
    f"Μπαλαγιάζ (balayage) & ανταύγειες στο Θησείο, Αθήνα: πρόσωπο από €{P('Ανταύγειες γύρω από το πρόσωπο')}, μερικές €{P('Μερικές ανταύγειες')}, μπαλαγιάζ €{P('Μερικό μπαλαγιάζ')}. Και χωρίς ντεκαπάζ.",
    "Ανταύγειες & Balayage · Θησείο",
    "Balayage στην Αθήνα, <em>φυσικό και φωτεινό.</em>",
    "Ανταύγειες και μπαλαγιάζ (balayage) για απαλό, φυσικό φως που μεγαλώνει όμορφα. Από διακριτικό φως γύρω από το πρόσωπο έως μπαλαγιάζ, πάντα με ρεφλέ.",
    [f"Πρόσωπο από €{P('Ανταύγειες γύρω από το πρόσωπο')}", "Επιλογή χωρίς ντεκαπάζ"] + COMMON_FACTS[:2],
    f"""<h2>Ποιο να διαλέξω;</h2>
<p><strong>Γύρω από το πρόσωπο</strong>: λεπτές ανταύγειες που φωτίζουν το πρόσωπο, ιδανικές για πρώτη φορά. <strong>Μερικές</strong>: στο πάνω μέρος και γύρω από το πρόσωπο. <strong>Ολόκληρες</strong>: σε όλο το κεφάλι. <strong>Μερικό μπαλαγιάζ (balayage)</strong>: απαλό φως ζωγραφισμένο με το χέρι, για μεσαία και μακριά μαλλιά.</p>
<p><strong>Χωρίς ντεκαπάζ</strong>: με την κρέμα ξανοίγματος L’Oréal Professionnel Blond Studio No Bleach™, πιο ήπια για την τρίχα, έως 4 τόνους (σε βαμμένα μαλλιά έως 2,5). Γύρω από το πρόσωπο €{FACE['Χωρίς ντεκαπάζ']}, με ντεκαπάζ €{FACE['Με ντεκαπάζ']}.</p>
<p>Οι τιμές είναι για μαλλιά έως τους ώμους· για πιο μακριά υπάρχει το «+ Μακριά μαλλιά» (€{P('+ Μακριά μαλλιά (ανταύγειες / μπαλαγιάζ)')}). Για έντονη αλλαγή, πλατινέ ή διόρθωση παλιού χρώματος κλείσε πρώτα <strong>διάγνωση χρώματος</strong>, ώστε να συμφωνήσουμε ρεαλιστικό πλάνο και συγκεκριμένη τιμή.</p>""",
    ["Ανταύγειες γύρω από το πρόσωπο", "Μερικές ανταύγειες", "Ολόκληρες ανταύγειες", "Μερικό μπαλαγιάζ", "Ολόκληρο μπαλαγιάζ", "+ Μακριά μαλλιά (ανταύγειες / μπαλαγιάζ)", "+ Ενίσχυση τρίχας στο ξάνοιγμα", "Διόρθωση χρώματος"],
    [("Πόσο κοστίζει το μπαλαγιάζ (balayage) στην Αθήνα;", f"Στο κομμωτήριό μας το μερικό μπαλαγιάζ κοστίζει €{P('Μερικό μπαλαγιάζ')} για μαλλιά έως τους ώμους, με ρεφλέ. Για πιο μακριά μαλλιά προστίθεται το «+ Μακριά μαλλιά» (€{P('+ Μακριά μαλλιά (ανταύγειες / μπαλαγιάζ)')})."),
     ("Πόσο κοστίζουν οι ανταύγειες;", f"Γύρω από το πρόσωπο €{FACE['Χωρίς ντεκαπάζ']}–€{FACE['Με ντεκαπάζ']}, μερικές €{P('Μερικές ανταύγειες')} και ολόκληρες €{P('Ολόκληρες ανταύγειες')}, πάντα με ρεφλέ."),
     ("Υπάρχει επιλογή χωρίς ντεκαπάζ;", "Ναι, με την κρέμα L’Oréal Professionnel Blond Studio No Bleach™: έως 4 τόνους πιο ανοιχτά, πιο ήπια για την τρίχα."),
     FAQ_WHEN,
     ("Πόση ώρα διαρκεί;", "Από περίπου 1 ώρα 10′ για ανταύγειες γύρω από το πρόσωπο έως περίπου 3 ώρες για μπαλαγιάζ."),
     ("Πώς κλείνω ραντεβού;", "Online στο alexandroshairsalon.gr/kratisi ή στο 210 346 5554. Αν δεν είσαι σίγουρη τι χρειάζεσαι, κλείσε διάγνωση χρώματος.")],
    "Balayage και ανταύγειες",
    [("Βαφή μαλλιών στην Αθήνα", "/vafi-mallion-athina/"), ("Κούρεμα στην Αθήνα", "/kourema-athina/"), ("Όλες οι τιμές", "/services")],
)

# ---------- /hair-salon-athens/ : για ξένους επισκέπτες, στα αγγλικά, τιμές από το menu.json ----------
EN_SVC = {s["name"]["el"]: s for c in _MENU_JSON for s in c["services"]}


def svc_html_en(name):
    s = EN_SVC[name]
    rows = "".join(
        f'<li><span>{esc(o["en"]) + " · " if o["en"] else ""}<span class="d">{esc(o["time"]["en"])}</span></span><span class="p">€{o["price"]}</span></li>'
        for o in s["options"])
    d = f'<p class="sd">{esc(s["desc"]["en"])}</p>' if s.get("desc") else ""
    return f'<article class="svc"><h3>{esc(s["name"]["en"])}</h3>{d}<ul>{rows}</ul></article>'


def offers_en(names):
    out = []
    for n in names:
        ps = [o["price"] for o in EN_SVC[n]["options"]]
        o = {"@type": "Offer", "name": EN_SVC[n]["name"]["en"], "priceCurrency": "EUR"}
        if len(set(ps)) == 1:
            o["price"] = str(ps[0])
        else:
            o["priceSpecification"] = {"@type": "PriceSpecification", "minPrice": min(ps), "maxPrice": max(ps), "priceCurrency": "EUR"}
        out.append(o)
    return out


EN_KEYS = ["Κούρεμα & γρήγορο στέγνωμα", "Κούρεμα & χτένισμα", "Χτένισμα με βούρτσα", "Χτένισμα για εκδήλωση",
           "Ανδρικό κούρεμα", "Βαφή ρίζας", "Βαφή ρίζας & ρεφλέ στα μήκη", "Ρεφλέ",
           "Ανταύγειες γύρω από το πρόσωπο", "Μερικές ανταύγειες", "Μερικό μπαλαγιάζ"]
EN_FAQ = [
    ("Are you open on Mondays or in the evening?",
     "Usually yes. We work on Mondays and until late on Wednesday and Saturday afternoons, when many salons in Athens are closed or close early. You see live free slots in online booking; our current opening hours are always on Google."),
    ("Do you speak English?", "Yes. Book online in English, or message us on WhatsApp or Viber at +30 698 131 9000."),
    ("Where is the salon?", "Erisichthonos 3-5, Thiseio, central Athens: about 5 minutes on foot from Thiseio metro station, a short walk from the Acropolis area and Monastiraki."),
    ("How do I pay?", "Online when you book, or at the salon after your appointment. Prices are the same online and at the salon."),
    ("Can I just walk in?", "If there is a free chair, yes, but booking online is the safest way to get the time you want, especially when you are in Athens for a few days."),
]
_items = "".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in EN_FAQ)
en_body = f"""
<section class="hero">
  <span class="eyebrow">Hair salon · Thiseio, central Athens · since 1992</span>
  <h1>A hair salon in Athens, <em>when others are closed.</em></h1>
  <p class="lead">Haircut, blowdry, colour and balayage with L’Oréal Professionnel and Redken, in Thiseio near the Acropolis. We often have free slots on Mondays and later in the afternoon, when many salons in Athens are closed. One clear price per service, the same online and at the salon.</p>
  <div class="cta"><a class="btn gold" href="/kratisi/">See free times &amp; book</a><a class="btn ghost" href="https://wa.me/306981319000" target="_blank" rel="noopener">WhatsApp</a></div>
  <ul class="facts"><li>5′ walk from Thiseio metro</li><li>English spoken</li><li>Book online 24/7</li><li>Pay online or at the salon</li></ul>
</section>
<section class="block"><h2>Prices &amp; times</h2>{''.join(svc_html_en(k) for k in EN_KEYS)}
  <p class="cta" style="margin-top:20px"><a class="btn gold" href="/kratisi/">Book online</a><a href="/services">Full price list (switch to EN) →</a></p>
</section>
<section class="block prose">
<h2>What to expect</h2>
<p>A haircut is a shape around the face. We start with a short talk about your face, your hair and how you style it, then cut and finish it the way you choose: a natural quick dry, a quick brushed styling, or a full blowdry polished for shine that usually lasts 3 days or more.</p>
<p>For colour we use L’Oréal Professionnel and Redken, including ammonia-free options and bleach-free lightening with L’Oréal Blond Studio No Bleach™. Every price includes a set amount of product; anything extra is agreed before we start.</p>
</section>
<section class="block"><h2>Questions</h2>{_items}</section>
<section class="block"><h2>See also</h2><p class="links"><a href="/services">Prices</a><a href="/hair-model-athens/">Free haircut as a hair model</a><a href="/kratisi/">Book online</a></p></section>
"""
en_faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
    {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in EN_FAQ]}
en_service_ld = {"@context": "https://schema.org", "@type": "Service", "name": "Hair salon in Athens", "serviceType": "Hair salon",
                 "areaServed": {"@type": "City", "name": "Athens"}, "provider": SALON_REF, "url": f"{SITE}/hair-salon-athens/",
                 "availableLanguage": ["English", "Greek"], "offers": offers_en(EN_KEYS)}
page("/hair-salon-athens/", f"Hair Salon in Athens, Thiseio | from €{P('Κούρεμα χωρίς στέγνωμα')} | Alexandros Hair Salon",
     f"Hair salon in central Athens near the Acropolis: haircut from €{P('Κούρεμα χωρίς στέγνωμα')}, colour, balayage. Free slots on Mondays and late afternoons. English spoken.",
     en_body, [en_service_ld, en_faq_ld, crumbs("Hair salon in Athens", "/hair-salon-athens/")], lang="en", bilingual=True)

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
    <a class="btn gold" href="{WIDGET}" id="wahanda-online-booking-widget" onclick='wahanda.openOnlineBookingWidget("{WIDGET}"); return false;' target="_blank"><span data-en="See times &amp; book">Δες ώρες &amp; κλείσε</span></a>
    <a class="btn ghost" href="tel:{PHONE}" data-en="Call {PHONE_TXT}">Κάλεσε {PHONE_TXT}</a>
  </div>
</section>
<section style="padding-bottom:24px">
  <div id="wahanda-online-booking-widget-iframe" data-widget-url="{WIDGET}"></div>
  <p class="tw-fallback" data-en='Calendar not showing? <a href="{WIDGET}" target="_blank" rel="noopener">Open the booking here</a> or call <a href="tel:{PHONE}">{PHONE_TXT}</a>.'>Δεν εμφανίζεται το ημερολόγιο; <a href="{WIDGET}" target="_blank" rel="noopener">Άνοιξε την κράτηση εδώ</a> ή κάλεσε στο <a href="tel:{PHONE}">{PHONE_TXT}</a>.</p>
</section>
<section class="block prose">
  <h2 data-en="Good to know">Καλό να ξέρεις</h2>
  <p data-en="One price per service, the same online and at the salon; the price list says what each one includes. If a colour needs more product, Extra Colour per 30 g (€{P('+ Επιπλέον χρώμα')}) is agreed before we apply it. Free sensitivity test before your first colour. Wearing extensions? Mention it when you book so we reserve the right time.">Μία τιμή για κάθε υπηρεσία, ίδια online και στο κομμωτήριο· στον τιμοκατάλογο γράφουμε τι περιλαμβάνει η καθεμία. Αν η βαφή θέλει περισσότερο χρώμα, το «+ Επιπλέον χρώμα ανά 30 g» (€{P('+ Επιπλέον χρώμα')}) το συμφωνούμε πριν την εφαρμογή. Δωρεάν τεστ ευαισθησίας πριν από την πρώτη σου βαφή. Έχεις extensions; Γράψ’ το στην κράτηση για να κρατήσουμε τον σωστό χρόνο.</p>
  <p><a href="/services" data-en="Full price list with descriptions →">Όλος ο τιμοκατάλογος με περιγραφές →</a></p>
</section>
"""
kratisi_ld = [{"@context": "https://schema.org", **{k: v for k, v in SALON_REF.items() if k != "@type"}, "@type": "HairSalon",
               "potentialAction": {"@type": "ReserveAction", "target": f"{SITE}/kratisi/"}}]
# ---------- Σελίδες για μοντέλα μαλλιών: φέρνουν αναζητήσεις «δωρεάν κούρεμα / βαφή» στη φόρμα /montela ----------
MODELS_FORM = "/montela#dilosi"
MODEL_OG = f"{SITE}/images/og-montela.jpg"


def model_page(path, crumb, title, desc, eyebrow, h1, lead, facts, prose, faqs, related, cta, lang="el", faq_title="Συχνές ερωτήσεις", related_title="Δες επίσης"):
    items = "".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in faqs)
    faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]}
    facts_html = "".join(f"<li>{esc(f)}</li>" for f in facts)
    rel = "".join(f'<a href="{h}">{esc(t)}</a>' for t, h in related)
    body = f"""
<section class="hero">
  <span class="eyebrow">{esc(eyebrow)}</span>
  <h1>{h1}</h1>
  <p class="lead">{esc(lead)}</p>
  <div class="cta"><a class="btn gold" href="{MODELS_FORM}">{esc(cta)}</a></div>
  <ul class="facts">{facts_html}</ul>
</section>
<section class="block prose">{prose}
  <p class="cta" style="margin-top:20px"><a class="btn gold" href="{MODELS_FORM}">{esc(cta)}</a></p>
</section>
<section class="block"><h2>{esc(faq_title)}</h2>{items}</section>
<section class="block"><h2>{esc(related_title)}</h2><p class="links">{rel}</p></section>
"""
    og = '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">'
    page(path, title, desc, body, [faq_ld, crumbs(crumb, path)], extra_head=og,
         mbar=False, lang=lang, bilingual=(lang == "en"), image=MODEL_OG)


MODEL_FACTS = ["Κούρεμα & χτένισμα δωρεάν", "Χρώμα μόνο με το κόστος των υλικών", "Φυσικό, κλασικό ή ελαφρώς μοντέρνο", "Θησείο, 5′ από το μετρό"]
MODEL_FAQ_COMMON = [
    ("Θα φαίνεται το πρόσωπό μου στις φωτογραφίες;", "Το διαλέγεις εσύ: με το πρόσωπό σου ή μόνο τα μαλλιά. Με πρόσωπο έχεις προτεραιότητα στα ραντεβού. Βλέπεις πρώτη τις φωτογραφίες και υπογράφεις συγκατάθεση πριν από τη φωτογράφιση."),
    ("Ποιος κάνει τη δουλειά;", "Οι έμπειροι κομμωτές του κομμωτηρίου, που δουλεύει στο Θησείο από το 1992, με L’Oréal Professionnel και Redken. Όχι μαθητευόμενοι."),
    ("Πώς δηλώνω συμμετοχή;", "Συμπληρώνεις τη φόρμα ενός λεπτού στο alexandroshairsalon.gr/montela. Όταν προγραμματίσουμε τεχνική που ταιριάζει στα μαλλιά σου, σου στέλνουμε μήνυμα για ραντεβού."),
    ("Υπάρχει όριο ηλικίας;", "Δεχόμαστε από 18 ετών και άνω, κυρίως γυναίκες κάθε ηλικίας. Τα λευκά μαλλιά, τα πολύ μακριά ή τα σγουρά είναι ευπρόσδεκτα: χρειαζόμαστε ποικιλία."),
]

model_page(
    "/dorean-kourema-athina/", "Δωρεάν κούρεμα στην Αθήνα",
    "Δωρεάν κούρεμα στην Αθήνα – Γίνε μοντέλο μαλλιών στο Θησείο | Alexandros Hair Salon",
    "Δωρεάν γυναικείο κούρεμα και χτένισμα στην Αθήνα, ως μοντέλο μαλλιών στο Θησείο. Φυσικό, κλασικό ή ελαφρώς μοντέρνο αποτέλεσμα από έμπειρους κομμωτές. Φόρμα 1 λεπτού.",
    "Μοντέλα μαλλιών · Θησείο, κέντρο Αθήνας",
    "Δωρεάν κούρεμα στην Αθήνα, <em>ως μοντέλο μαλλιών.</em>",
    "Ψάχνουμε γυναίκες κάθε ηλικίας για κούρεμα και χτένισμα δωρεάν, σε αντάλλαγμα για φωτογραφίες του νέου look. Δουλεύουν οι έμπειροι κομμωτές του κομμωτηρίου, με αποτέλεσμα που στέκεται στην καθημερινότητά σου.",
    MODEL_FACTS,
    """<h2>Τι περιλαμβάνει το δωρεάν κούρεμα</h2>
<p>Συζήτηση για το πρόσωπο, τα χαρακτηριστικά και την υφή των μαλλιών σου, λούσιμο, κούρεμα και χτένισμα με πιστολάκι, και φωτογράφιση στο τέλος. Υπολόγισε περίπου μία ώρα.</p>
<p>Κουρεύουμε pixie, bob και lob, butterfly, curtain bangs, φιλάρισμα για όγκο, καθαρό φρεσκάρισμα. Ό,τι κάνουμε το συμφωνούμε πριν ξεκινήσουμε· αν κάτι δεν σου ταιριάζει, θα σου το πούμε.</p>
<h2>Γιατί δωρεάν;</h2>
<p>Δοκιμάζουμε νέες τεχνικές και χρειαζόμαστε φωτογραφίες της δουλειάς μας για το site και τα social. Εσύ παίρνεις ένα επαγγελματικό κούρεμα, εμείς τις φωτογραφίες.</p>""",
    MODEL_FAQ_COMMON,
    [("Βαφή & balayage σε τιμή υλικών", "/montelo-vafi-balayage-athina/"), ("Free haircut in Athens (English)", "/hair-model-athens/"), ("Κούρεμα στην Αθήνα", "/kourema-athina/")],
    "Δήλωσε συμμετοχή",
)

model_page(
    "/montelo-vafi-balayage-athina/", "Βαφή & balayage για μοντέλα",
    "Βαφή μαλλιών & balayage σε τιμή υλικών – Μοντέλο μαλλιών Αθήνα | Alexandros Hair Salon",
    "Γίνε μοντέλο μαλλιών στο Θησείο: βαφή ρίζας, ρεφλέ, ανταύγειες χωρίς ντεκαπάζ ή balayage μόνο με το κόστος των υλικών, με L’Oréal Professionnel και Redken. Φόρμα 1 λεπτού.",
    "Μοντέλα για χρώμα · Θησείο, κέντρο Αθήνας",
    "Βαφή και balayage <em>σε τιμή υλικών.</em>",
    "Για τις νέες τεχνικές χρώματος ψάχνουμε μοντέλα: βαφή ρίζας με ρεφλέ, ανταύγειες χωρίς ντεκαπάζ, balayage. Πληρώνεις μόνο ένα μικρό ποσό για τα υλικά, και το ξέρεις πριν ξεκινήσουμε.",
    ["Χρώμα μόνο με το κόστος των υλικών", "L’Oréal Professionnel & Redken", "Τεστ ευαισθησίας 48 ώρες πριν", "Θησείο, 5′ από το μετρό"],
    """<h2>Ποιες τεχνικές χρώματος</h2>
<p><strong>Βαφή ρίζας με ρεφλέ:</strong> κάλυψη λευκών με Majirel, INOA χωρίς αμμωνία ή Redken, και ξεχωριστό gloss στα μήκη για λάμψη.</p>
<p><strong>Ανταύγειες χωρίς ντεκαπάζ:</strong> απαλό φως γύρω από το πρόσωπο, ιδανικό αν δεν έχεις κάνει ποτέ ανταύγειες.</p>
<p><strong>Balayage:</strong> φυσικό σβήσιμο από τη ρίζα στα άκρα, με ενσωματωμένο bonder για την προστασία της τρίχας.</p>
<h2>Πόση ώρα και τι χρειάζεται</h2>
<p>Η βαφή θέλει περίπου δύο ώρες, το balayage δύο με τρεις, μαζί με τη φωτογράφιση. Πριν από κάθε βαφή κάνουμε τεστ ευαισθησίας 48 ώρες νωρίτερα, όπως και σε κάθε πελάτισσα.</p>""",
    [("Πόσο κοστίζει η βαφή ως μοντέλο;", "Μόνο ένα μικρό μέρος της κανονικής τιμής, για τα υλικά. Το ακριβές ποσό το ξέρεις πριν κλείσουμε ραντεβού.")] + MODEL_FAQ_COMMON,
    [("Δωρεάν κούρεμα ως μοντέλο", "/dorean-kourema-athina/"), ("Βαφή μαλλιών στην Αθήνα", "/vafi-mallion-athina/"), ("Balayage στην Αθήνα", "/balayage-athina/")],
    "Δήλωσε συμμετοχή",
)

model_page(
    "/hair-model-athens/", "Hair model in Athens",
    "Free Haircut in Athens – Become a Hair Model in Thiseio | Alexandros Hair Salon",
    "Become a hair model in central Athens: free haircut and styling, colour and balayage at material cost, with L’Oréal Professionnel and Redken. Natural, classic or softly modern results. One-minute form.",
    "Hair models wanted · Thiseio, central Athens",
    "Free haircut in Athens, <em>as a hair model.</em>",
    "We are looking for women of any age, including students and visitors living in Athens, for a free haircut and styling or colour at material cost, in exchange for photos of the result. The work is done by the salon’s experienced stylists, not trainees.",
    ["Free cut & styling", "Colour at material cost", "Natural, classic or softly modern", "5′ from Thiseio metro"],
    """<h2>What you get</h2>
<p>A consultation, wash, haircut and blow-dry, about one hour, or a colour service such as root colour with gloss, no-bleach highlights or balayage, two to three hours. We agree on the result before we start, and it has to suit your everyday life.</p>
<h2>Photos: you choose</h2>
<p>Photos with your face or just your hair. With your face you get priority for appointments. You see the photos first and sign a consent before the shoot. We speak English.</p>""",
    [("Is it really free?", "Haircuts and styling are free. For colour, highlights and balayage you pay only a small amount for materials, and you know it before booking."),
     ("Who does the work?", "The salon’s experienced stylists, working in Thiseio since 1992, with L’Oréal Professionnel and Redken. Not trainees."),
     ("How do I sign up?", "Fill in the one-minute form at alexandroshairsalon.gr/montela (switch the page to English with the EN button). We message you when we schedule a technique that suits your hair."),
     ("Where is the salon?", "Erisichthonos 3-5, Thiseio, Athens, a five-minute walk from Thiseio metro station.")],
    [("Δωρεάν κούρεμα (Ελληνικά)", "/dorean-kourema-athina/"), ("Colour & balayage for models (Greek)", "/montelo-vafi-balayage-athina/"), ("Prices", "/services")],
    "Sign up as a model", lang="en", faq_title="Questions", related_title="See also",
)


page("/kratisi/", "Κράτηση ραντεβού online | Alexandros Hair Salon – Κομμωτήριο Θησείο",
     "Κλείσε online ραντεβού στο Alexandros Hair Salon, Θησείο: κούρεμα, χτένισμα, βαφή, balayage. Βλέπεις ελεύθερες ώρες, τιμή και διάρκεια.",
     kratisi_body, kratisi_ld, extra_head=kratisi_head, mbar=False, bilingual=True)
