/**
 * Φόρμες του alexandroshairsalon.gr (Αίτηση εργασίας, Μοντέλα μαλλιών).
 * Google Apps Script web app στον λογαριασμό του κομμωτηρίου: δεν εξαρτάται από τρίτη υπηρεσία.
 * Για κάθε αποστολή:
 *   1. τα αρχεία (βιογραφικό / φωτογραφίες) σώζονται στο Drive: Alexandros Hair Salon › 6 Φόρμες site › <φόρμα>
 *   2. μια γραμμή μπαίνει στο φύλλο «Καταγραφή» του ίδιου φακέλου
 *   3. έρχεται email στο Gmail, με τα αρχεία συνημμένα και Reply-To τον αποστολέα.
 * Το site (src/components/siteForm.js) στέλνει τα πεδία ως x-www-form-urlencoded
 * και τα αρχεία ως base64 (file_count, file_0_name, file_0_type, file_0_data …).
 * Αντίγραφο αυτού του αρχείου υπάρχει στο repo: apps-script/forms.gs
 */
const TO = 'alexandroshairsalongr@gmail.com';
const ROOT_FOLDER_ID = '1LUwZab7IJZkzZ61bRK0tWXUCm1MBlIst'; // Alexandros Hair Salon (Drive)
const FORMS_FOLDER = '6 Φόρμες site';
const FORMS = { douleia: 'Αιτήσεις εργασίας', montela: 'Μοντέλα μαλλιών' };
const MAX_MAIL_ATTACH = 20 * 1024 * 1024; // όριο συνημμένων Gmail ~25 MB

// Προστασία από spam (ελαφριά: δεν χρειάζεται captcha, ο πραγματικός πελάτης δεν βλέπει τίποτα)
const MIN_SECONDS = 3;          // κάτω από 3″ συμπλήρωση = bot
const MAX_PER_HOUR = 15;        // όλες οι φόρμες μαζί
const MAX_PER_DAY = 60;
const MAX_FIELDS = 30;
const MAX_VALUE = 4000;         // χαρακτήρες ανά πεδίο
const MAX_FILES = 6;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_BYTES = 18 * 1024 * 1024;
const FILE_TYPES = /^(image\/[a-z0-9.+-]+|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/;
const FILE_EXT = /\.(jpe?g|png|webp|heic|heif|gif|avif|pdf|docx?)$/i; // όταν ο browser δεν δίνει τύπο (π.χ. .heic στα Windows)
const fileOk = (type, name) => FILE_TYPES.test(type) || (!type || type === 'application/octet-stream') && FILE_EXT.test(name);

// Μετράει αποστολές στην cache (1 ώρα / 1 ημέρα). true = εντός ορίου.
function underLimit() {
  const c = CacheService.getScriptCache();
  const hourKey = 'h' + Utilities.formatDate(new Date(), 'UTC', 'yyyyMMddHH');
  const dayKey = 'd' + Utilities.formatDate(new Date(), 'UTC', 'yyyyMMdd');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const h = Number(c.get(hourKey) || 0);
    const d = Number(c.get(dayKey) || 0);
    if (h >= MAX_PER_HOUR || d >= MAX_PER_DAY) return false;
    c.put(hourKey, String(h + 1), 3600);
    c.put(dayKey, String(d + 1), 86400);
    return true;
  } finally {
    lock.releaseLock();
  }
}

// Μία ειδοποίηση την ώρα, όταν κοπούν αποστολές λόγω ορίου.
function alertOnce(reason) {
  const c = CacheService.getScriptCache();
  if (c.get('alerted')) return;
  c.put('alerted', '1', 3600);
  MailApp.sendEmail(TO, 'Φόρμες site: πολλές αποστολές', 'Οι φόρμες του site δέχτηκαν ασυνήθιστα πολλές αποστολές (' + reason +
    ') και σταμάτησαν προσωρινά να δέχονται νέες για λίγη ώρα. Οι επισκέπτες βλέπουν WhatsApp, Viber και τηλέφωνο ως εναλλακτική.');
}

const clip = (s, n) => String(s == null ? '' : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, n);

