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
import urllib.parse as _up


def book_url(o):
    """Κράτηση της συγκεκριμένης επιλογής στο widget της Treatwell (ίδιο με src/data/prices.js)."""
    if not o.get("book"):
        return None
    ps = json.dumps([{"menuItemId": o["book"]["item"], "optionIds": [o["book"]["option"]]}], separators=(",", ":"))
    return "https://widget.treatwell.gr/availability?venueId=523778&proposedServices=" + _up.quote(ps, safe="")


BOOKS = {s["name"]["el"]: [book_url(o) for o in s["options"]] for c in _MENU_JSON for s in c["services"]}
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
.svc li:first-child{border-top:0}.svc li a.bk{display:flex;justify-content:space-between;gap:12px;width:100%;color:inherit;text-decoration:none}.svc li a.bk:hover span:first-child{text-decoration:underline}.svc .d{color:var(--muted);white-space:nowrap}.svc .p{font-weight:800;white-space:nowrap;color:var(--gold)}
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


def eur(p, en=False):
    """€54 ή €0,01 / €0.01 (ίδιο με eur() στο src/data/prices.js)."""
    if float(p).is_integer():
        return f"€{int(p)}"
    t = f"{p:.2f}"
    return "€" + (t if en else t.replace(".", ","))


def esc(s):
    return html.escape(str(s), quote=True)


def svc_html(key):
    name, opts = MENU[key]
    def li(o, d, p, url):
        inner = f'<span>{esc(o) + " · " if o else ""}<span class="d">{esc(d)}</span></span><span class="p">{eur(p)}{" →" if url else ""}</span>'
        if url:
            return f'<li><a class="bk" href="{esc(url)}" target="_blank" rel="noopener" aria-label="Κράτηση: {esc(name)}{" · " + esc(o) if o else ""}">{inner}</a></li>'
        return f'<li>{inner}</li>'
    rows = "".join(li(o, d, p, u) for (o, d, p), u in zip(opts, BOOKS[key]))
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


# ---------- Κουμπί «Αποστολή σε φίλο ή φίλη» (ίδιο με src/components/ShareButton.js, χωρίς εξωτερικά scripts) ----------
SHARE_CSS = """
.share{position:relative;display:inline-block}
.share>button{display:inline-flex;align-items:center;gap:10px;cursor:pointer;font:700 16px var(--sans)}
.share>button svg,.share-menu svg{width:16px;height:16px}
.share-menu{position:absolute;z-index:30;top:calc(100% + 8px);left:0;min-width:230px;display:flex;flex-direction:column;padding:6px;border-radius:16px;background:var(--panel);border:1px solid #5a5247;box-shadow:0 16px 40px rgba(0,0,0,.35)}
.share-menu[hidden]{display:none}
.share-menu a,.share-menu button{display:flex;align-items:center;gap:12px;min-height:44px;padding:0 14px;border-radius:10px;color:var(--text);text-decoration:none;font:500 15px var(--sans);background:none;border:0;cursor:pointer;text-align:left}
.share-menu svg{color:var(--gold)}
.share-menu a:hover,.share-menu button:hover{background:var(--bg);color:var(--gold)}
html[data-theme=light] .share-menu{border-color:#c4b6a0;box-shadow:0 16px 40px rgba(70,52,20,.16)}
@media (max-width:760px){.share{display:block;flex:1 1 100%}.share>button{width:100%;justify-content:center}.share-menu{right:0}}
"""
SHARE_JS = """<script>
(function(){document.querySelectorAll('[data-share]').forEach(function(box){
var b=box.querySelector('button'),m=box.querySelector('.share-menu'),c=box.querySelector('[data-copy]'),d=box.dataset;
function track(k){try{if(window.gtag)gtag('event','share',{method:k,content_type:'page',item_id:d.campaign});}catch(e){}}
var native=!!navigator.share&&window.matchMedia&&matchMedia('(hover: none) and (pointer: coarse)').matches;
b.addEventListener('click',function(e){e.stopPropagation();
 if(native){navigator.share({title:d.title,text:d.text,url:d.url}).then(function(){track('native');},function(err){if(err&&err.name!=='AbortError'){m.hidden=false;}});return;}
 m.hidden=!m.hidden;b.setAttribute('aria-expanded',!m.hidden);});
document.addEventListener('click',function(e){if(!box.contains(e.target)){m.hidden=true;b.setAttribute('aria-expanded','false');}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){m.hidden=true;b.setAttribute('aria-expanded','false');}});
m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){track(a.dataset.k);});});
c.addEventListener('click',function(){var done=function(){var t=c.querySelector('span:last-child');var o=t.textContent;t.textContent=c.dataset.done;track('copy');setTimeout(function(){t.textContent=o;},2500);};
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(d.url).then(done,function(){window.prompt('',d.url);});}else{window.prompt('',d.url);}});
});})();
</script>"""
_SHARE_ICON = ICONS['FaShareAlt']
_MAIL_ICON = ICONS['FaEnvelope']
_LINK_ICON = ICONS['FaLink']


def share_html(path, campaign, title, text, label, lang="el"):
    """Κουμπί κοινοποίησης για στατική σελίδα. Ο σύνδεσμος έχει UTM για το Analytics."""
    url = f"{SITE}{path}?utm_source=share&utm_medium=referral&utm_campaign={campaign}"
    msg = _up.quote(f"{text} {url}")
    en = lang == "en"
    items = [("whatsapp", "WhatsApp", ICONS["FaWhatsapp"], f"https://wa.me/?text={msg}", True),
             ("viber", "Viber", ICONS["FaViber"], f"viber://forward?text={msg}", False),
             ("facebook", "Facebook", ICONS["FaFacebookF"], f"https://www.facebook.com/sharer/sharer.php?u={_up.quote(url, safe='')}", True),
             ("email", "Email", _MAIL_ICON, f"mailto:?subject={_up.quote(title)}&body={msg}", False)]
    links = "".join(f'<a data-k="{k}" href="{esc(h)}"{" target=\"_blank\" rel=\"noopener noreferrer\"" if blank else ""}>{ic}<span>{n}</span></a>' for k, n, ic, h, blank in items)
    copy_t, done_t = ("Copy link", "Link copied") if en else ("Αντιγραφή συνδέσμου", "Ο σύνδεσμος αντιγράφηκε")
    return (f'<div class="share" data-share data-campaign="{esc(campaign)}" data-url="{esc(url)}" data-title="{esc(title)}" data-text="{esc(text)}">'
            f'<button type="button" class="btn ghost" aria-expanded="false">{_SHARE_ICON}<span>{esc(label)}</span></button>'
            f'<div class="share-menu" role="group" aria-label="{"Sharing options" if en else "Επιλογές αποστολής"}" hidden>{links}'
            f'<button type="button" data-copy data-done="{esc(done_t)}">{_LINK_ICON}<span>{copy_t}</span></button></div></div>')


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
<style>{CSS}{SHARE_CSS if 'data-share' in body else ''}</style>
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
  <p class="links"><a href="/">Αρχική</a><a href="/services">Όλες οι τιμές</a><a href="/kourema-athina/">Κούρεμα στην Αθήνα</a><a href="/vafi-mallion-athina/">Βαφή μαλλιών στην Αθήνα</a><a href="/balayage-athina/">Balayage στην Αθήνα</a><a href="/dorean-kourema-athina/">Δωρεάν κούρεμα (μοντέλο)</a><a href="/fotografies">Φωτογραφίες</a><a href="/kratisi/">Κράτηση online</a><a href="/hair-salon-athens/" hreflang="en">Hair salon in Athens (English)</a><a href="/xtenisma-fotografisi-athina/">Χτένισμα για φωτογράφιση</a><a href="/synergasies/">Συνεργασίες</a><a href="/syxnes-erotiseis/">Συχνές ερωτήσεις</a><a href="/gnomi/">Η γνώμη σου</a><a href="/shop">Shop</a></p>
