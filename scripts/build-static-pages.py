#!/usr/bin/env python3
"""Builds the static pages in public/: /kratisi/ (Treatwell widget) and the SEO service pages.

Run from the repo root:  python3 scripts/build-static-pages.py
Prices come from the MENU below. Keep it the same as Treatwell and src/data/menu.js.
"""
import json
import re
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


def _anchor(name):
    """Σύνδεσμος υπηρεσίας στο /services (ίδιο με svc_anchor())."""
    en = next(x["name"]["en"] for c in _MENU_JSON for x in c["services"] if x["name"]["el"] == name)
    return re.sub(r"[^a-z0-9]+", "-", en.lower()).strip("-")


BOOKS = {s["name"]["el"]: [book_url(o) for o in s["options"]] for c in _MENU_JSON for s in c["services"]}
DESC = {s["name"]["el"]: s.get("desc", {}).get("el", "") for c in _MENU_JSON for s in c["services"]}


def OP(name, label):
    """Τιμή συγκεκριμένης επιλογής σε μορφή €18 (διαθέσιμη πριν από τη O())."""
    return f"€{next(p for l, _, p in MENU[name][1] if l == label):g}"


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
.il{color:var(--gold);font-weight:700;text-decoration:underline;text-underline-offset:3px}.mbar{gap:10px}.mbar .mb2{display:flex;flex-direction:column;line-height:1.15}.mbar .mb2 small{font-size:11.5px;font-weight:500;color:var(--muted)}.mbar .mb2 b{font-size:14px}.mbar span{white-space:nowrap;font-size:12.5px}.mbar .btn{white-space:nowrap;padding:0 16px}
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
        inner = f'<span>{esc(o) + " · " if o else ""}<span class="d">{esc(d)}</span></span><span class="p">{eur(p)}{" →" if url else " ☎"}</span>'
        if url:
            return f'<li><a class="bk" href="{esc(url)}" target="_blank" rel="noopener" aria-label="Κράτηση: {esc(name)}{" · " + esc(o) if o else ""}">{inner}</a></li>'
        return f'<li><a class="bk" href="/services#{_anchor(key)}" aria-label="Κράτηση με κλήση ή μήνυμα: {esc(name)}{" · " + esc(o) if o else ""}">{inner}</a></li>'
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


# Ελληνικές σελίδες SEO χωρίς διακόπτη γλώσσας: το «EN» οδηγεί στην αντίστοιχη αγγλική σελίδα
EN_SISTER = {"/kourema-athina/": "/hair-salon-athens/", "/vafi-mallion-athina/": "/hair-salon-athens/",
             "/balayage-athina/": "/hair-salon-athens/", "/synergasies/": "/partners/",
             "/xtenisma-fotografisi-athina/": "/hair-stylist-photoshoot-athens/",
             "/dorean-kourema-athina/": "/hair-model-athens/", "/montelo-vafi-balayage-athina/": "/hair-model-athens/"}


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
<a class="skip" href="#main" data-en="Skip to content">Μετάβαση στο περιεχόμενο</a>
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
    {'<button type="button" class="lang" data-lang-toggle aria-label="Switch to English">EN</button>' if bilingual else (f'<a class="lang" href="{EN_SISTER[path]}" hreflang="en" lang="en" aria-label="English version" style="display:inline-flex;align-items:center;justify-content:center;text-decoration:none">EN</a>' if path in EN_SISTER else '')}
  </nav>
</div></header>
<main class="wrap" id="main" tabindex="-1">
{body}
</main>
<footer class="bottom"><div class="wrap">
  <p><strong>Alexandros Hair Salon</strong> · {ADDRESS} · <a href="tel:{PHONE}">{PHONE_TXT}</a> · <a href="mailto:info@alexandroshairsalon.gr">info@alexandroshairsalon.gr</a> · <a href="tel:+306981319000" data-en="Call mobile">Κλήση κινητού</a> · <a href="https://wa.me/306981319000" target="_blank" rel="noopener">WhatsApp</a> · <a href="viber://chat?number=%2B306981319000">Viber</a> · <a href="{GOOGLE}" data-maps target="_blank" rel="noopener" data-en="Hours on Google">Ωράριο στο Google</a> · <a href="{DIRECTIONS}" data-maps target="_blank" rel="noopener" data-en="Directions">Οδηγίες</a></p>
  <p class="tsw" role="radiogroup" aria-label="Εμφάνιση"><span data-en="Theme">Εμφάνιση</span><button type="button" role="radio" data-mode="auto" title="Όπως η συσκευή σου" data-en="Auto">Αυτόματο</button><button type="button" role="radio" data-mode="light" data-en="Light">Ανοιχτό</button><button type="button" role="radio" data-mode="dark" data-en="Dark">Σκούρο</button></p>
  <p class="links"><a href="/" data-en="Home">Αρχική</a><a href="/services" data-en="All prices">Όλες οι τιμές</a><a href="/kourema-athina/">Κούρεμα στην Αθήνα</a><a href="/vafi-mallion-athina/">Βαφή μαλλιών στην Αθήνα</a><a href="/balayage-athina/">Balayage στην Αθήνα</a><a href="/dorean-kourema-athina/">Δωρεάν κούρεμα (μοντέλο)</a><a href="/fotografies" data-en="Photos">Φωτογραφίες</a><a href="/kratisi/" data-en="Book online">Κράτηση online</a><a href="/hair-salon-athens/" hreflang="en">Hair salon in Athens (English)</a><a href="/xtenisma-fotografisi-athina/">Χτένισμα για φωτογράφιση</a><a href="/synergasies/">Συνεργασίες</a><a href="/syxnes-erotiseis/" data-en="FAQ">Συχνές ερωτήσεις</a><a href="/dorokarta/" data-en="Gift card">Δωροκάρτα</a><a href="/gnomi/" data-en="Your feedback">Η γνώμη σου</a><a href="/shop">Shop</a></p>
</div></footer>
{'<div class="mbar"><span class="mb2"><small data-en="Book online">Online κράτηση</small><b data-en="in 1 minute">σε 1 λεπτό</b></span><a class="btn gold" href="/kratisi/" data-en="Book now">Κλείσε ραντεβού</a></div>' if mbar else ''}
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


def linkify(t):
    """Το «alexandroshairsalon.gr/κάτι» μέσα σε κείμενο γίνεται σύνδεσμος που πατιέται."""
    return re.sub(r"alexandroshairsalon\.gr/([a-z-]+)", r'<a class="il" href="/\1">alexandroshairsalon.gr/\1</a>', t)