function doGet() {
  return out({ ok: true, service: 'alexandroshairsalon.gr forms' });
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p._honey) return out({ ok: true }); // bot: κρυφό πεδίο συμπληρωμένο
    if (!(Number(p._elapsed) >= MIN_SECONDS)) return out({ ok: true }); // bot: πολύ γρήγορα ή χωρίς χρόνο
    // Ίδια αποστολή ξανά μέσα σε 10′ (διπλό πάτημα ή επανάληψη bot): δεν ξαναστέλνεται
    const sig = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,
      Object.keys(p).filter((k) => !/^file_|^_elapsed$/.test(k)).sort().map((k) => k + '=' + p[k]).join('&')));
    const cache = CacheService.getScriptCache();
    if (cache.get('s' + sig)) return out({ ok: true });
    if (!underLimit()) { alertOnce('όριο ' + MAX_PER_HOUR + '/ώρα ή ' + MAX_PER_DAY + '/ημέρα'); return out({ ok: false, error: 'busy' }); }
    cache.put('s' + sig, '1', 600);
    const key = FORMS[p._form] ? p._form : 'other';
    const label = FORMS[key] || 'Άλλη φόρμα';
    const folder = subFolder(label);
    const when = new Date();
    const stamp = Utilities.formatDate(when, 'Europe/Athens', 'yyyy-MM-dd HH:mm');

    // Πεδία (ό,τι δεν είναι τεχνικό)
    const isTech = (k) => k.charAt(0) === '_' || k === 'file_count' || /^file_\d+_/.test(k);
    const fields = Object.keys(p).filter((k) => !isTech(k)).slice(0, MAX_FIELDS).map((k) => [clip(k, 60), clip(p[k], MAX_VALUE)]);

    // Αρχεία → Drive
    const blobs = [];
    const links = [];
    const skipped = [];
    let size = 0;
    const n = Math.min(Number(p.file_count || 0), MAX_FILES);
    for (let i = 0; i < n; i++) {
      const data = p['file_' + i + '_data'];
      const type = String(p['file_' + i + '_type'] || '');
      const origName = String(p['file_' + i + '_name'] || '');
      if (!data) continue;
      if (!fileOk(type, origName)) { skipped.push(clip(origName, 80) + ' (τύπος αρχείου)'); continue; } // μόνο φωτογραφίες, PDF και Word
      const bytes = Utilities.base64Decode(data);
      if (bytes.length > MAX_FILE_BYTES || size + bytes.length > MAX_TOTAL_BYTES) { skipped.push(clip(origName, 80) + ' (μέγεθος)'); continue; }
      const safe = (s) => clip(s, 80).replace(/[\\/:*?"<>|]/g, ' ');
      const fname = stamp.slice(0, 10) + ' ' + safe(p.name || 'χωρίς όνομα') + ' - ' + safe(p['file_' + i + '_name'] || 'αρχείο');
      const blob = Utilities.newBlob(bytes, type || 'application/octet-stream', fname);
      const file = folder.createFile(blob);
      links.push([fname, file.getUrl()]);
      size += blob.getBytes().length;
      blobs.push(blob);
    }

    logRow(folder, label, stamp, fields, links);

    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const rows = fields.map(([k, v]) => '<tr><td style="padding:6px 10px;border:1px solid #ddd;color:#666">' + esc(k) +
      '</td><td style="padding:6px 10px;border:1px solid #ddd">' + esc(v).replace(/\n/g, '<br>') + '</td></tr>').join('');
    const files = (links.length
      ? '<p><b>Αρχεία στο Drive:</b><br>' + links.map(([nm, u]) => '<a href="' + u + '">' + esc(nm) + '</a>').join('<br>') + '</p>'
      : '') + (skipped.length ? '<p style="color:#a33"><b>Αρχεία που δεν κρατήθηκαν:</b><br>' + skipped.map(esc).join('<br>') +
      '<br>Ζητήστε τα από τον αποστολέα με WhatsApp ή email.</p>' : '');
    const mail = {
      to: TO,
      subject: clip(p._subject, 120).replace(/[\r\n]+/g, ' ') || ('Νέα φόρμα από το site: ' + label),
      htmlBody: '<p>Νέα αποστολή από τη φόρμα «' + esc(label) + '» στο alexandroshairsalon.gr (' + stamp + ').</p>' +
        '<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">' + rows + '</table>' + files +
        '<p style="color:#888;font-size:12px">Όλες οι αποστολές: φάκελος «' + FORMS_FOLDER + '» στο Drive, φύλλο «Καταγραφή».</p>',
      name: 'alexandroshairsalon.gr'
    };
    if (p.email && /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(String(p.email).trim())) mail.replyTo = String(p.email).trim();
    if (blobs.length && size <= MAX_MAIL_ATTACH) mail.attachments = blobs;
    MailApp.sendEmail(mail);
    return out({ ok: true });
  } catch (err) {
    try {
      MailApp.sendEmail(TO, 'Σφάλμα φόρμας site', 'Η φόρμα «' + (p._form || '') + '» απέτυχε: ' + err + '\n\n' +
        JSON.stringify(Object.keys(p).filter((k) => !/_data$/.test(k)).reduce((o, k) => (o[k] = p[k], o), {}), null, 1));
    } catch (e2) { /* τίποτα */ }
    return out({ ok: false, error: 'server' }); // λεπτομέρειες μόνο στο email, όχι στον επισκέπτη
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function subFolder(label) {
  const root = DriveApp.getFolderById(ROOT_FOLDER_ID);
  const forms = firstOr(root.getFoldersByName(FORMS_FOLDER), () => root.createFolder(FORMS_FOLDER));
  return firstOr(forms.getFoldersByName(label), () => forms.createFolder(label));
}

function firstOr(it, make) {
  return it.hasNext() ? it.next() : make();
}

function logRow(folder, label, stamp, fields, links) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const files = folder.getFilesByName('Καταγραφή');
    let ss;
    if (files.hasNext()) {
      ss = SpreadsheetApp.open(files.next());
    } else {
      ss = SpreadsheetApp.create('Καταγραφή');
      DriveApp.getFileById(ss.getId()).moveTo(folder);
      ss.getSheets()[0].setName(label).appendRow(['Ημερομηνία', 'Αρχεία']);
      ss.getSheets()[0].setFrozenRows(1);
    }
    const sh = ss.getSheets()[0];
    let head = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 2)).getValues()[0].map(String);
    fields.forEach(([k]) => {
      if (head.indexOf(k) < 0) {
        head.push(k);
        sh.getRange(1, head.length).setValue(k);
      }
    });
    const row = head.map((h) => {
      if (h === 'Ημερομηνία') return stamp;
      if (h === 'Αρχεία') return links.map((l) => l[1]).join('\n');
      const f = fields.find(([k]) => k === h);
      return f ? f[1] : '';
    });
    sh.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

/** Τρέξ' το μία φορά από τον editor για να δοθούν οι άδειες (Drive, Sheets, Gmail). */
function setup() {
  subFolder(FORMS.douleia);
  subFolder(FORMS.montela);
  Logger.log('OK');
}