</div></footer>
{'<div class="mbar"><span data-en="Thiseio · since 1992">Θησείο · από το 1992</span><a class="btn gold" href="/kratisi/" data-en="Book now">Κλείσε ραντεβού</a></div>' if mbar else ''}
<button type="button" class="totop" aria-label="Επιστροφή στην κορυφή" title="Επιστροφή στην κορυφή" tabindex="-1">{ICONS['FaArrowUp']}</button>
<script>
(function(){{var b=document.querySelector('.totop');function f(){{var on=window.scrollY>600;b.classList.toggle('on',on);b.tabIndex=on?0:-1;}}
window.addEventListener('scroll',f,{{passive:true}});f();
b.addEventListener('click',function(){{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;window.scrollTo({{top:0,behavior:r?'auto':'smooth'}});document.getElementById('main').focus({{preventScroll:true}});}});}})();
</script>
{LANG_JS if bilingual else ''}
{MAPS_JS}{chr(10) + SHARE_JS if 'data-share' in body else ''}
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


def service_page(path, crumb, title, desc, eyebrow, h1, lead, facts, prose, keys, faqs, service_type, related, footnote=""):
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
<section class="block prose">{prose}{footnote}</section>
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
<p>Μία τιμή για κάθε μήκος· διαλέγεις μόνο το τέλος. <strong>Χωρίς στέγνωμα</strong>, ιδανικό για σγουρά. <strong>Γρήγορο στέγνωμα</strong>: με τα χέρια, με πιστολάκι ή φυσούνα, για φυσικό αποτέλεσμα. <strong>Γρήγορο φορμάρισμα</strong>: πιστολάκι και βούρτσα για όγκο και φόρμα. <strong>Χτένισμα</strong>: πλήρες, ίσιο και λείο ή με όγκο και κίνηση, που κρατά συνήθως 2–3 ημέρες.</p>""",
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
SKIN_NOTE = '<p class="footnote" style="font-size:.82em;opacity:.75">* Αν βάφεσαι πρώτη φορά σε εμάς, μπορούμε να κάνουμε δωρεάν τεστ ευαισθησίας πριν από τη βαφή. Δεν χρειάζεται για να κλείσεις ραντεβού.</p>'
ROOT = "Βαφή ρίζας"
ROOT_OPTS = dict((o, p) for o, _, p in MENU[ROOT][1])
service_page(
    "/vafi-mallion-athina/", "Βαφή μαλλιών στην Αθήνα",
    f"Βαφή Μαλλιών Αθήνα – Θησείο | Ρίζα από €{P(ROOT)} | Alexandros Hair Salon",
    f"Βαφή ρίζας & κάλυψη λευκών €{ROOT_OPTS['Κανονική']}, Μηνιαία ρίζα €{ROOT_OPTS['Μηνιαία ρίζα']}, χωρίς αμμωνία €{ROOT_OPTS['Χωρίς αμμωνία']} (INOA, Redken). Ρίζα & ρεφλέ από €{P('Βαφή ρίζας & ρεφλέ στα μήκη')}. Κομμωτήριο στο Θησείο, Αθήνα. Κλείσε online.",
    "Χρώμα · L’Oréal Professionnel & Redken",
    "Βαφή μαλλιών στην Αθήνα, <em>με L’Oréal &amp; Redken.</em>",
    "Κάλυψη λευκών στη ρίζα, βαφή χωρίς αμμωνία, ρεφλέ για λάμψη και τόνο. Μία τιμή για κάθε υπηρεσία, με συγκεκριμένη ποσότητα χρώματος, ώστε να ξέρεις από πριν τι πληρώνεις.",
    [f"Βαφή ρίζας από €{P(ROOT)}"] + COMMON_FACTS,
    f"""<h2>Βαφή ρίζας και Μηνιαία ρίζα</h2>
<p><strong>Βαφή ρίζας (€{ROOT_OPTS['Κανονική']})</strong>: μόνιμη βαφή με Farcom ή Majirel της L’Oréal Professionnel, για σίγουρη κάλυψη λευκών. <strong>Χωρίς αμμωνία (€{ROOT_OPTS['Χωρίς αμμωνία']})</strong>: INOA της L’Oréal Professionnel ή Redken. Και οι δύο περιλαμβάνουν λούσιμο και γρήγορο στέγνωμα.</p>
<p><strong>Μηνιαία ρίζα (€{ROOT_OPTS['Μηνιαία ρίζα']}, χωρίς αμμωνία €{ROOT_OPTS['Χωρίς αμμωνία · μηνιαία ρίζα']})</strong>: όταν η επόμενη βαφή ρίζας γίνεται μέσα σε 30 ημέρες από την προηγούμενη σε εμάς. Στο ταμείο παίρνεις καρτελάκι με την ημερομηνία.</p>
<h2>Ρίζα + ρεφλέ</h2>
<p>Με το <strong>ρεφλέ (gloss)</strong> στα μήκη το χρώμα δένει από τη ρίζα ως τις άκρες και τα μαλλιά αποκτούν λάμψη. Είναι ξεχωριστή εφαρμογή στα μήκη, έως 60 ml για μαλλιά έως τους ώμους ή 90 ml κάτω από τους ώμους, όχι απλό τράβηγμα της βαφής της ρίζας. Για μεγάλη αλλαγή ή διόρθωση προηγούμενου χρώματος ξεκινάμε με διάγνωση, ώστε να ξέρεις πλάνο και τιμή πριν από οτιδήποτε.</p>""",
    [ROOT, "Βαφή ρίζας & ρεφλέ στα μήκη", "Ρεφλέ", "Βαφή σε όλο το μαλλί", "Ξάνοιγμα ρίζας & ρεφλέ", "+ Επιπλέον χρώμα", "Διόρθωση χρώματος"],
    [("Πόσο κοστίζει η βαφή ρίζας;", f"€{ROOT_OPTS['Κανονική']}, ή €{ROOT_OPTS['Χωρίς αμμωνία']} χωρίς αμμωνία, με λούσιμο και γρήγορο στέγνωμα. Όταν η επόμενη βαφή ρίζας γίνεται μέσα σε 30 ημέρες, η Μηνιαία ρίζα είναι €{ROOT_OPTS['Μηνιαία ρίζα']} (χωρίς αμμωνία €{ROOT_OPTS['Χωρίς αμμωνία · μηνιαία ρίζα']})."),
     ("Έχετε βαφή χωρίς αμμωνία;", f"Ναι: INOA της L’Oréal Professionnel ή Redken, €{ROOT_OPTS['Χωρίς αμμωνία']} (Μηνιαία ρίζα €{ROOT_OPTS['Χωρίς αμμωνία · μηνιαία ρίζα']})."),
     FAQ_WHEN,
     ("Πόση ώρα διαρκεί η βαφή ρίζας;", "Περίπου μία ώρα μαζί με την αναμονή. Με ρεφλέ στα μήκη από μία ώρα έως μία ώρα και δέκα λεπτά."),
     ("Πώς κλείνω ραντεβού για βαφή;", "Online στο alexandroshairsalon.gr/kratisi, όπου βλέπεις ελεύθερες ώρες, ή στο 210 346 5554. Πληρώνεις online ή στο κομμωτήριο.")],
    "Βαφή μαλλιών",
    [("Balayage στην Αθήνα", "/balayage-athina/"), ("Κούρεμα στην Αθήνα", "/kourema-athina/"), ("Όλες οι τιμές", "/services")],
    footnote=SKIN_NOTE + f'<p class="footnote" style="font-size:.82em;opacity:.75">Κάθε βαφή περιλαμβάνει συγκεκριμένη ποσότητα χρώματος (στη βαφή ρίζας έως 45 g). Αν χρειαστεί περισσότερο, το «+ Επιπλέον χρώμα ανά 30 g» (€{P("+ Επιπλέον χρώμα")}) το συμφωνούμε πριν την εφαρμογή.</p>',
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
<p><strong>Γύρω από το πρόσωπο</strong>: λεπτές ανταύγειες που φωτίζουν το πρόσωπο, ιδανικές για πρώτη φορά. <strong>Μερικές</strong>: στο πάνω μέρος και γύρω από το πρόσωπο. <strong>Ολόκληρες</strong>: σε όλο το κεφάλι. <strong>Μερικό μπαλαγιάζ (balayage)</strong>: απαλό φως ζωγραφισμένο με το χέρι, ελεύθερα ή σε αλουμινόχαρτα (foilayage), για μεσαία και μακριά μαλλιά.</p>
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
    footnote=SKIN_NOTE,
)

# ---------- /hair-salon-athens/ : για ξένους επισκέπτες, στα αγγλικά, τιμές από το menu.json ----------
EN_SVC = {s["name"]["el"]: s for c in _MENU_JSON for s in c["services"]}


def svc_html_en(name):
    s = EN_SVC[name]
    def li(o):
        url = book_url(o)
        inner = f'<span>{esc(o["en"]) + " · " if o["en"] else ""}<span class="d">{esc(o["time"]["en"])}</span></span><span class="p">{eur(o["price"], True)}{" →" if url else ""}</span>'
        if url:
            return f'<li><a class="bk" href="{esc(url)}" target="_blank" rel="noopener" aria-label="Book: {esc(s["name"]["en"])}{" · " + esc(o["en"]) if o["en"] else ""}">{inner}</a></li>'
        return f'<li>{inner}</li>'
    rows = "".join(li(o) for o in s["options"])
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
<p>A haircut is a shape around the face. We start with a short talk about your face, your hair and how you style it, then cut and finish it the way you choose: a natural quick dry, a quick brushed styling, or a full blow-out, bouncy or sleek, that usually lasts 2–3 days.</p>
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
  <p data-en="One price per service, the same online and at the salon; the price list says what each one includes. If a colour needs more product, Extra Colour per 30 g (€{P('+ Επιπλέον χρώμα')}) is agreed before we apply it. Wearing extensions? Mention it when you book so we reserve the right time.">Μία τιμή για κάθε υπηρεσία, ίδια online και στο κομμωτήριο· στον τιμοκατάλογο γράφουμε τι περιλαμβάνει η καθεμία. Αν η βαφή θέλει περισσότερο χρώμα, το «+ Επιπλέον χρώμα ανά 30 g» (€{P('+ Επιπλέον χρώμα')}) το συμφωνούμε πριν την εφαρμογή. Αν έχεις extensions, μπορείς να το σημειώσεις στην κράτηση, για να κρατήσουμε τον σωστό χρόνο.</p>
  <p><a href="/services" data-en="Full price list with descriptions →">Όλος ο τιμοκατάλογος με περιγραφές →</a></p>
</section>
"""
kratisi_ld = [{"@context": "https://schema.org", **{k: v for k, v in SALON_REF.items() if k != "@type"}, "@type": "HairSalon",
               "potentialAction": {"@type": "ReserveAction", "target": f"{SITE}/kratisi/"}}]
