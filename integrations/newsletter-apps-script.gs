/**
 * Newsletter sign-ups -> a private Google Sheet.
 * Boulder Feet Forward. Designed and built by Benjamin Life (@omniharmonic) as a gift.
 *
 * Use this until BFF connects a real email service. When it does, import the Sheet's emails into
 * that service and change the three newsletter settings in the site editor (see DEPLOY.md, Part 8).
 *
 * SET-UP (about 3 minutes, done once):
 *   1. Open the Google Sheet "BFF newsletter sign-ups". Keep it private.
 *   2. Extensions, Apps Script. Delete what is there and paste this whole file. Save.
 *   3. Deploy, New deployment, type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *      (The address it gives you only accepts new rows. It cannot read the Sheet.)
 *   4. Copy the web app URL. In the site editor, open "Site settings and numbers", then
 *      "Contact, links and sign-ups", and paste it into "Newsletter form address".
 *      Set "Newsletter email field name" to  email_address  and leave the spam-trap field empty. Save.
 */
const NOTIFY_EMAIL = '';   // for example 'libby@feetforwardboulder.org'. Leave '' for no emails.
// Only needed if this script is NOT opened from the Sheet (Extensions, Apps Script): paste the Sheet's ID,
// the long code in its address between /d/ and /edit.
const SHEET_ID = '';
const HEADERS = ['Timestamp', 'Email', 'Status'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    const email = String(p.email_address || p.email || '').trim().toLowerCase().slice(0, 200);
    if (!/^\S+@\S+\.\S+$/.test(email) || /^[=+\-@]/.test(email)) {
      return ContentService.createTextOutput('invalid').setMimeType(ContentService.MimeType.TEXT);
    }
    const sheet = (SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet()).getSheets()[0];  // the first tab
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    // Skip someone who is already on the list.
    const last = sheet.getLastRow();
    if (last > 1) {
      const existing = sheet.getRange(2, 2, last - 1, 1).getValues().map((r) => String(r[0]).toLowerCase());
      if (existing.indexOf(email) !== -1) return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
    }
    sheet.appendRow([new Date(), email, 'New']);
    if (NOTIFY_EMAIL) MailApp.sendEmail(NOTIFY_EMAIL, 'New newsletter sign-up', email);
    return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
  } finally {
    lock.releaseLock();
  }
}
