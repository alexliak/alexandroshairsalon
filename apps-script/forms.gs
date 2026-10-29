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
const TO = 'liakopoulosalex@gmail.com';
const ROOT_FOLDER_ID = '1LUwZab7IJZkzZ61bRK0tWXUCm1MBlIst'; // Alexandros Hair Salon (Drive)
const FORMS_FOLDER = '6 Φόρμες site';
const FORMS = { douleia: 'Αιτήσεις εργασίας', montela: 'Μοντέλα μαλλιών' };
const MAX_MAIL_ATTACH = 20 * 1024 * 1024; // όριο συνημμένων Gmail ~25 MB

function doGet() {
  return out({ ok: true, service: 'alexandroshairsalon.gr forms' });
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p._honey) return out({ ok: true }); // bot
    const key = FORMS[p._form] ? p._form : 'other';
    const label = FORMS[key] || 'Άλλη φόρμα';
    const folder = subFolder(label);
    const when = new Date();
    const stamp = Utilities.formatDate(when, 'Europe/Athens', 'yyyy-MM-dd HH:mm');

    // Πεδία (ό,τι δεν είναι τεχνικό)
    const isTech = (k) => k.charAt(0) === '_' || k === 'file_count' || /^file_\d+_/.test(k);
    const fields = Object.keys(p).filter((k) => !isTech(k)).map((k) => [k, String(p[k])]);

    // Αρχεία → Drive
    const blobs = [];
    const links = [];
    let size = 0;
    const n = Math.min(Number(p.file_count || 0), 10);
    for (let i = 0; i < n; i++) {
      const data = p['file_' + i + '_data'];
      if (!data) continue;
      const fname = stamp.slice(0, 10) + ' ' + (p.name || 'χωρίς όνομα') + ' - ' + (p['file_' + i + '_name'] || 'αρχείο');
      const blob = Utilities.newBlob(Utilities.base64Decode(data), p['file_' + i + '_type'] || 'application/octet-stream', fname);
      const file = folder.createFile(blob);
      links.push([fname, file.getUrl()]);
      size += blob.getBytes().length;
      blobs.push(blob);
    }

    logRow(folder, label, stamp, fields, links);

    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const rows = fields.map(([k, v]) => '<tr><td style="padding:6px 10px;border:1px solid #ddd;color:#666">' + esc(k) +
      '</td><td style="padding:6px 10px;border:1px solid #ddd">' + esc(v).replace(/\n/g, '<br>') + '</td></tr>').join('');
    const files = links.length
      ? '<p><b>Αρχεία στο Drive:</b><br>' + links.map(([nm, u]) => '<a href="' + u + '">' + esc(nm) + '</a>').join('<br>') + '</p>'
      : '';
    const mail = {
      to: TO,
      subject: p._subject || ('Νέα φόρμα από το site: ' + label),
      htmlBody: '<p>Νέα αποστολή από τη φόρμα «' + esc(label) + '» στο alexandroshairsalon.gr (' + stamp + ').</p>' +
        '<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">' + rows + '</table>' + files +
        '<p style="color:#888;font-size:12px">Όλες οι αποστολές: φάκελος «' + FORMS_FOLDER + '» στο Drive, φύλλο «Καταγραφή».</p>',
      name: 'alexandroshairsalon.gr'
    };
    if (p.email && /@/.test(p.email)) mail.replyTo = p.email;
    if (blobs.length && size <= MAX_MAIL_ATTACH) mail.attachments = blobs;
    MailApp.sendEmail(mail);
    return out({ ok: true });
  } catch (err) {
    try {
      MailApp.sendEmail(TO, 'Σφάλμα φόρμας site', 'Η φόρμα «' + (p._form || '') + '» απέτυχε: ' + err + '\n\n' +
        JSON.stringify(Object.keys(p).filter((k) => !/_data$/.test(k)).reduce((o, k) => (o[k] = p[k], o), {}), null, 1));
    } catch (e2) { /* τίποτα */ }
    return out({ ok: false, error: String(err) });
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