# ---------- Σελίδες για μοντέλα μαλλιών: φέρνουν αναζητήσεις «δωρεάν κούρεμα / βαφή» στη φόρμα /montela ----------
MODELS_FORM = "/montela#dilosi"
MODEL_OG = f"{SITE}/images/og-montela-2.jpg"


def model_page(path, crumb, title, desc, eyebrow, h1, lead, facts, prose, faqs, related, cta, lang="el", faq_title="Συχνές ερωτήσεις", related_title="Δες επίσης", share=""):
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
  <div class="cta"><a class="btn gold" href="{MODELS_FORM}">{esc(cta)}</a>{share}</div>
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
    ("Θα φαίνεται το πρόσωπό μου στις φωτογραφίες;", "Το διαλέγεις εσύ: με το πρόσωπό σου ή μόνο τα μαλλιά. Με πρόσωπο έχεις προτεραιότητα στα ραντεβού. Βλέπεις πρώτα εσύ τις φωτογραφίες και υπογράφεις συγκατάθεση πριν από τη φωτογράφιση."),
    ("Ποιος κάνει τη δουλειά;", "Οι έμπειροι κομμωτές του κομμωτηρίου, που δουλεύει στο Θησείο από το 1992, με L’Oréal Professionnel και Redken. Όχι μαθητευόμενοι."),
    ("Πώς δηλώνω συμμετοχή;", "Συμπληρώνεις τη φόρμα ενός λεπτού στο alexandroshairsalon.gr/montela. Όταν προγραμματίσουμε τεχνική που ταιριάζει στα μαλλιά σου, σου στέλνουμε μήνυμα για ραντεβού."),
    ("Υπάρχει όριο ηλικίας;", "Δεχόμαστε από 18 ετών και άνω, γυναίκες και άνδρες κάθε ηλικίας· οι άνδρες κυρίως για κούρεμα και styling. Τα λευκά μαλλιά, τα πολύ μακριά ή τα σγουρά είναι ευπρόσδεκτα: χρειαζόμαστε ποικιλία."),
]

model_page(
    "/dorean-kourema-athina/", "Δωρεάν κούρεμα στην Αθήνα",
    "Δωρεάν κούρεμα στην Αθήνα – Γίνε μοντέλο μαλλιών στο Θησείο | Alexandros Hair Salon",
    "Δωρεάν κούρεμα και χτένισμα για γυναίκες και άνδρες στην Αθήνα, ως μοντέλο μαλλιών στο Θησείο. Φυσικό, κλασικό ή ελαφρώς μοντέρνο αποτέλεσμα από έμπειρους κομμωτές. Φόρμα 1 λεπτού.",
    "Μοντέλα μαλλιών · Θησείο, κέντρο Αθήνας",
    "Δωρεάν κούρεμα στην Αθήνα, <em>ως μοντέλο μαλλιών.</em>",
    "Ψάχνουμε γυναίκες και άνδρες κάθε ηλικίας για κούρεμα και χτένισμα δωρεάν, σε αντάλλαγμα για φωτογραφίες του νέου look. Δουλεύουν οι έμπειροι κομμωτές του κομμωτηρίου, με αποτέλεσμα που στέκεται στην καθημερινότητά σου.",
    MODEL_FACTS,
    """<h2>Τι περιλαμβάνει το δωρεάν κούρεμα</h2>
<p>Συζήτηση για το πρόσωπο, τα χαρακτηριστικά και την υφή των μαλλιών σου, λούσιμο, κούρεμα και χτένισμα με πιστολάκι, και φωτογράφιση στο τέλος. Υπολόγισε περίπου μία ώρα.</p>
<p>Στα γυναικεία κουρεύουμε pixie, bob και lob, butterfly, curtain bangs, φιλάρισμα για όγκο, καθαρό φρεσκάρισμα. Στα ανδρικά, κλασικά και μοντέρνα κουρέματα με ψαλίδι και μηχανή, με styling για τη φωτογράφιση. Ό,τι κάνουμε το συμφωνούμε πριν ξεκινήσουμε· αν κάτι δεν σου ταιριάζει, θα σου το πούμε.</p>
<h2>Γιατί δωρεάν;</h2>
<p>Δοκιμάζουμε νέες τεχνικές και χρειαζόμαστε φωτογραφίες της δουλειάς μας για το site και τα social. Εσύ παίρνεις ένα επαγγελματικό κούρεμα, εμείς τις φωτογραφίες.</p>""",
    MODEL_FAQ_COMMON,
    [("Βαφή & balayage σε τιμή υλικών", "/montelo-vafi-balayage-athina/"), ("Free haircut in Athens (English)", "/hair-model-athens/"), ("Κούρεμα στην Αθήνα", "/kourema-athina/")],
    "Δήλωσε συμμετοχή",
    share=share_html("/dorean-kourema-athina/", "dorean-kourema-athina", "Δωρεάν κούρεμα ως μοντέλο μαλλιών στο Θησείο", "Το Alexandros Hair Salon στο Θησείο ψάχνει μοντέλα μαλλιών για δωρεάν κούρεμα και χτένισμα. Μήπως σε ενδιαφέρει;", "Αποστολή σε φίλο ή φίλη", "el")
)

