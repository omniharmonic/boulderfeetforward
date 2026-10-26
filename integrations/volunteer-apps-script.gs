/**
 * Volunteer sign-ups -> a private Google Sheet.
 * Boulder Feet Forward. Designed and built by Benjamin Life (@omniharmonic) as a gift.
 *
 * SET-UP (about 3 minutes, done once):
 *   1. Open the Google Sheet "BFF volunteer sign-ups" (or create one). Keep it private.
 *   2. In the Sheet: Extensions, Apps Script. Delete what is there and paste this whole file. Save.
 *   3. Deploy, New deployment, type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *      (The address it gives you only accepts new rows. It cannot read the Sheet.)
 *   4. Copy the web app URL. In the site editor, open "Site settings and numbers", then
 *      "Contact, links and sign-ups", and paste it into "Volunteer sign-up address". Save.
 *   5. NOTIFY_EMAIL below gets an email for each new sign-up. The first time, pick "authorize" in the
 *      function menu at the top and press Run, so Google asks once for permission to send email.
 *      After changing this file: Deploy, Manage deployments, edit (pencil), Version: New version, Deploy.
 *      That keeps the same web address.
 *
 * To check hours later, use the "Status" and "Hours" columns in the Sheet. Nothing on the website
 * reads from it, so you can reorganize the Sheet however you like.
 */
const NOTIFY_EMAIL = 'libby@feetforwardboulder.org';   // who hears about each sign-up. Separate several with commas. '' for none.
// Only needed if this script is NOT opened from the Sheet (Extensions, Apps Script): paste the Sheet's ID,
// the long code in its address between /d/ and /edit.
const SHEET_ID = '';
const HEADERS = ['Timestamp', 'Name', 'Contact', 'Shift', 'Date', 'People', 'Notes', 'Status', 'Hours confirmed'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const ss = (SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet());
    const sheet = ss.getSheets()[0];  // the first tab, whatever it is called
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
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
      const contact = String(data.contact || '').trim();
      const options = { name: 'BFF website' };
      if (/^\S+@\S+\.\S+$/.test(contact)) options.replyTo = contact;  // reply goes straight to the volunteer
      try {
        MailApp.sendEmail(NOTIFY_EMAIL, 'New volunteer sign-up: ' + clean(data.name, 80),
          'Someone signed up to volunteer on the website.\n\n' +
          'Name: ' + clean(data.name) + '\nContact: ' + clean(data.contact) + '\nShift: ' + clean(data.shift) +
          '\nDate: ' + (clean(data.date) || 'any') + '\nPeople: ' + clean(data.people) + '\nNotes: ' + clean(data.notes) +
          '\n\nAll sign-ups: ' + ss.getUrl(), options);
      } catch (err) { console.error(err); }  // the row is already saved; a mail hiccup must not lose it
    }
    return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('This address accepts volunteer sign-ups from the BFF website.');
}

// Run this once from the editor so Google asks for permission to send the notification emails.
function authorize() {
  MailApp.getRemainingDailyQuota();
}
