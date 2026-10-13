/* Wellness wheel: hover, focus or tap a segment and the panel changes. Arrow keys, Home and End work too. */
document.querySelectorAll<HTMLElement>('[data-wheel]').forEach((root) => {
  const segs = Array.from(root.querySelectorAll<SVGGElement>('.seg'));
  const panel = root.querySelector<HTMLElement>('.dim-panel');
  const contents = Array.from(root.querySelectorAll<HTMLElement>('.dim-content'));
  if (!segs.length || !panel) return;

  const select = (slug: string, moveFocus = false) => {
    // Already showing this one: do nothing, so the panel does not replay its fade-in.
    if (panel.dataset.dim === slug) {
      if (moveFocus) (segs.find((s) => s.dataset.dim === slug) as unknown as HTMLElement | undefined)?.focus();
      return;
    }
    segs.forEach((s) => {
      const on = s.dataset.dim === slug;
      s.setAttribute('aria-selected', String(on));
      s.setAttribute('tabindex', on ? '0' : '-1');
      if (on && moveFocus) (s as unknown as HTMLElement).focus();
    });
    panel.dataset.dim = slug;
    contents.forEach((c) => {
      const on = c.dataset.dim === slug;
      c.hidden = !on;
      c.classList.remove('fade');
      if (on) { void c.offsetWidth; c.classList.add('fade'); }
    });
  };

  segs.forEach((s, i) => {
    s.addEventListener('pointerenter', (e) => { if ((e as PointerEvent).pointerType === 'mouse') select(s.dataset.dim!); });
    s.addEventListener('click', () => select(s.dataset.dim!));
    s.addEventListener('focus', () => select(s.dataset.dim!));
    s.addEventListener('keydown', (e) => {
      const k = (e as KeyboardEvent).key;
      let n = -1;
      if (k === 'ArrowRight' || k === 'ArrowDown') n = (i + 1) % segs.length;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (i - 1 + segs.length) % segs.length;
      else if (k === 'Home') n = 0;
      else if (k === 'End') n = segs.length - 1;
      else if (k === 'Enter' || k === ' ') { e.preventDefault(); select(s.dataset.dim!); return; }
      if (n >= 0) { e.preventDefault(); select(segs[n].dataset.dim!, true); }
    });
  });
});