model_page(
    "/montelo-vafi-balayage-athina/", "Βαφή & balayage για μοντέλα",
    "Βαφή μαλλιών & balayage σε τιμή υλικών – Μοντέλο μαλλιών Αθήνα | Alexandros Hair Salon",
    "Γίνε μοντέλο μαλλιών στο Θησείο: βαφή ρίζας, ρεφλέ, ανταύγειες χωρίς ντεκαπάζ ή balayage μόνο με το κόστος των υλικών, με L’Oréal Professionnel και Redken. Φόρμα 1 λεπτού.",
    "Μοντέλα για χρώμα · Θησείο, κέντρο Αθήνας",
    "Βαφή και balayage <em>σε τιμή υλικών.</em>",
    "Για τις νέες τεχνικές χρώματος ψάχνουμε μοντέλα: βαφή ρίζας με ρεφλέ, ανταύγειες χωρίς ντεκαπάζ, balayage. Πληρώνεις μόνο ένα μικρό ποσό για τα υλικά, και το ξέρεις πριν ξεκινήσουμε.",
    ["Χρώμα μόνο με το κόστος των υλικών", "L’Oréal Professionnel & Redken", "Online κράτηση 24/7", "Θησείο, 5′ από το μετρό"],
    """<h2>Ποιες τεχνικές χρώματος</h2>
<p><strong>Βαφή ρίζας με ρεφλέ:</strong> κάλυψη λευκών με Majirel, INOA χωρίς αμμωνία ή Redken, και ξεχωριστό gloss στα μήκη για λάμψη.</p>
<p><strong>Ανταύγειες χωρίς ντεκαπάζ:</strong> απαλό φως γύρω από το πρόσωπο, ιδανικό αν δεν έχεις κάνει ποτέ ανταύγειες.</p>
<p><strong>Balayage:</strong> φυσικό σβήσιμο από τη ρίζα στα άκρα, με ρεφλέ.</p>
<h2>Πόση ώρα και τι χρειάζεται</h2>
<p>Η βαφή θέλει περίπου δύο ώρες, το balayage δύο με τρεις, μαζί με τη φωτογράφιση.</p>""",
    [("Πόσο κοστίζει η βαφή ως μοντέλο;", "Μόνο ένα μικρό μέρος της κανονικής τιμής, για τα υλικά. Το ακριβές ποσό το ξέρεις πριν κλείσουμε ραντεβού.")] + MODEL_FAQ_COMMON,
    [("Δωρεάν κούρεμα ως μοντέλο", "/dorean-kourema-athina/"), ("Βαφή μαλλιών στην Αθήνα", "/vafi-mallion-athina/"), ("Balayage στην Αθήνα", "/balayage-athina/")],
    "Δήλωσε συμμετοχή",
    share=share_html("/montelo-vafi-balayage-athina/", "montelo-vafi-balayage-athina", "Βαφή και balayage σε τιμή υλικών στο Θησείο", "Το Alexandros Hair Salon στο Θησείο ψάχνει μοντέλα για βαφή και balayage, μόνο με το κόστος των υλικών. Μήπως σε ενδιαφέρει;", "Αποστολή σε φίλο ή φίλη", "el")
)

model_page(
    "/hair-model-athens/", "Hair model in Athens",
    "Free Haircut in Athens – Become a Hair Model in Thiseio | Alexandros Hair Salon",
    "Become a hair model in central Athens: free haircut and styling, colour and balayage at material cost, with L’Oréal Professionnel and Redken. Natural, classic or softly modern results. One-minute form.",
    "Hair models wanted · Thiseio, central Athens",
    "Free haircut in Athens, <em>as a hair model.</em>",
    "We are looking for women and men of any age (men mainly for haircuts and styling), including students and visitors living in Athens, for a free haircut and styling or colour at material cost, in exchange for photos of the result. The work is done by the salon’s experienced stylists, not trainees.",
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
    share=share_html("/hair-model-athens/", "hair-model-athens", "Free haircut in Athens as a hair model", "Alexandros Hair Salon in Thiseio, Athens is looking for hair models: a free haircut and styling, or colour at material cost. Might this interest you?", "Send to a friend", "en")
)

# ---------- Σελίδες B2B: φωτογραφίσεις, ξενοδοχεία, γάμοι, συνεργάτες (τιμές από το menu.json) ----------
WA = "https://wa.me/306981319000"
EXPERIENCE_EL = "Ο Αλέξανδρος Λιακόπουλος δουλεύει στο κομμωτήριο της οικογένειας στο Θησείο και δούλεψε στο κεντρικό κομμωτήριο Rob Peetoom στο Άμστερνταμ (2011–2013), την ομάδα που κάνει τα μαλλιά σε fashion shows της Amsterdam Fashion Week."
EXPERIENCE_EN = "Alexandros Liakopoulos works at his family’s salon in Thiseio and worked at Rob Peetoom’s flagship salon in Amsterdam (2011–2013), the team behind the hair at Amsterdam Fashion Week shows."


def alt_head(el_path, en_path):
    return (f'<link rel="alternate" hreflang="el" href="{SITE}{el_path}">'
            f'<link rel="alternate" hreflang="en" href="{SITE}{en_path}">'
            f'<link rel="alternate" hreflang="x-default" href="{SITE}{en_path}">')


def b2b_page(path, crumb, title, desc, eyebrow, h1, lead, facts, prose, keys, faqs, related, lang, service_type, head="", share=""):
    en = lang == "en"
    cards = "".join((svc_html_en if en else svc_html)(k) for k in keys)
    items = "".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in faqs)
    faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]}
    facts_html = "".join(f"<li>{esc(f)}</li>" for f in facts)
    rel = "".join(f'<a href="{h}">{esc(t)}</a>' for t, h in related)
    t = (lambda a, b: b if en else a)
    body = f"""
<section class="hero">
  <span class="eyebrow">{esc(eyebrow)}</span>
  <h1>{h1}</h1>
  <p class="lead">{esc(lead)}</p>
  <div class="cta"><a class="btn gold" href="{WA}" target="_blank" rel="noopener">{t("Μήνυμα στο WhatsApp", "Message us on WhatsApp")}</a><a class="btn ghost" href="tel:+306981319000">{t("Κλήση 698 131 9000", "Call +30 698 131 9000")}</a>{share}</div>
  <ul class="facts">{facts_html}</ul>
</section>
{"<section class='block'><h2>" + t("Τιμές &amp; χρόνοι", "Prices &amp; times") + "</h2>" + cards + "<p class='cta' style='margin-top:20px'><a class='btn gold' href='/kratisi/'>" + t("Κλείσε online", "Book online") + "</a></p></section>" if keys else ""}
<section class="block prose">{prose}</section>
<section class="block"><h2>{t("Συχνές ερωτήσεις", "Questions")}</h2>{items}</section>
<section class="block"><h2>{t("Δες επίσης", "See also")}</h2><p class="links">{rel}</p></section>
"""
    ld = {"@context": "https://schema.org", "@type": "Service", "name": crumb, "serviceType": service_type,
          "areaServed": {"@type": "City", "name": "Athens" if en else "Αθήνα"}, "provider": SALON_REF, "url": f"{SITE}{path}"}
    if keys:
        ld["offers"] = offers_en(keys) if en else offers(keys)
    page(path, title, desc, body, [ld, faq_ld, crumbs(crumb, path)], extra_head=head, lang=lang, bilingual=en)


EV = "Χτένισμα για εκδήλωση"
BD = "Χτένισμα με βούρτσα"
PHOTO_KEYS = [EV, BD, "Κούρεμα & χτένισμα"]

