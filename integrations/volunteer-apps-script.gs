/**
 * Volunteer sign-ups -> a private Google Sheet.
 * Boulder Feet Forward. Designed and built by Benjamin Life (@omniharmonic) as a gift.
 *
 * SET-UP (about 5 minutes, done once, signed in as the BFF Google account):
 *   1. Create a new Google Sheet named "BFF volunteer sign-ups". Keep it private.
 *   2. In the Sheet: Extensions, Apps Script. Delete what is there and paste this whole file. Save.
 *   3. Deploy, New deployment, type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *      (The address it gives you only accepts new rows. It cannot read the Sheet.)
 *   4. Copy the web app URL. In the site editor, open "Site settings and numbers", then
 *      "Contact, links and sign-ups", and paste it into "Volunteer sign-up address". Save.
 *   5. Optional: set NOTIFY_EMAIL below to get an email for each new sign-up.
 *
 * To check hours later, use the "Status" and "Hours" columns in the Sheet. Nothing on the website
 * reads from it, so you can reorganize the Sheet however you like.
 */
const NOTIFY_EMAIL = '';   // for example 'libby@feetforwardboulder.org'. Leave '' for no emails.
const SHEET_NAME = 'Sign-ups';
const HEADERS = ['Timestamp', 'Name', 'Contact', 'Shift', 'Date', 'People', 'Notes', 'Status', 'Hours confirmed'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    const clean = (v, max) => String(v == null ? '' : v).replace(/^[=+\-@]/, "'$&").slice(0, max || 300);  // stops spreadsheet-formula injection
    if (!clean(data.name) || !clean(data.contact)) {
      return ContentService.createTextOutput('missing').setMimeType(ContentService.MimeType.TEXT);
    }
    sheet.appendRow([
      new Date(),
      clean(data.name, 120),
      clean(data.contact, 160),
      clean(data.shift, 120),
      clean(data.date, 40),
      clean(data.people, 10),
      clean(data.notes, 1000),
      'New',
      '',
    ]);
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, 'New volunteer sign-up: ' + clean(data.name, 80),
        'Name: ' + clean(data.name) + '\nContact: ' + clean(data.contact) + '\nShift: ' + clean(data.shift) +
        '\nDate: ' + clean(data.date) + '\nPeople: ' + clean(data.people) + '\nNotes: ' + clean(data.notes));
    }
    return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('This address accepts volunteer sign-ups from the BFF website.');
}