def faq_block(faqs):
    items = "".join(f"<details><summary>{esc(q)}</summary><p>{linkify(esc(a))}</p></details>" for q, a in faqs)
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
CUTS = ["Κούρεμα χωρίς στέγνωμα", "Κούρεμα & στέγνωμα", "Κούρεμα & φορμάρισμα", "Κούρεμα & χτένισμα"]
service_page(
    "/kourema-athina/", "Κούρεμα στην Αθήνα",
    f"Κούρεμα Αθήνα – Θησείο | Γυναικείο από €{P(CUTS[0])} | Alexandros Hair Salon",
    f"Γυναικείο κούρεμα από €{P(CUTS[0])}, ανδρικό {OP('Ανδρικό κούρεμα','Κλασικό')} (μηνιαίο {OP('Ανδρικό κούρεμα','Μηνιαίο')}), παιδικό €{P('Παιδικό κούρεμα')} στο Θησείο, Αθήνα. Pixie, bob, butterfly, curtain bangs. Από το 1992. Κλείσε online.",
    "Κούρεμα · Θησείο, κέντρο Αθήνας",
    "Κούρεμα στην Αθήνα, <em>με τρεις δεκαετίες εμπειρίας.</em>",
    "Το κούρεμα είναι σχήμα πάνω στο πρόσωπο: μπορεί να το αναδείξει ή να το κρύψει. Κάθε πρόσωπο έχει όμορφα χαρακτηριστικά· τα βρίσκουμε και σχεδιάζουμε το κούρεμα που τα αναδεικνύει, μαζί με το σωστό styling. Γυναικείο, ανδρικό και παιδικό κούρεμα στο Θησείο, από το 1992.",
    [f"Γυναικείο από €{P(CUTS[0])}"] + COMMON_FACTS,
    """<h2>Πώς δουλεύουμε το κούρεμα</h2>
<p>Ξεκινάμε με λίγη κουβέντα: τι σε ενοχλεί σήμερα, πώς χτενίζεσαι στο σπίτι και πόσο συχνά θέλεις να έρχεσαι. Μετά προτείνουμε γραμμή και μήκος που θα στέκονται σωστά και όταν τα φορμάρεις μόνη σου.</p>
<p>Κάνουμε κλασικά και σύγχρονα κουρέματα: pixie, mullet, bob και lob, butterfly, curtain bangs, φιλάρισμα για όγκο ή ελάφρυνση, καθαρό φρεσκάρισμα άκρων.</p>
<h2>Πώς θέλεις να φύγεις;</h2>
<p>Μία τιμή για κάθε μήκος· διαλέγεις μόνο το τέλος. <strong>Χωρίς στέγνωμα</strong>: τα μαλλιά στεγνώνουν φυσικά, ιδανικό για σγουρά. <strong>Στέγνωμα</strong>: με τα χέρια, με πιστολάκι ή φυσούνα, για φυσικό αποτέλεσμα. <strong>Φορμάρισμα</strong>: πιστολάκι και βούρτσα για όγκο και φόρμα. <strong>Χτένισμα</strong>: πλήρες, ίσιο και λείο ή με όγκο και κίνηση, που κρατά συνήθως 2–3 ημέρες.</p>""",
    CUTS + ["Φράτζα & αφέλειες", "Ανδρικό κούρεμα", "Ανδρικό με μηχανή", "Παιδικό κούρεμα"],
    [("Πόσο κοστίζει ένα γυναικείο κούρεμα;", f"€{P(CUTS[0])} με φυσικό στέγνωμα, €{P(CUTS[1])} με στέγνωμα, €{P(CUTS[2])} με φορμάρισμα και €{P(CUTS[3])} με πλήρες χτένισμα. Ίδια τιμή για όλα τα μήκη."),
     ("Κάνετε και ανδρικά ή παιδικά κουρέματα;", f"Ναι. Ανδρικό κούρεμα {OP('Ανδρικό κούρεμα','Κλασικό')} (μηνιαίο {OP('Ανδρικό κούρεμα','Μηνιαίο')}), με μηχανή €{P('Ανδρικό με μηχανή')} και παιδικό (έως 12 ετών) €{P('Παιδικό κούρεμα')}."),
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
    f"Βαφή ρίζας & κάλυψη λευκών €{ROOT_OPTS['Κλασική']}, Μηνιαία ρίζα €{ROOT_OPTS['Μηνιαία ρίζα']}, χωρίς αμμωνία €{ROOT_OPTS['Χωρίς αμμωνία']} (INOA, Redken). Ρίζα & ρεφλέ από €{P('Βαφή ρίζας & ρεφλέ στα μήκη')}. Κομμωτήριο στο Θησείο, Αθήνα. Κλείσε online.",
    "Χρώμα · L’Oréal Professionnel & Redken",
    "Βαφή μαλλιών στην Αθήνα, <em>με L’Oréal &amp; Redken.</em>",
    "Κάλυψη λευκών στη ρίζα, βαφή χωρίς αμμωνία, ρεφλέ για λάμψη και τόνο. Μία τιμή για κάθε υπηρεσία, με συγκεκριμένη ποσότητα χρώματος, ώστε να ξέρεις από πριν τι πληρώνεις.",
    [f"Βαφή ρίζας από €{P(ROOT)}"] + COMMON_FACTS,
    f"""<h2>Βαφή ρίζας και Μηνιαία ρίζα</h2>
<p><strong>Βαφή ρίζας (€{ROOT_OPTS['Κλασική']})</strong>: μόνιμη βαφή με Farcom ή Majirel της L’Oréal Professionnel, για σίγουρη κάλυψη λευκών. <strong>Χωρίς αμμωνία (€{ROOT_OPTS['Χωρίς αμμωνία']})</strong>: INOA της L’Oréal Professionnel ή Redken. Και οι δύο περιλαμβάνουν λούσιμο και στέγνωμα.</p>
<p><strong>Μηνιαία ρίζα (€{ROOT_OPTS['Μηνιαία ρίζα']}, χωρίς αμμωνία €{ROOT_OPTS['Χωρίς αμμωνία · μηνιαία ρίζα']})</strong>: όταν η επόμενη βαφή ρίζας γίνεται μέσα σε 30 ημέρες από την προηγούμενη σε εμάς. Στο ταμείο παίρνεις καρτελάκι με την ημερομηνία.</p>
<h2>Ρίζα + ρεφλέ</h2>
<p>Με το <strong>ρεφλέ (gloss)</strong> στα μήκη το χρώμα δένει από τη ρίζα ως τις άκρες και τα μαλλιά αποκτούν λάμψη. Είναι ξεχωριστή εφαρμογή στα μήκη, 30–45 ml για μαλλιά έως τους ώμους ή έως 60 ml κάτω από τους ώμους, όχι απλό τράβηγμα της βαφής της ρίζας. Για μεγάλη αλλαγή ή διόρθωση προηγούμενου χρώματος ξεκινάμε με διάγνωση, ώστε να ξέρεις πλάνο και τιμή πριν από οτιδήποτε.</p>""",
    [ROOT, "Βαφή ρίζας & ρεφλέ στα μήκη", "Ρεφλέ", "Βαφή σε όλο το μαλλί", "Ξάνοιγμα ρίζας & ρεφλέ", "+ Επιπλέον χρώμα", "Διόρθωση χρώματος"],
    [("Πόσο κοστίζει η βαφή ρίζας;", f"€{ROOT_OPTS['Κλασική']}, ή €{ROOT_OPTS['Χωρίς αμμωνία']} χωρίς αμμωνία, με λούσιμο και στέγνωμα. Όταν η επόμενη βαφή ρίζας γίνεται μέσα σε 30 ημέρες, η Μηνιαία ρίζα είναι €{ROOT_OPTS['Μηνιαία ρίζα']} (χωρίς αμμωνία €{ROOT_OPTS['Χωρίς αμμωνία · μηνιαία ρίζα']})."),
     ("Έχετε βαφή χωρίς αμμωνία;", f"Ναι: INOA της L’Oréal Professionnel ή Redken, €{ROOT_OPTS['Χωρίς αμμωνία']} (Μηνιαία ρίζα €{ROOT_OPTS['Χωρίς αμμωνία · μηνιαία ρίζα']})."),
     FAQ_WHEN,
     ("Πόση ώρα διαρκεί η βαφή ρίζας;", "Περίπου μία ώρα μαζί με την αναμονή. Με ρεφλέ στα μήκη από μία ώρα έως μία ώρα και δέκα λεπτά."),
     ("Πώς κλείνω ραντεβού για βαφή;", "Online στο alexandroshairsalon.gr/kratisi, όπου βλέπεις ελεύθερες ώρες, ή στο 210 346 5554. Πληρώνεις online ή στο κομμωτήριο.")],
    "Βαφή μαλλιών",
    [("Balayage στην Αθήνα", "/balayage-athina/"), ("Κούρεμα στην Αθήνα", "/kourema-athina/"), ("Όλες οι τιμές", "/services")],
    footnote=SKIN_NOTE + f'<p class="footnote" style="font-size:.82em;opacity:.75">Κάθε βαφή περιλαμβάνει συγκεκριμένη ποσότητα χρώματος (στη βαφή ρίζας έως 45 g). Αν χρειαστεί περισσότερο, το «+ Επιπλέον χρώμα» (€{P("+ Επιπλέον χρώμα")} ανά 30 g, Redken {OP("+ Επιπλέον χρώμα","Redken · ανά 30 g ή 30 ml")}) το συμφωνούμε πριν την εφαρμογή.</p>',
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
    ["Ανταύγειες γύρω από το πρόσωπο", "Μερικές ανταύγειες", "Ολόκληρες ανταύγειες", "Μερικό μπαλαγιάζ", "Ολόκληρο μπαλαγιάζ", "+ Μακριά μαλλιά (ανταύγειες / μπαλαγιάζ)", "+ Προστασία τρίχας στο ξάνοιγμα", "Διόρθωση χρώματος"],
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
        inner = f'<span>{esc(o["en"]) + " · " if o["en"] else ""}<span class="d">{esc(o["time"]["en"])}</span></span><span class="p">{eur(o["price"], True)}{" →" if url else " ☎"}</span>'
        if url:
            return f'<li><a class="bk" href="{esc(url)}" target="_blank" rel="noopener" aria-label="Book: {esc(s["name"]["en"])}{" · " + esc(o["en"]) if o["en"] else ""}">{inner}</a></li>'
        return f'<li><a class="bk" href="/services#{_anchor(name)}" aria-label="Book by call or message: {esc(s["name"]["en"])}{" · " + esc(o["en"]) if o["en"] else ""}">{inner}</a></li>'
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


EN_KEYS = ["Κούρεμα & στέγνωμα", "Κούρεμα & χτένισμα", "Blowout · Κλασικό χτένισμα", "Χτένισμα για εκδήλωση",
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
_items = "".join(f"<details><summary>{esc(q)}</summary><p>{linkify(esc(a))}</p></details>" for q, a in EN_FAQ)
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
<p>A haircut is a shape around the face. We start with a short talk about your face, your hair and how you style it, then cut and finish it the way you choose: a natural dry, a brushed blow-dry, or a full blow-out, bouncy or sleek, that usually lasts 2–3 days.</p>
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
.en-only{{display:none;border:1px solid var(--gold);border-radius:14px;padding:16px 18px;margin:18px 0}}html[lang=en] .en-only{{display:block}}
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
  <div class="en-only"><p><strong>Booking in English:</strong> our booking system is in Greek. The easiest way is our English price list: tap any price and the booking opens with your service already selected, so you only pick a time.</p><p class="cta"><a class="btn gold" href="/services">English price list &amp; booking</a><a class="btn ghost" href="https://wa.me/306981319000" target="_blank" rel="noopener">WhatsApp</a></p></div>
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
  <p data-en="One price per service, the same online and at the salon; the price list says what each one includes. If a colour needs more product, Extra Colour (€{P('+ Επιπλέον χρώμα')} per 30 g, Redken {OP('+ Επιπλέον χρώμα','Redken · ανά 30 g ή 30 ml')}) is agreed before we apply it. Wearing extensions? Mention it when you book so we reserve the right time.">Μία τιμή για κάθε υπηρεσία, ίδια online και στο κομμωτήριο· στον τιμοκατάλογο γράφουμε τι περιλαμβάνει η καθεμία. Αν η βαφή θέλει περισσότερο χρώμα, το «+ Επιπλέον χρώμα» (€{P('+ Επιπλέον χρώμα')} ανά 30 g, Redken {OP('+ Επιπλέον χρώμα','Redken · ανά 30 g ή 30 ml')}) το συμφωνούμε πριν την εφαρμογή. Αν έχεις extensions, μπορείς να το σημειώσεις στην κράτηση, για να κρατήσουμε τον σωστό χρόνο.</p>
  <p><a href="/services" data-en="Full price list with descriptions →">Όλος ο τιμοκατάλογος με περιγραφές →</a></p>
</section>
"""
kratisi_ld = [{"@context": "https://schema.org", **{k: v for k, v in SALON_REF.items() if k != "@type"}, "@type": "HairSalon",
               "potentialAction": {"@type": "ReserveAction", "target": f"{SITE}/kratisi/"}}]
# ---------- Σελίδες για μοντέλα μαλλιών: φέρνουν αναζητήσεις «δωρεάν κούρεμα / βαφή» στη φόρμα /montela ----------
MODELS_FORM = "/montela#dilosi"
MODEL_OG = f"{SITE}/images/og-montela-2.jpg"


def model_page(path, crumb, title, desc, eyebrow, h1, lead, facts, prose, faqs, related, cta, lang="el", faq_title="Συχνές ερωτήσεις", related_title="Δες επίσης", share=""):
    items = "".join(f"<details><summary>{esc(q)}</summary><p>{linkify(esc(a))}</p></details>" for q, a in faqs)
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
    items = "".join(f"<details><summary>{esc(q)}</summary><p>{linkify(esc(a))}</p></details>" for q, a in faqs)
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
BD = "Blowout · Κλασικό χτένισμα"
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
<p>Book <strong>Special Occasion Styling</strong> for curls, waves or an up-do, a <strong>Glossy Blow-dry</strong> for sleek, straight hair, or a <strong>Classic Blowout</strong> for volume and movement. Please come with clean, dry hair and a photo of the look you like. We plan the time with your photographer so the hair is fresh for the first frame.</p>
<h2>For photographers, brands and productions</h2>
<p>We work on lookbooks, editorials, e-commerce and campaigns, in the salon or on set, by the half or full day, with a clear quote before the shoot. Ask us for a quote on WhatsApp or by phone.</p>
<h2>Who does the work</h2>
<p>{esc(EXPERIENCE_EN)}</p>""",
    PHOTO_KEYS,
    [("Is hair included in my photo shoot?", "Usually not: most photographers in Athens work without a hair stylist. Book styling with us before your session; the salon is a short walk from the most photographed spots around the Acropolis."),
     ("How long does it take?", f"Special Occasion Styling takes about 45 minutes and costs €{P(EV)}. A Classic Blowout takes 30–45 minutes and costs from €{P(BD)}."),
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
<p>Κλείσε <strong>Χτένισμα για εκδήλωση</strong> για μπούκλες, κυματισμούς ή πιάσιμο, <strong>Φορμάρισμα με λάμψη</strong> για ίσιο και λείο, ή <strong>Blowout · Κλασικό χτένισμα</strong> για όγκο και κίνηση. Καλό είναι να έρθεις με λουσμένα, στεγνά μαλλιά και μια φωτογραφία με αυτό που σου αρέσει. Κανονίζουμε την ώρα μαζί με τον φωτογράφο, ώστε τα μαλλιά να είναι φρέσκα στο πρώτο κάδρο.</p>
<h2>Για φωτογράφους, brands και παραγωγές</h2>
<p>Lookbooks, editorial, φωτογραφίες προϊόντων για e-shop, διαφημιστικές καμπάνιες. Στο κομμωτήριο ή στο σετ, με μισή ή πλήρη ημέρα και γραπτή προσφορά πριν τη φωτογράφιση. Στείλε μας ημερομηνία, χώρο και αριθμό looks στο WhatsApp.</p>
<h2>Ποιος κάνει τη δουλειά</h2>
<p>{esc(EXPERIENCE_EL)}</p>""",
    PHOTO_KEYS,
    [("Πόσο κοστίζει το χτένισμα για φωτογράφιση;", f"Το Χτένισμα για εκδήλωση κοστίζει €{P(EV)} και διαρκεί περίπου 45 λεπτά. Το Blowout · Κλασικό χτένισμα από €{P(BD)}, 30–45 λεπτά."),
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
<p>{t("Email: alexandros@alexandroshairsalon.gr · WhatsApp ή Viber: 698 131 9000 · Κομμωτήριο: 210 346 5554 · Ερυσίχθονος 3-5, Θησείο.", "Email: alexandros@alexandroshairsalon.gr · WhatsApp or Viber: +30 698 131 9000 · Salon: +30 210 346 5554 · Erisichthonos 3-5, Thiseio, Athens.")}</p>"""
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

XC = O("+ Επιπλέον χρώμα", "ανά 30 g ή 30 ml")
XR = O("+ Επιπλέον χρώμα", "Redken · ανά 30 g ή 30 ml")

def S(name):
    """Όνομα υπηρεσίας στα αγγλικά, από το menu.json."""
    return EN_NAME[name]

EN_NAME = {s["name"]["el"]: s["name"]["en"] for c in _MENU_JSON for s in c["services"]}
EN_OPT = {(s["name"]["el"], o["el"]): o["en"] for c in _MENU_JSON for s in c["services"] for o in s["options"]}


def svc_anchor(name):
    """Ίδιο με το id κάθε υπηρεσίας στη σελίδα /services (src/views/Services.js)."""
    return re.sub(r"[^a-z0-9]+", "-", EN_NAME[name].lower()).strip("-")


# Επίσημες σελίδες των προϊόντων που χρησιμοποιούμε (ελέγχθηκαν 23/10/2026)
PRODUCT_LINKS = [
    ("Farcom Expertia", "https://www.farcom.gr/expertia-bafh-100-ml-471-kastano-kafe-santre"),
    ("L’Oréal Metal Detox", "https://www.angelopouloshair.gr/el/l-oreal-professionnel-serie-expert-metal-detox-neutralizer-pre-treatment-500ml"),
    ("Redken Color Gels Oils", "https://redken.co.uk/products/haircolor/colorgels/color-gels-oils"),
    ("Redken Shades EQ", "https://redken.co.uk/products/haircolor/shades-eq/shades-eq-hair-gloss"),
    ("Blond Studio No Bleach™", "https://www.lorealprofessionnel.com/no-bleach-french-highlights"),
    ("Majirel", "https://www.lorealprofessionnel.com/all-products/hair-color/majirel"),
    ("INOA", "https://www.lorealprofessionnel.com/all-products/hair-color/inoa"),
    ("Dia Color", "https://www.lorealprofessionnel.com/all-products/hair-color/dia-color"),
    ("Dia Light", "https://www.lorealprofessionnel.com/all-products/hair-color/dia-light"),
]
_PROD_RE = re.compile("|".join(re.escape(esc(n)) for n, _ in PRODUCT_LINKS))
_PROD_URL = {esc(n): u for n, u in PRODUCT_LINKS}


def link_products(h):
    """Η πρώτη αναφορά κάθε προϊόντος σε μια απάντηση γίνεται σύνδεσμος προς την επίσημη σελίδα του."""
    seen = set()
    def rep(m):
        t = m.group(0)
        if t in seen:
            return t
        seen.add(t)
        return f'<a class="il" href="{_PROD_URL[t]}" target="_blank" rel="noopener">{t}</a>'
    return _PROD_RE.sub(rep, h)


def book_links(books, lang):
    """Γραμμή «Κράτηση:» με σύνδεσμο για κάθε υπηρεσία που αναφέρει η απάντηση."""
    if not books:
        return ""
    out = []
    for name, opt in books:
        s = next(s for c in _MENU_JSON for s in c["services"] if s["name"]["el"] == name)
        o = next(o for o in s["options"] if opt is None or o["el"] == opt)
        label = (name if lang == "el" else EN_NAME[name]) + ((" · " + (opt if lang == "el" else EN_OPT[(name, opt)])) if opt else "")
        u = book_url(o)
        if u:
            out.append(f'<a class="il" href="{esc(u)}" target="_blank" rel="noopener">{esc(label)}</a>')
        else:
            tel = "Τηλεφωνικά" if lang == "el" else "By phone"
            out.append(f'<a class="il" href="/services#{svc_anchor(name)}">{esc(label)}</a> ({tel} <a class="il" href="tel:{PHONE}">{PHONE_TXT}</a>)')
    return f'<span class="bk">{"Κράτηση" if lang == "el" else "Book"}: ' + " · ".join(out) + "</span>"


# (ερώτηση, απάντηση, ερώτηση EN, απάντηση EN, υπηρεσίες για κράτηση)
FAQ_GROUPS = [
 ("Χρώμα", "Colour", [
  ("Θέλω να καλύψω τα λευκά στη ρίζα. Τι μου ταιριάζει;",
   f"Η Βαφή ρίζας ({O('Βαφή ρίζας','Κλασική')}), με Farcom Expertia ή Majirel της L’Oréal, που καλύπτουν πλήρως τα λευκά. Αν βάφεσαι κάθε μήνα, η Μηνιαία ρίζα ({O('Βαφή ρίζας','Μηνιαία ρίζα')}).",
   "I want to cover grey at the roots. What suits me?",
   f"Root Colour ({O('Βαφή ρίζας','Κλασική')}), with Farcom Expertia or L’Oréal Majirel, for full grey coverage. If you colour every month, the Monthly Root ({O('Βαφή ρίζας','Μηνιαία ρίζα')}).",
   [("Βαφή ρίζας", "Κλασική"), ("Βαφή ρίζας", "Μηνιαία ρίζα")]),
  ("Με ενοχλεί η μυρωδιά ή έχω ευαίσθητο δέρμα.",
   f"Η Βαφή ρίζας χωρίς αμμωνία ({O('Βαφή ρίζας','Χωρίς αμμωνία')}, μηνιαία {O('Βαφή ρίζας','Χωρίς αμμωνία · μηνιαία ρίζα')}), με INOA της L’Oréal ή Redken Color Gels Oils. Η μυρωδιά είναι πολύ πιο ήπια και η κάλυψη των λευκών παραμένει πλήρης.",
   "The smell bothers me, or I have sensitive skin.",
   f"Ammonia-free Root Colour ({O('Βαφή ρίζας','Χωρίς αμμωνία')}, monthly {O('Βαφή ρίζας','Χωρίς αμμωνία · μηνιαία ρίζα')}), with L’Oréal INOA or Redken Color Gels Oils. The smell is much milder and grey coverage stays full.",
   [("Βαφή ρίζας", "Χωρίς αμμωνία"), ("Βαφή ρίζας", "Χωρίς αμμωνία · μηνιαία ρίζα")]),
  ("Τα μήκη μου ξεθώριασαν.",
   f"Η Βαφή ρίζας & ρεφλέ ({O('Βαφή ρίζας & ρεφλέ στα μήκη','Έως τους ώμους')} έως τους ώμους, {O('Βαφή ρίζας & ρεφλέ στα μήκη','Κάτω από τους ώμους')} πιο κάτω). Στη ρίζα μόνιμη βαφή· στα μήκη όξινο ρεφλέ χωρίς αμμωνία (Dia Light ή Redken Shades EQ), που ξαναδίνει τόνο και λάμψη χωρίς να ξανοίγει τα μαλλιά. Αν τα μήκη θέλουν περισσότερο χρώμα, ημιμόνιμη Dia Color, στην ίδια τιμή.",
   "My lengths have faded.",
   f"Root Colour & Gloss ({O('Βαφή ρίζας & ρεφλέ στα μήκη','Έως τους ώμους')} up to the shoulders, {O('Βαφή ρίζας & ρεφλέ στα μήκη','Κάτω από τους ώμους')} longer). Permanent colour on the roots; on the lengths an acidic, ammonia-free gloss (Dia Light or Redken Shades EQ) that brings back tone and shine without lightening. If the lengths need more colour, Dia Color demi-permanent, at the same price.",
   [("Βαφή ρίζας & ρεφλέ στα μήκη", "Έως τους ώμους"), ("Βαφή ρίζας & ρεφλέ στα μήκη", "Κάτω από τους ώμους")]),
  ("Θέλω άλλο χρώμα ή έχω λευκά και στα μήκη.",
   f"Η Βαφή σε όλο το μαλλί, μόνιμη ({O('Βαφή σε όλο το μαλλί','Μόνιμη')}): ένα ενιαίο χρώμα από τη ρίζα ως τις άκρες, με πλήρη κάλυψη λευκών.",
   "I want a different colour, or I have grey on the lengths too.",
   f"All-over Colour, permanent ({O('Βαφή σε όλο το μαλλί','Μόνιμη')}): one even colour from roots to ends, with full grey coverage.",
   [("Βαφή σε όλο το μαλλί", "Μόνιμη")]),
  ("Θέλω κάτι πιο ήπιο από τη μόνιμη βαφή.",
   f"Η Βαφή σε όλο το μαλλί, ημιμόνιμη ({O('Βαφή σε όλο το μαλλί','Ημιμόνιμη')}), με Dia Color της L’Oréal. Καλύπτει έως 70% των λευκών, κρατά έως 6 εβδομάδες και ξεθωριάζει σταδιακά, χωρίς έντονη γραμμή στη ρίζα. Ταιριάζει και σε ταλαιπωρημένα μαλλιά.",
   "I’d like something gentler than permanent colour.",
   f"All-over Colour, demi-permanent ({O('Βαφή σε όλο το μαλλί','Ημιμόνιμη')}), with L’Oréal Dia Color. It covers up to 70% of grey, lasts up to 6 weeks and fades gradually, with no sharp regrowth line. It also suits stressed hair.",
   [("Βαφή σε όλο το μαλλί", "Ημιμόνιμη")]),
  ("Τι σημαίνει μόνιμη, ημιμόνιμη και ρεφλέ;",
   "Μόνιμη βαφή (Farcom Expertia, Majirel, INOA, Redken Color Gels Oils): μπαίνει μέσα στην τρίχα και καλύπτει πλήρως τα λευκά. Δεν φεύγει με το λούσιμο· το χρώμα μένει στην τρίχα μέχρι να κοπεί. Καθώς τα μαλλιά μεγαλώνουν φαίνεται η νέα ρίζα, γι’ αυτό η ρίζα βάφεται συνήθως κάθε 4–6 εβδομάδες. "
   "Ημιμόνιμη (Dia Color): πιο ήπια, καλύπτει έως 70% των λευκών και ξεθωριάζει σταδιακά σε περίπου 6 εβδομάδες, χωρίς έντονη γραμμή στη ρίζα. "
   "Ρεφλέ (Dia Light, Redken Shades EQ): όξινο, χωρίς αμμωνία· δίνει τόνο και λάμψη χωρίς να ξανοίγει τα μαλλιά και δεν καλύπτει πλήρως τα λευκά.",
   "What do permanent, demi-permanent and gloss mean?",
   "Permanent colour (Farcom Expertia, Majirel, INOA, Redken Color Gels Oils): goes inside the hair and fully covers grey. It doesn’t wash out; the colour stays in the hair until it is cut. As your hair grows the new roots show, so roots are usually coloured every 4–6 weeks. "
   "Demi-permanent (Dia Color): gentler, covers up to 70% of grey and fades gradually over about 6 weeks, with no sharp regrowth line. "
   "Gloss (Dia Light, Redken Shades EQ): acidic and ammonia-free; adds tone and shine without lightening, and doesn’t fully cover grey.",
   []),
  ("Τι διαφέρει η όξινη από την αλκαλική τεχνολογία χρώματος;",
   "Η διαφορά είναι το pH. Η αλκαλική τεχνολογία (pH πάνω από 7) ανοίγει ελαφρά την επιφάνεια της τρίχας, ώστε το χρώμα να μπει βαθιά: μπορεί να ξανοίξει τα μαλλιά, καλύπτει τα λευκά και κρατά πολύ. Η όξινη (pH κάτω από 7, κοντά στο φυσικό pH της τρίχας) δεν ξανοίγει: αφήνει τόνο, λειαίνει την επιφάνεια της τρίχας και δίνει λάμψη και περιποίηση, χωρίς να καλύπτει πλήρως τα λευκά. Γι’ αυτό συχνά η αλκαλική μπαίνει στη ρίζα και η όξινη στα μήκη. "
   "Αλκαλικές: Majirel της L’Oréal, μόνιμη, κάλυψη έως 100% των λευκών· Redken Color Gels Oils, μόνιμη χωρίς αμμωνία, κάλυψη έως 100%· Dia Color της L’Oréal, ημιμόνιμη, κάλυψη έως 70%. "
   "Όξινες: Dia Light της L’Oréal, χωρίς αμμωνία, κρατά 4–6 εβδομάδες και δεν είναι για κάλυψη λευκών· Redken Shades EQ, όξινο ρεφλέ με λάμψη και περιποίηση.",
   "What’s the difference between acidic and alkaline colour?",
   "It comes down to pH. Alkaline colour (pH above 7) gently opens the hair’s surface so colour can go deep: it can lighten, covers grey and lasts. Acidic colour (pH below 7, close to the hair’s natural pH) doesn’t lighten: it deposits tone, smooths the hair’s surface and adds shine and condition, without fully covering grey. That’s why alkaline colour often goes on the roots and acidic colour on the lengths. "
   "Alkaline: L’Oréal Majirel, permanent, up to 100% grey coverage; Redken Color Gels Oils, permanent and ammonia-free, up to 100%; L’Oréal Dia Color, demi-permanent, up to 70%. "
   "Acidic: L’Oréal Dia Light, ammonia-free, lasts 4–6 weeks and is not for grey coverage; Redken Shades EQ, an acidic gloss for shine and condition.",
   [("Ρεφλέ", "Έως τους ώμους · 30–45 ml"), ("Ρεφλέ", "Κάτω από τους ώμους · έως 60 ml")], "oxini-alkaliki"),
  ("Υπάρχει φυτική βαφή;",
   "Υπάρχει, αλλά πολύ πιο περιορισμένη απ’ όσο λέγεται. Καθαρή φυτική βαφή είναι οι σκόνες από φυτά, όπως η χέννα, το indigo και η cassia· η L’Oréal Professionnel έχει παρουσιάσει και σειρά 100% φυτική, τη Botanéa. Δίνουν χρώμα και λάμψη, αλλά δεν ξανοίγουν τα μαλλιά, έχουν λίγες αποχρώσεις και στα λευκά το αποτέλεσμα είναι λιγότερο προβλέψιμο. "
   "Πολλά προϊόντα που πωλούνται ως «φυτική» ή «φυσική» βαφή είναι στην πράξη κανονικές βαφές με εκχυλίσματα φυτών. Σε έλεγχο 26 τέτοιων βαφών από το Συμβούλιο Καταναλωτών του Χονγκ Κονγκ, οι 11 περιείχαν PPD, τη χημική ουσία των μόνιμων βαφών, και τρεις χέννες την περιείχαν χωρίς να επιτρέπεται. Ένας απλός κανόνας: αν μια βαφή χρειάζεται οξειδωτικό για να δουλέψει, δεν είναι φυτική. "
   "Φυτική βαφή δεν κάνουμε. Για το πιο ήπιο αποτέλεσμα υπάρχει το Ρεφλέ, που γίνεται και ως root smudge για τα πρώτα λευκά, με όξινη τεχνολογία χρώματος χωρίς αμμωνία.",
   "Is there such a thing as plant-based hair colour?",
   "Yes, but it is far more limited than often claimed. True plant colour is powder from plants such as henna, indigo and cassia; L’Oréal Professionnel has also presented a 100% plant-based line, Botanéa. It gives colour and shine, but it doesn’t lighten, comes in few shades, and on grey the result is less predictable. "
   "Many products sold as “herbal” or “natural” colour are in fact regular hair dyes with plant extracts. When the Hong Kong Consumer Council tested 26 such dyes, 11 contained PPD, the chemical used in permanent colour, and three hennas contained it although it is not allowed. A simple rule: if a colour needs developer to work, it is not plant-based. "
   "We don’t offer plant colour. For the gentlest result there is Gloss & Tone, also done as a root smudge for first greys, with an ammonia-free acidic colour technology.",
   [("Ρεφλέ", "Έως τους ώμους · 30–45 ml")], "fytiki-vafi"),
  ("Τι είναι το ντεκαπάζ;",
   "Το ξάνοιγμα των μαλλιών με σκόνη ξανοίγματος, για ανταύγειες και μπαλαγιάζ που χρειάζονται να ανοίξουν αρκετούς τόνους. Μετά ακολουθεί σχεδόν πάντα ρεφλέ, για τον τόνο που θέλεις. "
   "Για πιο ήπιο αποτέλεσμα υπάρχει και η επιλογή χωρίς ντεκαπάζ, με L’Oréal Blond Studio No Bleach™, που ανοίγει έως 4 τόνους σε φυσικά μαλλιά και έως 2,5 σε βαμμένα. "
   f"Για επιπλέον προστασία, πριν από το ξάνοιγμα μπορούμε να ψεκάσουμε L’Oréal Metal Detox: «+ Προστασία τρίχας στο ξάνοιγμα» ({O('+ Προστασία τρίχας στο ξάνοιγμα')}). Σε βαμμένα μαλλιά προηγείται συμβουλευτική.",
   "What is bleaching (ντεκαπάζ)?",
   "Lightening the hair with lightening powder, for highlights and balayage that need to lift several levels. A gloss almost always follows, for the tone you want. "
   "For a gentler result there is also a bleach-free option, with L’Oréal Blond Studio No Bleach™, which lifts up to 4 levels on natural hair and up to 2.5 on coloured hair. "
   f"For extra protection, we can spray L’Oréal Metal Detox before lightening: the Hair Protection add-on ({O('+ Προστασία τρίχας στο ξάνοιγμα')}). On coloured hair, a consultation comes first.",
   [("Ανταύγειες γύρω από το πρόσωπο", "Με ντεκαπάζ"), ("Ανταύγειες γύρω από το πρόσωπο", "Χωρίς ντεκαπάζ"), ("Συμβουλευτική χρώματος, νυφικού & κερατίνης", None)]),
  ("Πόσο χρώμα περιλαμβάνει κάθε βαφή;",
   "Βαφή ρίζας έως 45 g. Βαφή σε όλο το μαλλί έως 60 g ή 60 ml. Ρεφλέ 30–45 ml για μαλλιά έως τους ώμους ή έως 60 ml για πιο μακριά. Βαφή ρίζας & ρεφλέ: ρίζα έως 45 g και ρεφλέ 30–45 ml ή έως 60 ml. Οι ποσότητες είναι πριν από το οξειδωτικό.",
   "How much colour does each service include?",
   "Root Colour up to 45 g. All-over Colour up to 60 g or 60 ml. Gloss 30–45 ml for hair up to the shoulders, or up to 60 ml for longer hair. Root Colour & Gloss: roots up to 45 g and gloss 30–45 ml or up to 60 ml. Amounts are before developer.",
   []),
  ("Έχω πολλά ή μακριά μαλλιά. Θα πληρώσω παραπάνω;",
   f"Μόνο αν χρειαστεί περισσότερο χρώμα από όσο περιλαμβάνει η υπηρεσία: {XC} για κάθε 30 g βαφής ή 30 ml ρεφλέ ({XR} με Redken). Χρεώνεται μόνο το υλικό, όχι ο χρόνος, και θα σου το πούμε πριν το εφαρμόσουμε. Για παράδειγμα, βαφή σε όλο με 90 g κοστίζει €{P('Βαφή σε όλο το μαλλί')+7:g}.",
   "I have thick or long hair. Will I pay more?",
   f"Only if more colour is needed than the service includes: {XC} for every extra 30 g of colour or 30 ml of gloss ({XR} with Redken). You pay for the product only, not the time, and we always tell you before we apply it. For example, All-over Colour with 90 g costs €{P('Βαφή σε όλο το μαλλί')+7:g}.",
   []),
  ("Έχω λίγα ή λεπτά μαλλιά.", "Πληρώνεις την ίδια τιμή και δεν θα χρειαστείς ποτέ επιπλέον χρώμα.",
   "I have fine or thin hair.", "You pay the same price, and you will never need extra colour.", []),
  ("Μπορώ να φέρω τη δική μου βαφή;",
   f"Ναι, η Βαφή με τη δική σας βαφή: ρίζα {O('Βαφή με τη δική σας βαφή','Ρίζα')}, ρίζα και μήκη {O('Βαφή με τη δική σας βαφή','Ρίζα & μήκη')}, με λούσιμο και στέγνωμα. Η βαφή έρχεται κατά προτίμηση κλειστή, ή ανοιγμένη πρόσφατα, στη συσκευασία της και μαζί με το οξειδωτικό της. Το αποτέλεσμα εξαρτάται από τη βαφή που επιλέχθηκε.",
   "Can I bring my own colour?",
   f"Yes: Bring Your Own Colour, roots {O('Βαφή με τη δική σας βαφή','Ρίζα')}, roots and lengths {O('Βαφή με τη δική σας βαφή','Ρίζα & μήκη')}, with a wash and dry. The colour is preferably unopened, or only recently opened, in its box and with its own developer. The result depends on the colour chosen.",
   [("Βαφή με τη δική σας βαφή", "Ρίζα"), ("Βαφή με τη δική σας βαφή", "Ρίζα & μήκη")]),
  ("Πότε ισχύει η Μηνιαία ρίζα;",
   "Όταν η επόμενη βαφή ρίζας γίνεται μέσα σε 30 ημέρες από την προηγούμενη σε εμάς. Στο ταμείο σού δίνουμε ένα καρτελάκι με την ημερομηνία.",
   "When does the Monthly Root apply?",
   "When your next root colour is within 30 days of your last one with us. At the desk we give you a small card with the date.",
   [("Βαφή ρίζας", "Μηνιαία ρίζα"), ("Βαφή ρίζας", "Χωρίς αμμωνία · μηνιαία ρίζα")]),
 ]),
 ("Χτένισμα", "Blow-dry & styling", [
  ("Τι είναι το Εβδομαδιαίο χτένισμα με μάσκα;",
   f"Για όσες θέλουν να είναι περιποιημένες όλη την εβδομάδα, στη δουλειά και στα ραντεβού τους, χωρίς να το σκέφτονται. Λούσιμο, μάσκα και χτένισμα με βούρτσα, την ίδια μέρα και ώρα κάθε εβδομάδα: κοντά {O('Εβδομαδιαίο χτένισμα με μάσκα','Κοντά')}, μεσαία {O('Εβδομαδιαίο χτένισμα με μάσκα','Μεσαία')}, μακριά {O('Εβδομαδιαίο χτένισμα με μάσκα','Μακριά')} (χωριστά θα ήταν €39). Δευτέρα έως Πέμπτη, όταν υπάρχει ελεύθερη ώρα, και όταν το προηγούμενο χτένισμα έγινε σε εμάς τις τελευταίες 8 ημέρες.",
   "What is the Weekly Blowdry with Mask?",
   f"For anyone who wants to look polished all week, at work and out, without thinking about it. Wash, mask and blow-dry, same day and time every week: short {O('Εβδομαδιαίο χτένισμα με μάσκα','Κοντά')}, medium {O('Εβδομαδιαίο χτένισμα με μάσκα','Μεσαία')}, long {O('Εβδομαδιαίο χτένισμα με μάσκα','Μακριά')} (separately €39). Monday to Thursday, when there is a free slot, and when your previous blow-dry was with us in the last 8 days.",
   [("Εβδομαδιαίο χτένισμα με μάσκα", "Μεσαία"), ("Εβδομαδιαίο χτένισμα με μάσκα", "Κοντά"), ("Εβδομαδιαίο χτένισμα με μάσκα", "Μακριά")]),
  ("Πόσο κρατά το χτένισμα;",
   "Έως και 7 ημέρες. Η διάρκεια εξαρτάται από τη φύση των μαλλιών, τις συνθήκες, όπως η υγρασία, και τη φροντίδα τους στο σπίτι.",
   "How long does a blow-dry last?",
   "Up to 7 days. It depends on your hair, on conditions such as humidity, and on how it is cared for at home.",
   [("Blowout · Κλασικό χτένισμα", None)]),
  ("Μπούκλες ή πιάσιμο σε πολλά ή πολύ μακριά μαλλιά;",
   "Οι μπούκλες και το πιάσιμο κρατούν καλύτερα σε μαλλιά λουσμένα από πριν και στεγνωμένα φυσικά, χωρίς βαριά μαλακτικά ή έλαια μαλλιών. Σε πολλά ή πολύ μακριά μαλλιά βοηθά το λούσιμο να γίνει την προηγούμενη μέρα.",
   "Curls or an up-do on thick or very long hair?",
   "Curls and up-dos hold best on hair washed beforehand and left to dry naturally, without heavy conditioners or hair oils. On thick or very long hair, washing the day before helps.",
   [("Χτένισμα για εκδήλωση", None)]),
  ("Υπάρχει φορμάρισμα με λούσιμο χωρίς βαφή;",
   f"Ναι, το Φορμάρισμα με λάμψη, {O('Φορμάρισμα με λάμψη')}.",
   "Is there a wash and blow-dry without colour?",
   f"Yes, Glossy Blow-dry, {O('Φορμάρισμα με λάμψη')}.",
   [("Φορμάρισμα με λάμψη", None)]),
  ("Περιλαμβάνεται λούσιμο;",
   "Σε κάθε υπηρεσία γράφουμε αν περιλαμβάνει λούσιμο. Το περιλαμβάνουν όλα τα κουρέματα (εκτός από το ανδρικό με μηχανή), τα χτενίσματα με βούρτσα και όλες οι βαφές, τα ρεφλέ και οι ανταύγειες. Όλες οι υπηρεσίες: alexandroshairsalon.gr/services.",
   "Is a wash included?",
   "Every service says whether a wash is included. It is included in all haircuts (except the men’s clipper cut), all blow-dries and all colour, gloss and highlights services. All services: alexandroshairsalon.gr/services.",
   []),
 ]),
 ("Τιμές", "Prices", [
  ("Τι δεν συνδυάζεται;",
   "Η Μηνιαία ρίζα και το Εβδομαδιαίο χτένισμα είναι ήδη χαμηλότερες τιμές για τακτικές πελάτισσες. Δεν συνδυάζονται με άλλη έκπτωση ή προσφορά, όπως οι εκπτώσεις της Treatwell σε ώρες χαμηλής κίνησης ή τελευταίας στιγμής.",
   "What can’t be combined?",
   "The Monthly Root and the Weekly Blowdry are already lower prices for regular clients. They can’t be combined with any other discount or offer, such as Treatwell off-peak or last-minute discounts.",
   []),
  ("Τι δεν κάνουμε;",
   "Δεν φρεσκάρουμε τα μήκη με τα υπόλοιπα της μόνιμης βαφής: για τα μήκη υπάρχει το ρεφλέ ή η ημιμόνιμη βαφή, που είναι πιο ήπια. Δεν χρησιμοποιούμε επιπλέον χρώμα χωρίς να σου το πούμε πριν. Δεν υποσχόμαστε πλήρη κάλυψη λευκών με ρεφλέ.",
   "What we don’t do",
   "We don’t refresh the lengths with leftover permanent colour: for the lengths there is gloss or demi-permanent colour, which are gentler. We don’t use extra colour without telling you first. We don’t promise full grey coverage with a gloss.",
   []),
  ("Κάτι δεν σου άρεσε;",
   "Μπορείς να μας το πεις ανώνυμα στη σελίδα alexandroshairsalon.gr/gnomi, χωρίς όνομα, τηλέφωνο ή email.",
   "Something you didn’t like?",
   "You can tell us anonymously at alexandroshairsalon.gr/gnomi, with no name, phone or email.",
   []),
 ]),
]


def _answer(text, books, lang):
    return linkify(link_products(esc(text))) + book_links(books, lang)


_faq_all = [(q, a) for _, _, g in FAQ_GROUPS for q, a, *_ in g]
_faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
    {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in _faq_all]}
_faq_body = """
<section class="hero">
  <span class="eyebrow" data-en="FAQ">Συχνές ερωτήσεις</span>
  <h1 data-en="Know the price &lt;em&gt;before you sit down.&lt;/em&gt;">Ξέρεις την τιμή <em>πριν καθίσεις.</em></h1>
  <p class="lead" data-en="Which colour suits you, how much colour each service includes, what happens with thick or long hair, and what can’t be combined. Anything not covered here, you can always ask before we start.">Ποια βαφή σού ταιριάζει, πόσο χρώμα περιλαμβάνει κάθε υπηρεσία, τι γίνεται με τα πολλά ή τα μακριά μαλλιά και τι δεν συνδυάζεται. Ό,τι δεν βρεις εδώ, μπορείς πάντα να το ρωτήσεις πριν ξεκινήσουμε.</p>
  <div class="cta"><a class="btn gold" href="/services" data-en="All prices">Όλες οι τιμές</a><a class="btn ghost" href="tel:""" + PHONE + """" data-en="Call """ + PHONE_TXT + """">Κλήση """ + PHONE_TXT + """</a></div>
</section>
""" + "".join(
    f'<section class="block"><h2 data-en="{esc(esc(ten))}">{esc(t)}</h2>' + "".join(
        f'<details{(' id="' + r[0] + '"') if r else ""}><summary data-en="{esc(esc(qe))}">{esc(q)}</summary>'
        f'<p data-en="{esc(_answer(ae, b, "en"))}">{_answer(a, b, "el")}</p></details>'
        for q, a, qe, ae, b, *r in g) + "</section>"
    for t, ten, g in FAQ_GROUPS) + """
<section class="block"><p class="links"><a href="/services" data-en="All prices">Όλες οι τιμές</a><a href="/vafi-mallion-athina/" data-en="Hair colour">Βαφή μαλλιών</a><a href="/gnomi/" data-en="Your feedback, anonymously">Η γνώμη σου, ανώνυμα</a></p></section>
<style>.bk{display:block;margin-top:10px;font-size:.92em;color:var(--muted)}</style>
<script>(function(){function o(){var h=location.hash.slice(1);if(!h)return;var d=document.getElementById(h);if(d&&d.tagName==="DETAILS"){d.open=true;d.scrollIntoView();}}window.addEventListener("hashchange",o);o();})();</script>
"""
page("/syxnes-erotiseis/", "Συχνές ερωτήσεις: βαφή, ποσότητες, τιμές | Alexandros Hair Salon – Θησείο",
     "Ποια βαφή σού ταιριάζει (μόνιμη, ημιμόνιμη, ρεφλέ), πόσο χρώμα περιλαμβάνει κάθε υπηρεσία, Μηνιαία ρίζα, εβδομαδιαίο χτένισμα και τι δεν συνδυάζεται.",
     _faq_body, [_faq_ld, crumbs("Συχνές ερωτήσεις", "/syxnes-erotiseis/")], bilingual=True)


# ---------- /gnomi/ : ανώνυμη γνώμη, χωρίς κανένα προσωπικό στοιχείο (αποστολή σε Google Form, χωρίς αποθήκευση στο site) ----------
GNOMI_FORM = "1FAIpQLSe4NOQXPGj1ujfBYrkWBSyJFPEOs2VepAY-TrU6v1NJCtsKew"
_gn_body = """
<section class="hero">
  <span class="eyebrow" data-en="Help us get better">Βοηθήστε μας να γίνουμε καλύτεροι</span>
  <h1 data-en="Your feedback, &lt;em&gt;anonymously.&lt;/em&gt;">Η γνώμη σου, <em>ανώνυμα.</em></h1>
  <p class="lead" data-en="We don’t ask for your name, phone or email. Only Alexandros reads it, to improve your experience and our services. It helps us; we don’t judge it.">Δεν ζητάμε όνομα, τηλέφωνο ή email. Το διαβάζει μόνο ο Αλέξανδρος, για να βελτιώσει την εμπειρία σου και τις υπηρεσίες μας. Μας βοηθάει· δεν το κρίνουμε.</p>
</section>
<section class="block">
<form id="gn" class="gn" novalidate>
  <fieldset><legend data-en="What would you like to tell us?">Τι θα ήθελες να μας πεις;</legend>
    <label><input type="radio" name="kind" value="Κάτι δεν πήγε καλά" checked> <span data-en="Something didn’t go well">Κάτι δεν πήγε καλά</span></label>
    <label><input type="radio" name="kind" value="Κάτι μου άρεσε"> <span data-en="Something I liked">Κάτι μου άρεσε</span></label>
    <label><input type="radio" name="kind" value="Έχω μια ιδέα"> <span data-en="I have an idea">Έχω μια ιδέα</span></label>
  </fieldset>
  <label for="gn-msg" class="gn-l" data-en="Your message">Το μήνυμά σου</label>
  <textarea id="gn-msg" name="message" rows="7" maxlength="3000" required></textarea>
  <input type="text" name="website" tabindex="-1" autocomplete="off" class="gn-hp" aria-hidden="true">
  <button type="submit" class="btn gold" data-en="Send">Αποστολή</button>
  <p id="gn-st" class="gn-st" role="status" aria-live="polite"></p>
</form>
</section>
<style>.gn fieldset{border:0;padding:0;margin:0 0 18px}.gn legend{font-weight:700;margin-bottom:10px}.gn label{display:block;margin:8px 0;font-size:17px}
.gn-l{font-weight:700}.gn textarea{width:100%;font:inherit;font-size:17px;padding:12px;border:1px solid var(--line);border-radius:10px;background:transparent;color:inherit;margin:8px 0 16px}
.gn-hp{position:absolute;left:-9999px}.gn-st{margin-top:14px;font-size:17px}</style>
<script>
(function(){var f=document.getElementById('gn'),st=document.getElementById('gn-st');
function T(el,en){return document.documentElement.lang==='en'?en:el;}
f.addEventListener('submit',function(e){e.preventDefault();var m=f.message.value.trim();
if(f.website.value){return;}
if(m.length<3){st.textContent=T('Το κουτί είναι άδειο. Μπορείς να γράψεις όσα λίγα θέλεις.','The box is empty. A few words are enough.');return;}
var b=f.querySelector('button');b.disabled=true;st.textContent=T('Αποστολή…','Sending…');
var fd=new URLSearchParams();fd.append('entry.760992725',f.kind.value);fd.append('entry.329498901',m);
fetch('https://docs.google.com/forms/d/e/""" + GNOMI_FORM + """/formResponse',{method:'POST',mode:'no-cors',body:fd}).then(function(){
f.reset();st.textContent=T('Ευχαριστούμε. Το μήνυμά σου έφτασε.','Thank you. Your message has arrived.');}).catch(function(){
st.textContent=T('Δεν στάλθηκε. Μπορείς να δοκιμάσεις ξανά σε λίγο.','It wasn’t sent. You can try again in a moment.');}).then(function(){b.disabled=false;});});})();
</script>
"""
# ---------- /dorokarta/ : δωροκάρτες (πληρωμή στο κομμωτήριο, IRIS ή κατάθεση· όχι online ακόμα) ----------
_WA_GIFT = "https://wa.me/306981319000?text=" + _up.quote("Γεια σας, θα ήθελα μια δωροκάρτα Alexandros Hair Salon αξίας €")
_dk_card = lambda amt, el, en: (f'<div class="gc"><span class="gc-amt">€{amt}</span>'
    f'<p data-en="{esc(en)}">{esc(el)}</p></div>')
_dk_body = f"""
<section class="hero">
  <span class="eyebrow" data-en="Gift card">Δωροκάρτα</span>
  <h1 data-en="A gift she’ll <em>actually use.</em>">Ένα δώρο που <em>θα χρησιμοποιήσει.</em></h1>
  <p class="lead" data-en="A gift card from Alexandros Hair Salon in Thiseio, for any service or product. She chooses what she wants, when she wants it, within 12 months.">Δωροκάρτα του Alexandros Hair Salon στο Θησείο, για όποια υπηρεσία ή προϊόν θέλει. Διαλέγει εκείνη τι και πότε, μέσα σε 12 μήνες.</p>
  <div class="cta"><a class="btn gold" href="{_WA_GIFT}" target="_blank" rel="noopener" data-en="Order on WhatsApp">Παραγγελία στο WhatsApp</a><a class="btn ghost" href="tel:{PHONE}" data-en="Call {PHONE_TXT}">Κάλεσε {PHONE_TXT}</a></div>
</section>
<section class="block">
  <h2 data-en="Choose the amount">Διάλεξε ποσό</h2>
  <div class="gcs">
    {_dk_card(30, "Για κούρεμα ή χτένισμα.", "For a haircut or a blow-dry.")}
    {_dk_card(50, "Για βαφή ρίζας ή κούρεμα με χτένισμα.", "For root colour, or a cut with a blow-out.")}
    {_dk_card(100, "Για ανταύγειες, ή για βαφή με κούρεμα και χτένισμα.", "For highlights, or colour with a cut and blow-out.")}
  </div>
  <p data-en="Any other amount is possible too. Just tell us.">Γίνεται και όποιο άλλο ποσό θέλεις· αρκεί να μας το πεις.</p>
</section>
<section class="block prose">
  <h2 data-en="How it works">Πώς γίνεται</h2>
  <ol>
    <li data-en="Tell us the amount on WhatsApp, by phone or at the salon.">Μας λες το ποσό στο WhatsApp, στο τηλέφωνο ή στο κομμωτήριο.</li>
    <li data-en="Pay at the salon, by IRIS or bank transfer; we send you the details in a message.">Πληρώνεις στο κομμωτήριο, με IRIS ή με κατάθεση· τα στοιχεία σού τα στέλνουμε με μήνυμα.</li>
    <li data-en="You receive the card printed at the salon, or as a PDF to forward, with its own unique code.">Παίρνεις την κάρτα τυπωμένη από το κομμωτήριο ή σε PDF για να τη στείλεις, με δικό της μοναδικό κωδικό.</li>
    <li data-en="She books online or by phone and shows the code at the desk.">Εκείνη κλείνει ραντεβού online ή τηλεφωνικά και δείχνει τον κωδικό στο ταμείο.</li>
  </ol>
  <h2 data-en="Good to know">Καλό να ξέρεις</h2>
  <ul>
    <li data-en="Valid for 12 months from the date of purchase, for any service or product of the salon.">Ισχύει 12 μήνες από την αγορά, για όποια υπηρεσία ή προϊόν του κομμωτηρίου.</li>
    <li data-en="It can be used in more than one visit; the remaining balance stays on the card.">Χρησιμοποιείται και σε περισσότερες από μία επισκέψεις· το υπόλοιπο μένει στην κάρτα.</li>
    <li data-en="It can be given to anyone. It is not exchanged for cash.">Μπορεί να δοθεί σε οποιονδήποτε. Δεν εξαργυρώνεται σε μετρητά.</li>
    <li data-en="If the service costs more, the difference is paid at the salon.">Αν η υπηρεσία κοστίζει περισσότερο, η διαφορά πληρώνεται στο κομμωτήριο.</li>
    <li data-en="A receipt is issued when you buy the card.">Η απόδειξη εκδίδεται κατά την αγορά της κάρτας.</li>
  </ul>
  <p class="links"><a href="/services" data-en="See all prices">Δες όλες τις τιμές</a><a href="/syxnes-erotiseis/" data-en="FAQ">Συχνές ερωτήσεις</a></p>
</section>
<style>.gcs{{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin:18px 0}}.gc{{border:1px solid var(--gold);border-radius:16px;padding:22px;background:var(--panel)}}.gc-amt{{display:block;font-family:var(--serif);font-size:44px;color:var(--gold);line-height:1}}.gc p{{margin:10px 0 0;color:var(--soft)}}</style>
"""
page("/dorokarta/", "Δωροκάρτα κομμωτηρίου στο Θησείο | Alexandros Hair Salon",
     "Δωροκάρτα €30, €50 ή €100 για κούρεμα, χτένισμα, βαφή ή προϊόντα στο Alexandros Hair Salon στο Θησείο. Ισχύει 12 μήνες.",
     _dk_body, [crumbs("Δωροκάρτα", "/dorokarta/")], bilingual=True)


page("/gnomi/", "Η γνώμη σου, ανώνυμα | Alexandros Hair Salon – Θησείο",
     "Μπορείς να μας πεις ανώνυμα τι δεν πήγε καλά ή τι σου άρεσε. Δεν ζητάμε όνομα, τηλέφωνο ή email.",
     _gn_body, [crumbs("Η γνώμη σου", "/gnomi/")], bilingual=True)