# /hair-stylist-photoshoot-athens/ (EN)
b2b_page(
    "/hair-stylist-photoshoot-athens/", "Hair stylist for photo shoots in Athens",
    f"Hair Stylist for Photo Shoots in Athens, Thiseio | from €{P(EV)} | Alexandros Hair Salon",
    f"Photo-ready hair in Thiseio, a short walk from Filopappou Hill and the Acropolis views: styling for portrait, couple and fashion shoots from €{P(EV)}. Half and full days on set for photographers and brands.",
    "Hair for photo shoots · Thiseio, Athens",
    "Photo-ready hair, <em>a short walk from the Acropolis views.</em>",
    "Many photo shoots in Athens do not include hair. We style it in our salon in Thiseio, right before your session, and you walk to Filopappou Hill, Apostolou Pavlou or the Ancient Agora. For photographers and brands we also work on set, by the half or full day.",
    [f"Styling from €{P(EV)}", "5′ walk from Thiseio metro", "English spoken", "On-set work by the half or full day"],
    f"""<h2>For your own photo shoot</h2>
<p>Book <strong>Special Occasion Styling</strong> for curls, waves or an up-do, or a <strong>Signature Blowdry</strong> for sleek or bouncy hair. Please come with clean, dry hair and a photo of the look you like. We plan the time with your photographer so the hair is fresh for the first frame.</p>
<h2>For photographers, brands and productions</h2>
<p>We work on lookbooks, editorials, e-commerce and campaigns, in the salon or on set, by the half or full day, with a clear quote before the shoot. Ask us for a quote on WhatsApp or by phone.</p>
<h2>Who does the work</h2>
<p>{esc(EXPERIENCE_EN)}</p>""",
    PHOTO_KEYS,
    [("Is hair included in my photo shoot?", "Usually not: most photographers in Athens work without a hair stylist. Book styling with us before your session; the salon is a short walk from the most photographed spots around the Acropolis."),
     ("How long does it take?", f"Special Occasion Styling takes about 45 minutes and costs €{P(EV)}. A Signature Blowdry takes about 30 minutes and costs €{P(BD)}."),
     ("Can you come to the set or to my hotel?", "Yes, by arrangement. For productions we quote by the half or full day. Message us with the date, place and number of looks."),
     ("Do you speak English?", "Yes. Message us on WhatsApp or Viber at +30 698 131 9000."),
     ("Where is the salon?", "Erisichthonos 3-5, Thiseio, central Athens, about 5 minutes on foot from Thiseio metro station.")],
    [("Greek version", "/xtenisma-fotografisi-athina/"), ("Hair for hotel guests", "/hotel-hair-stylist-athens/"), ("Elopement & wedding hair", "/elopement-hair-athens/"), ("For partners", "/partners/")],
    "en", "Hair styling for photography",
    head=alt_head("/xtenisma-fotografisi-athina/", "/hair-stylist-photoshoot-athens/"),
)

# /xtenisma-fotografisi-athina/ (EL)
b2b_page(
    "/xtenisma-fotografisi-athina/", "Χτένισμα για φωτογράφιση στην Αθήνα",
    f"Κομμωτής για Φωτογράφιση Αθήνα – Θησείο | από €{P(EV)} | Alexandros Hair Salon",
    f"Χτένισμα για φωτογράφιση στο Θησείο από €{P(EV)}. Κομμωτής για lookbook, editorial, e-shop και διαφημιστικές φωτογραφίσεις, στο κομμωτήριο ή στο σετ, με μισή ή πλήρη ημέρα.",
    "Μαλλιά για φωτογράφιση · Θησείο, Αθήνα",
    "Χτένισμα για φωτογράφιση, <em>στο κομμωτήριο ή στο σετ.</em>",
    "Για προσωπικές, επαγγελματικές και φωτογραφίσεις μόδας. Ετοιμάζουμε τα μαλλιά στο κομμωτήριο στο Θησείο, λίγα λεπτά από τον Φιλοπάππου και την Αποστόλου Παύλου, ή ερχόμαστε στο σετ για μισή ή πλήρη ημέρα.",
    [f"Χτένισμα από €{P(EV)}", "Θησείο, 5′ από το μετρό", "Στο σετ με μισή ή πλήρη ημέρα", "Γραπτή προσφορά πριν τη φωτογράφιση"],
    f"""<h2>Για τη δική σου φωτογράφιση</h2>
<p>Κλείσε <strong>Χτένισμα για εκδήλωση</strong> για μπούκλες, κυματισμούς ή πιάσιμο, ή <strong>Χτένισμα με βούρτσα</strong> για ίσιο και λείο ή με όγκο. Καλό είναι να έρθεις με λουσμένα, στεγνά μαλλιά και μια φωτογραφία με αυτό που σου αρέσει. Κανονίζουμε την ώρα μαζί με τον φωτογράφο, ώστε τα μαλλιά να είναι φρέσκα στο πρώτο κάδρο.</p>
<h2>Για φωτογράφους, brands και παραγωγές</h2>
<p>Lookbooks, editorial, φωτογραφίες προϊόντων για e-shop, διαφημιστικές καμπάνιες. Στο κομμωτήριο ή στο σετ, με μισή ή πλήρη ημέρα και γραπτή προσφορά πριν τη φωτογράφιση. Στείλε μας ημερομηνία, χώρο και αριθμό looks στο WhatsApp.</p>
<h2>Ποιος κάνει τη δουλειά</h2>
<p>{esc(EXPERIENCE_EL)}</p>""",
    PHOTO_KEYS,
    [("Πόσο κοστίζει το χτένισμα για φωτογράφιση;", f"Το Χτένισμα για εκδήλωση κοστίζει €{P(EV)} και διαρκεί περίπου 45 λεπτά. Το Χτένισμα με βούρτσα €{P(BD)}, περίπου 30 λεπτά."),
     ("Έρχεστε στο σετ;", "Ναι, κατόπιν συνεννόησης. Για παραγωγές δίνουμε γραπτή προσφορά για μισή ή πλήρη ημέρα, ανάλογα με τα looks και τον χώρο."),
     ("Πώς κλείνω για μια παραγωγή;", "Με μήνυμα στο WhatsApp ή στο Viber στο 698 131 9000, με ημερομηνία, χώρο, ώρες και αριθμό μοντέλων."),
     ("Πού βρίσκεστε;", "Ερυσίχθονος 3-5 στο Θησείο, περίπου 5 λεπτά με τα πόδια από τον σταθμό Θησείο.")],
    [("English version", "/hair-stylist-photoshoot-athens/"), ("Για συνεργάτες", "/synergasies/"), ("Κούρεμα στην Αθήνα", "/kourema-athina/"), ("Όλες οι τιμές", "/services")],
    "el", "Χτένισμα για φωτογράφιση",
    head=alt_head("/xtenisma-fotografisi-athina/", "/hair-stylist-photoshoot-athens/"),
)

# /hotel-hair-stylist-athens/ (EN)
b2b_page(
    "/hotel-hair-stylist-athens/", "Hair salon for hotel guests in Athens",
    f"Hair Salon near the Acropolis for Hotel Guests | Blowdry €{P(BD)} | Alexandros Hair Salon",
    f"Staying near the Acropolis, Thiseio or Monastiraki? Blowdry €{P(BD)}, occasion styling €{P(EV)}, haircut and colour in Thiseio, often the same day. English spoken. Book online or on WhatsApp.",
    "For hotel guests · Thiseio, near the Acropolis",
    "Your hair done before dinner, <em>a short walk from your hotel.</em>",
    "A blowdry before a dinner, an up-do for a wedding, a haircut on a long trip. Our salon in Thiseio is a few minutes from the hotels around the Acropolis, Thiseio, Psyrri and Monastiraki, and we often have free time the same day.",
    [f"Blowdry €{P(BD)}", "Often same-day", "English spoken", "In-room styling by arrangement"],
    """<h2>How to book</h2>
<p>See free times and book online, or message us on WhatsApp with the time you need. If you are staying in a hotel nearby, the front desk can call us at +30 210 346 5554.</p>
<h2>Styling in your room</h2>
<p>For weddings and special occasions we can come to your hotel in Thiseio and the centre of Athens, by arrangement. Message us with the date, the hotel and the number of people.</p>""",
    [BD, EV, "Κούρεμα & χτένισμα", "Νυφικό χτένισμα"],
    [("Can I book for today?", "Often yes. See live free slots in online booking, or message us on WhatsApp."),
     ("How far is the salon from my hotel?", "Erisichthonos 3-5, Thiseio: about 5 minutes on foot from Thiseio metro and a short walk from Monastiraki, Psyrri and the Acropolis area."),
     ("Do you come to hotels?", "For weddings and special occasions, yes, by arrangement. Message us with the date, the hotel and the number of people."),
     ("How do I pay?", "Online when you book, or at the salon. Prices are the same online and at the salon.")],
    [("Hair for photo shoots", "/hair-stylist-photoshoot-athens/"), ("Hair salon in Athens", "/hair-salon-athens/"), ("Book online", "/kratisi/")],
    "en", "Hair salon",
)

