/* Theme, mobile menu, smooth scroll, header shadow, "next date" labels, newsletter form. */
import Lenis from 'lenis';

const root = document.documentElement;
const reduce = () => root.classList.contains('reduce') || matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- theme ---- */
const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
toggle?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day');
  const next = current === 'night' ? 'day' : 'night';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('bff-theme', next); } catch {}
  window.dispatchEvent(new Event('bff:themechange'));
});

/* ---- mobile menu ---- */
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const nav = document.querySelector<HTMLElement>('[data-nav]');
const setMenu = (open: boolean) => {
  nav?.setAttribute('data-open', String(open));
  menuBtn?.setAttribute('aria-expanded', String(open));
};
menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
nav?.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

/* ---- header border once scrolled ---- */
const header = document.querySelector('[data-header]');
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

/* ---- smooth scroll (off for reduced motion) ---- */
if (!reduce()) {
  const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 0.95, anchors: { offset: -80 } } as any);
  const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  (window as any).__lenis = lenis;
}

/* ---- "next Tuesday" labels, computed in the visitor's browser so they never go stale ---- */
const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
document.querySelectorAll<HTMLElement>('[data-next]').forEach((el) => {
  const target = names.indexOf(el.dataset.next || '');
  if (target < 0) return;
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Denver' }));
  d.setDate(d.getDate() + ((target - d.getDay() + 7) % 7));
  el.textContent = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
});

/* ---- newsletter ---- */
document.querySelectorAll<HTMLFormElement>('[data-newsletter]').forEach((form) => {
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const say = (msg: string, ok: boolean) => { status.textContent = msg; status.className = 'status ' + (ok ? 'ok' : 'err'); };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const trap = (form.elements.namedItem('website') as HTMLInputElement).value;
    if (!/^\S+@\S+\.\S+$/.test(email)) return say('Enter an email address like name@example.com.', false);
    if (trap) return say('You are on the list.', true);
    const action = form.dataset.action;
    if (!action) { location.href = (form.dataset.mailto || '') ; return say('Opening your email app so you can send us a note. We will add you by hand.', true); }
    const body = new URLSearchParams();
    body.set(form.dataset.field || 'email_address', email);
    if (form.dataset.hp) body.set(form.dataset.hp, '');
    try {
      await fetch(action, { method: 'POST', mode: 'no-cors', body });
      form.reset();
      // A Google Sheet sends no confirmation email; a real email service usually does.
      say(action.includes('script.google.com') ? 'You are on the list. Thank you.' : 'You are on the list. Check your email to confirm.', true);
    } catch {
      say('That did not go through. Try again, or email us and we will add you.', false);
    }
  });
});
