/* Volunteer sign-up: "I'm in" buttons open a short form. It posts to BFF's own Google Sheet
   (via the Apps Script in integrations/), or falls back to a pre-filled email. */
const dialog = document.querySelector<HTMLDialogElement>('dialog.vol');
if (dialog) {
  const form = dialog.querySelector<HTMLFormElement>('form')!;
  const status = dialog.querySelector<HTMLElement>('[data-status]')!;
  const shiftField = form.elements.namedItem('shift') as HTMLSelectElement;
  const dateField = form.elements.namedItem('date') as HTMLInputElement;
  const say = (m: string, ok: boolean) => { status.textContent = m; status.className = 'status ' + (ok ? 'ok' : 'err'); };

  document.querySelectorAll<HTMLElement>('[data-volunteer-open]').forEach((b) =>
    b.addEventListener('click', () => {
      status.textContent = '';
      if (b.dataset.shift) shiftField.value = b.dataset.shift;
      if (b.dataset.date) dateField.value = b.dataset.date;
      dialog.showModal();
      (form.elements.namedItem('name') as HTMLInputElement).focus();
    }),
  );
  dialog.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (data.website) return say('Thank you. We will be in touch.', true);
    if (!data.name?.trim() || !data.contact?.trim()) return say('Add your name and an email or phone number so we can reach you.', false);
    const endpoint = form.dataset.endpoint;
    const mailto = form.dataset.mailto || '';
    if (!endpoint) {
      const body = `Name: ${data.name}\nEmail or phone: ${data.contact}\nShift: ${data.shift}\nDate: ${data.date || 'any'}\nPeople: ${data.people || '1'}\nNotes: ${data.notes || ''}`;
      location.href = `${mailto}&body=${encodeURIComponent(body)}`;
      return say('Opening your email app with your details filled in. Press send and we will take it from there.', true);
    }
    try {
      await fetch(endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data) });
      form.reset();
      say('You are signed up. We will confirm by email or text.', true);
    } catch {
      say('That did not go through. Please email us instead and we will add you.', false);
    }
  });
}