# /elopement-hair-athens/ (EN)
TRIAL = "Νυφικό δοκιμαστικό"
BRIDE = "Νυφικό χτένισμα"
b2b_page(
    "/elopement-hair-athens/", "Elopement and wedding hair in Athens",
    f"Elopement & Wedding Hair in Athens | Bridal Hair €{P(BRIDE)} | Alexandros Hair Salon",
    f"Bridal hair for weddings and elopements in Athens: trial €{P(TRIAL)}, bridal hair €{P(BRIDE)} in our Thiseio salon, near Filopappou Hill and the Acropolis views, or on location by arrangement.",
    "Weddings & elopements · Athens",
    "Bridal hair in Athens, <em>near the Acropolis views.</em>",
    "For couples who marry or elope in Athens. We try your bridal hair together, keep notes, and on the day we style it in our salon in Thiseio, a short walk from Filopappou Hill, or at your hotel or venue.",
    [f"Trial €{P(TRIAL)}", f"Bridal hair €{P(BRIDE)}", "Outside the salon: +€40", "English spoken"],
    """<h2>How it works</h2>
<p>First the <strong>bridal trial</strong>: we try the hairstyle together, with your veil and accessories, and keep notes. On the day, the <strong>bridal hair</strong> is done as trialled, in the salon or on location. Photographers and planners can contact us directly to plan the timing.</p>""",
    [TRIAL, BRIDE],
    [("Do I need a trial?", "Yes. The bridal hair is booked only after a trial, so the day runs on time and as you imagined it."),
     ("Can you come to our hotel or venue?", "Yes, in Athens, by arrangement. The bridal hair outside the salon costs €40 more."),
     ("How do we book?", "Message us on WhatsApp or Viber at +30 698 131 9000 with the date and the place. Bridal services are not booked online.")],
    [("Hair for photo shoots", "/hair-stylist-photoshoot-athens/"), ("For planners & photographers", "/partners/"), ("Hair salon in Athens", "/hair-salon-athens/")],
    "en", "Bridal hair styling",
)

# /synergasies/ (EL) και /partners/ (EN): συνεργασίες + έτοιμο κείμενο credit για backlink
CREDIT = {
    "el": [("Σε φωτογραφίες, άρθρα και site", '<a href="https://alexandroshairsalon.gr/">Μαλλιά: Alexandros Hair Salon, Θησείο</a>'),
           ("Σε σελίδα ξενοδοχείου ή οδηγό επισκεπτών", '<a href="https://alexandroshairsalon.gr/hotel-hair-stylist-athens/">Alexandros Hair Salon – κομμωτήριο στο Θησείο</a>'),
           ("Σε φωτογράφιση γάμου", '<a href="https://alexandroshairsalon.gr/elopement-hair-athens/">Hair: Alexandros Hair Salon, Athens</a>')],
    "en": [("Photos, articles and websites", '<a href="https://alexandroshairsalon.gr/">Hair: Alexandros Hair Salon, Athens</a>'),
           ("Hotel pages and guest guides", '<a href="https://alexandroshairsalon.gr/hotel-hair-stylist-athens/">Alexandros Hair Salon – hair salon in Thiseio</a>'),
           ("Wedding features", '<a href="https://alexandroshairsalon.gr/elopement-hair-athens/">Hair: Alexandros Hair Salon, Athens</a>')],
}


def partners_page(lang):
    en = lang == "en"
    path = "/partners/" if en else "/synergasies/"
    t = (lambda a, b: b if en else a)
    snippets = "".join(f'<h3 style="margin-top:18px">{esc(n)}</h3><pre style="white-space:pre-wrap;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px;font-size:13px">{esc(code)}</pre>' for n, code in CREDIT[lang])
    prose = f"""<h2>{t("Με ποιους δουλεύουμε", "Who we work with")}</h2>
<p>{t("Φωτογράφους, ξενοδοχεία και καταλύματα, wedding planners, brands ρούχων, πρακτορεία μοντέλων και σχολές μόδας και φωτογραφίας.", "Photographers, hotels and short-stay hosts, wedding planners, fashion brands, model agencies, and fashion and photography schools.")}</p>
<h2>{t("Τι προσφέρουμε", "What we offer")}</h2>
<p>{t(f"Χτένισμα για φωτογράφιση στο κομμωτήριο από €{P(EV)}, για τους πελάτες σας στη δημόσια τιμή του τιμοκαταλόγου. Μαλλιά στο σετ με μισή ή πλήρη ημέρα, με γραπτή προσφορά πριν τη δουλειά. Νυφικό χτένισμα στο κομμωτήριο ή σε ξενοδοχείο.", f"Photo-ready styling in the salon from €{P(EV)}, at our public price for your clients. Hair on set by the half or full day, with a written quote before the job. Bridal hair in the salon or at the hotel.")}</p>
<p>{esc(EXPERIENCE_EN if en else EXPERIENCE_EL)}</p>
<h2>{t("Αν δείξετε τη δουλειά μας", "If you show our work")}</h2>
<p>{t("Αντιγράψτε όποιο από τα παρακάτω ταιριάζει στη σελίδα σας. Στο Instagram αρκεί ένα tag στον λογαριασμό του κομμωτηρίου. Θα δείξουμε κι εμείς τη δική σας δουλειά, με σύνδεσμο προς εσάς.", "Copy whichever line fits your page. On Instagram, a tag to the salon’s account is enough. We show your work too, with a link back to you.")}</p>
{snippets}
<h2>{t("Επικοινωνία", "Contact")}</h2>
<p>{t("WhatsApp ή Viber: 698 131 9000 · Κομμωτήριο: 210 346 5554 · Ερυσίχθονος 3-5, Θησείο.", "WhatsApp or Viber: +30 698 131 9000 · Salon: +30 210 346 5554 · Erisichthonos 3-5, Thiseio, Athens.")}</p>"""
    faqs = [(t("Πληρώνετε προμήθεια για συστάσεις;", "Do you pay a referral commission?"),
             t("Όχι χρηματική. Ανταποδίδουμε με προβολή: σύνδεσμο, αναφορά και φωτογραφίες της δουλειάς σας.", "No cash commission. We return the favour with exposure: a link, a mention and photos of your work.")),
            (t("Πώς ζητάμε προσφορά για παραγωγή;", "How do we ask for a quote?"),
             t("Στείλτε στο WhatsApp ημερομηνία, χώρο, ώρες και αριθμό looks. Απαντάμε με γραπτή προσφορά.", "Send the date, place, hours and number of looks on WhatsApp. We reply with a written quote."))]
    b2b_page(path, t("Συνεργασίες", "Partners"),
             t("Συνεργασίες με φωτογράφους, ξενοδοχεία & brands | Alexandros Hair Salon", "Partners: photographers, hotels & brands | Alexandros Hair Salon"),
             t("Κομμωτής για φωτογράφους, ξενοδοχεία, wedding planners και brands στο Θησείο, Αθήνα: χτένισμα, μαλλιά στο σετ, νυφικά. Όροι συνεργασίας και έτοιμο κείμενο credit.",
               "Hair for photographers, hotels, wedding planners and brands in Thiseio, Athens: styling, on-set hair, bridal. How we work together and a ready-made credit line."),
             t("Συνεργασίες · Θησείο, Αθήνα", "Partners · Thiseio, Athens"),
             t("Συνεργασίες, <em>με απλούς όρους.</em>", "Working together, <em>on simple terms.</em>"),
             t("Για όσους φέρνουν πελάτες ή χρειάζονται μαλλιά για τη δουλειά τους: φωτογράφους, ξενοδοχεία, wedding planners και brands.", "For those who send us clients or need hair for their work: photographers, hotels, wedding planners and brands."),
             [t("Δημόσια τιμή για τους πελάτες σας", "Public price for your clients"), t("Γραπτή προσφορά για παραγωγές", "Written quotes for productions"), t("Θησείο, 5′ από το μετρό", "5′ from Thiseio metro")],
             prose, [], faqs,
             [(t("Χτένισμα για φωτογράφιση", "Hair for photo shoots"), "/xtenisma-fotografisi-athina/" if not en else "/hair-stylist-photoshoot-athens/"),
              (t("English version", "Ελληνικά"), "/partners/" if not en else "/synergasies/")],
             lang, t("Συνεργασίες κομμωτηρίου", "Salon partnerships"), head=alt_head("/synergasies/", "/partners/"),
             share=share_html(path, path.strip("/"), t("Κομμωτής για φωτογραφίσεις, ξενοδοχεία και γάμους στο Θησείο", "Hair for photo shoots, hotels and weddings in Athens"),
                              t("Alexandros Hair Salon, Θησείο: κομμωτής για φωτογραφίσεις, ξενοδοχεία, γάμους και παραγωγές, στο κομμωτήριο ή στο σετ.",
                                "Alexandros Hair Salon, Thiseio, Athens: hair for photo shoots, hotels, weddings and productions, in the salon or on set."),
                              t("Αποστολή σε συνεργάτη", "Send to a colleague"), lang))


partners_page("el")
partners_page("en")


page("/kratisi/", "Κράτηση ραντεβού online | Alexandros Hair Salon – Κομμωτήριο Θησείο",
     "Κλείσε online ραντεβού στο Alexandros Hair Salon, Θησείο: κούρεμα, χτένισμα, βαφή, balayage. Βλέπεις ελεύθερες ώρες, τιμή και διάρκεια.",
     kratisi_body, kratisi_ld, extra_head=kratisi_head, mbar=False, bilingual=True)


# ---------- /syxnes-erotiseis/ : ποια βαφή ταιριάζει, ποσότητες, τι δεν συνδυάζεται (τιμές από το menu.json) ----------
def O(name, label=None):
    """Τιμή μίας επιλογής (ή της μοναδικής) σε μορφή €39."""
    opts = MENU[name][1]
    p = next(pp for l, _, pp in opts if label is None or l == label)
    return f"€{p:g}"

FAQ_GROUPS = [
 ("Χρώμα", [
  ("Θέλω να καλύψω τα λευκά στη ρίζα. Τι μου ταιριάζει;",
   f"Η Βαφή ρίζας ({O('Βαφή ρίζας','Κανονική')}), με Farcom ή Majirel της L’Oréal. Αν βάφεσαι κάθε μήνα, η Μηνιαία ρίζα ({O('Βαφή ρίζας','Μηνιαία ρίζα')})."),
  ("Με ενοχλεί η μυρωδιά ή έχω ευαίσθητο δέρμα.",
   f"Η Βαφή ρίζας χωρίς αμμωνία ({O('Βαφή ρίζας','Χωρίς αμμωνία')}, μηνιαία {O('Βαφή ρίζας','Χωρίς αμμωνία · μηνιαία ρίζα')}), με INOA της L’Oréal ή Redken Color Gels Oils."),
  ("Τα μήκη μου ξεθώριασαν.",
   f"Η Βαφή ρίζας & ρεφλέ ({O('Βαφή ρίζας & ρεφλέ στα μήκη','Έως τους ώμους')} έως τους ώμους, {O('Βαφή ρίζας & ρεφλέ στα μήκη','Κάτω από τους ώμους')} πιο κάτω). Στα μήκη βάζουμε όξινο ρεφλέ χωρίς αμμωνία (Dia Light ή Redken Shades EQ), που δίνει τόνο και λάμψη, δεν ξανοίγει τα μαλλιά και δεν καλύπτει πλήρως τα λευκά. Αν τα μήκη θέλουν περισσότερο χρώμα, ημιμόνιμη Dia Color, στην ίδια τιμή."),
  ("Θέλω άλλο χρώμα ή έχω λευκά και στα μήκη.",
   f"Η Βαφή σε όλο το μαλλί, μόνιμη ({O('Βαφή σε όλο το μαλλί','Μόνιμη')}): χρώμα από τη ρίζα ως τις άκρες, με πλήρη κάλυψη λευκών."),
  ("Θέλω κάτι πιο ήπιο από τη μόνιμη βαφή.",
   f"Η Βαφή σε όλο το μαλλί, ημιμόνιμη ({O('Βαφή σε όλο το μαλλί','Ημιμόνιμη')}), με Dia Color της L’Oréal. Καλύπτει έως 70% των λευκών, κρατά έως 6 εβδομάδες και φεύγει σταδιακά, χωρίς έντονη γραμμή στη ρίζα. Ταιριάζει και σε ταλαιπωρημένα μαλλιά."),
  ("Τι σημαίνει μόνιμη, ημιμόνιμη και ρεφλέ;",
   "Μόνιμη βαφή (Farcom Expertia, Majirel, INOA, Redken Color Gels Oils): αλκαλική, μπαίνει μέσα στην τρίχα, καλύπτει πλήρως τα λευκά και μένει ως το κούρεμα· όταν μεγαλώνει, φαίνεται η ρίζα. Ημιμόνιμη (Dia Color): πιο ήπια, καλύπτει έως 70% των λευκών και φεύγει σε περίπου 6 εβδομάδες. Ρεφλέ (Dia Light, Redken Shades EQ): όξινο, χωρίς αμμωνία, δίνει τόνο και λάμψη χωρίς να ξανοίγει."),
  ("Πόσο χρώμα περιλαμβάνει κάθε βαφή;",
   "Βαφή ρίζας έως 45 g. Βαφή σε όλο το μαλλί έως 60 g ή 60 ml. Ρεφλέ έως 60 ml για μαλλιά έως τους ώμους ή 90 ml για πιο μακριά. Βαφή ρίζας & ρεφλέ: ρίζα έως 45 g και ρεφλέ 60 ή 90 ml. Οι ποσότητες είναι πριν από το οξειδωτικό."),
  ("Έχω πολλά ή μακριά μαλλιά. Θα πληρώσω παραπάνω;",
   f"Μόνο αν χρειαστεί περισσότερο χρώμα από όσο περιλαμβάνει η υπηρεσία: {O('+ Επιπλέον χρώμα')} για κάθε 30 g βαφής ή 30 ml ρεφλέ. Θα σου το πούμε πριν το ανοίξουμε. Για παράδειγμα, βαφή σε όλο με 90 g κοστίζει €62."),
  ("Έχω λίγα ή λεπτά μαλλιά.", "Πληρώνεις την ίδια τιμή και δεν θα χρειαστείς ποτέ επιπλέον χρώμα."),
  ("Πότε ισχύει η Μηνιαία ρίζα;",
   "Όταν η επόμενη βαφή ρίζας γίνεται μέσα σε 30 ημέρες από την προηγούμενη σε εμάς. Στο ταμείο σού δίνουμε ένα καρτελάκι με την ημερομηνία."),
 ]),
 ("Χτένισμα", [
  ("Τι είναι το Εβδομαδιαίο χτένισμα με μάσκα;",
   f"Για όσες θέλουν να είναι περιποιημένες όλη την εβδομάδα, στη δουλειά και στα ραντεβού τους, χωρίς να το σκέφτονται. Λούσιμο, μάσκα και χτένισμα με βούρτσα, την ίδια μέρα και ώρα κάθε εβδομάδα: κοντά {O('Εβδομαδιαίο χτένισμα με μάσκα','Κοντά')}, μεσαία {O('Εβδομαδιαίο χτένισμα με μάσκα','Μεσαία')}, μακριά {O('Εβδομαδιαίο χτένισμα με μάσκα','Μακριά')} (χωριστά θα ήταν €39). Δευτέρα έως Πέμπτη, όταν υπάρχει ελεύθερη ώρα, και όταν το προηγούμενο χτένισμα έγινε σε εμάς τις τελευταίες 8 ημέρες."),
  ("Πόσο κρατά το χτένισμα;",
   "Το χτένισμα με βούρτσα, και το εβδομαδιαίο, κρατά συνήθως 2–3 ημέρες. Εξαρτάται από τα μαλλιά, την υγρασία και το αν τα μαζεύεις τη νύχτα."),
  ("Μπούκλες ή πιάσιμο σε πολλά ή πολύ μακριά μαλλιά;",
   "Οι μπούκλες με σίδερο και το πιάσιμο κρατούν περισσότερο σε μαλλιά λουσμένα από την προηγούμενη μέρα. Σε λεπτά ή πιο κοντά μαλλιά δεν χρειάζεται."),
  ("Υπάρχει λούσιμο και γρήγορο φορμάρισμα χωρίς βαφή;",
   f"Ναι, το Λούσιμο & γρήγορο φορμάρισμα, {O('Λούσιμο & γρήγορο φορμάρισμα')}. Κλείνεται τηλεφωνικά στο {PHONE_TXT}."),
  ("Περιλαμβάνεται λούσιμο;",
   "Σε κάθε υπηρεσία γράφουμε αν περιλαμβάνει λούσιμο. Το περιλαμβάνουν όλα τα κουρέματα (εκτός από το ανδρικό με μηχανή), τα χτενίσματα με βούρτσα και όλες οι βαφές, τα ρεφλέ και οι ανταύγειες."),
 ]),
 ("Τιμές", [
  ("Τι δεν συνδυάζεται;",
   "Η Μηνιαία ρίζα και το Εβδομαδιαίο χτένισμα είναι ήδη χαμηλότερες τιμές για τακτικές πελάτισσες. Δεν συνδυάζονται με άλλη έκπτωση ή προσφορά, όπως οι εκπτώσεις της Treatwell σε ώρες χαμηλής κίνησης ή τελευταίας στιγμής."),
  ("Τι δεν κάνουμε;",
   "Δεν φρεσκάρουμε τα μήκη με τα υπόλοιπα της μόνιμης βαφής: για τα μήκη υπάρχει το ρεφλέ ή η ημιμόνιμη βαφή, που είναι πιο ήπια. Δεν ανοίγουμε επιπλέον χρώμα χωρίς να σου το πούμε. Δεν υποσχόμαστε πλήρη κάλυψη λευκών με ρεφλέ."),
  ("Κάτι δεν σου άρεσε;",
   "Μπορείς να μας το πεις ανώνυμα στη σελίδα alexandroshairsalon.gr/gnomi, χωρίς όνομα, τηλέφωνο ή email."),
 ]),
]
_faq_all = [qa for _, g in FAQ_GROUPS for qa in g]
_faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
    {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in _faq_all]}
_faq_body = """
<section class="hero">
  <span class="eyebrow">Συχνές ερωτήσεις</span>
  <h1>Ξέρεις την τιμή <em>πριν καθίσεις.</em></h1>
  <p class="lead">Ποια βαφή σού ταιριάζει, πόσο χρώμα περιλαμβάνει κάθε υπηρεσία, τι γίνεται με τα πολλά ή τα μακριά μαλλιά και τι δεν συνδυάζεται. Ό,τι δεν βρεις εδώ, μπορείς πάντα να το ρωτήσεις πριν ξεκινήσουμε.</p>
  <div class="cta"><a class="btn gold" href="/services">Όλες οι τιμές</a><a class="btn ghost" href="tel:""" + PHONE + """">Κλήση """ + PHONE_TXT + """</a></div>
</section>
""" + "".join(f'<section class="block"><h2>{esc(t)}</h2>' + "".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in g) + "</section>" for t, g in FAQ_GROUPS) + """
<section class="block"><p class="links"><a href="/services">Όλες οι τιμές</a><a href="/vafi-mallion-athina/">Βαφή μαλλιών</a><a href="/gnomi/">Η γνώμη σου, ανώνυμα</a></p></section>
"""
page("/syxnes-erotiseis/", "Συχνές ερωτήσεις: βαφή, ποσότητες, τιμές | Alexandros Hair Salon – Θησείο",
     "Ποια βαφή σού ταιριάζει (μόνιμη, ημιμόνιμη, ρεφλέ), πόσο χρώμα περιλαμβάνει κάθε υπηρεσία, Μηνιαία ρίζα, εβδομαδιαίο χτένισμα και τι δεν συνδυάζεται.",
     _faq_body, [_faq_ld, crumbs("Συχνές ερωτήσεις", "/syxnes-erotiseis/")])


# ---------- /gnomi/ : ανώνυμη γνώμη, χωρίς κανένα προσωπικό στοιχείο (αποστολή με EmailJS, χωρίς αποθήκευση στο site) ----------
GNOMI_TEMPLATE = "template_gnomi"
_gn_body = """
<section class="hero">
  <span class="eyebrow">Βοηθήστε μας να γίνουμε καλύτεροι</span>
  <h1>Η γνώμη σου, <em>ανώνυμα.</em></h1>
  <p class="lead">Δεν ζητάμε όνομα, τηλέφωνο ή email. Το διαβάζει μόνο ο Αλέξανδρος, για να βελτιώσει την εμπειρία σου και τις υπηρεσίες μας. Μας βοηθάει· δεν το κρίνουμε.</p>
</section>
<section class="block">
<form id="gn" class="gn" novalidate>
  <fieldset><legend>Τι θα ήθελες να μας πεις;</legend>
    <label><input type="radio" name="kind" value="Κάτι δεν πήγε καλά" checked> Κάτι δεν πήγε καλά</label>
    <label><input type="radio" name="kind" value="Κάτι μου άρεσε"> Κάτι μου άρεσε</label>
    <label><input type="radio" name="kind" value="Έχω μια ιδέα"> Έχω μια ιδέα</label>
  </fieldset>
  <label for="gn-msg" class="gn-l">Το μήνυμά σου</label>
  <textarea id="gn-msg" name="message" rows="7" maxlength="3000" required></textarea>
  <input type="text" name="website" tabindex="-1" autocomplete="off" class="gn-hp" aria-hidden="true">
  <button type="submit" class="btn gold">Αποστολή</button>
  <p id="gn-st" class="gn-st" role="status" aria-live="polite"></p>
</form>
</section>
<style>.gn fieldset{border:0;padding:0;margin:0 0 18px}.gn legend{font-weight:700;margin-bottom:10px}.gn label{display:block;margin:8px 0;font-size:17px}
.gn-l{font-weight:700}.gn textarea{width:100%;font:inherit;font-size:17px;padding:12px;border:1px solid var(--line);border-radius:10px;background:transparent;color:inherit;margin:8px 0 16px}
.gn-hp{position:absolute;left:-9999px}.gn-st{margin-top:14px;font-size:17px}</style>
<script>
(function(){var f=document.getElementById('gn'),st=document.getElementById('gn-st');
f.addEventListener('submit',function(e){e.preventDefault();var m=f.message.value.trim();
if(f.website.value){return;}
if(m.length<3){st.textContent='Το κουτί είναι άδειο. Μπορείς να γράψεις όσα λίγα θέλεις.';return;}
var b=f.querySelector('button');b.disabled=true;st.textContent='Αποστολή…';
fetch('https://api.emailjs.com/api/v1.0/email/send',{method:'POST',headers:{'Content-Type':'application/json'},
body:JSON.stringify({service_id:'service_nul8u7q',template_id:'""" + GNOMI_TEMPLATE + """',user_id:'XL7dj9dSLwxsDvNtb',
template_params:{kind:f.kind.value,message:m}})}).then(function(r){if(!r.ok)throw 0;
f.reset();st.textContent='Ευχαριστούμε. Το μήνυμά σου έφτασε.';}).catch(function(){
st.textContent='Δεν στάλθηκε. Μπορείς να δοκιμάσεις ξανά σε λίγο.';}).then(function(){b.disabled=false;});});})();
</script>
"""
page("/gnomi/", "Η γνώμη σου, ανώνυμα | Alexandros Hair Salon – Θησείο",
     "Μπορείς να μας πεις ανώνυμα τι δεν πήγε καλά ή τι σου άρεσε. Δεν ζητάμε όνομα, τηλέφωνο ή email.",
     _gn_body, [crumbs("Η γνώμη σου", "/gnomi/")])
