/* Testimonial carousel: native scroll-snap, plus buttons and dot tabs. No auto-advance. */
document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
  const scroller = root.querySelector<HTMLElement>('.quotes')!;
  const slides = Array.from(scroller.children) as HTMLElement[];
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('.q-dots button'));
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-next]');
  const reduce = () => document.documentElement.classList.contains('reduce');
  let index = 0;

  const mark = (i: number) => {
    index = i;
    dots.forEach((d, n) => d.setAttribute('aria-selected', String(n === i)));
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === slides.length - 1;
    fit();
  };
  // Size the scroller to the visible quote, so short quotes do not leave a gap under them.
  const fit = () => { scroller.style.height = slides[index].offsetHeight + 'px'; };
  window.addEventListener('resize', () => { fit(); scroller.scrollTo({ left: slides[index].offsetLeft - scroller.offsetLeft, behavior: 'auto' }); });
  if ('ResizeObserver' in window) { const ro = new ResizeObserver(fit); slides.forEach((s) => ro.observe(s)); }
  const go = (i: number) => {
    const n = Math.max(0, Math.min(slides.length - 1, i));
    scroller.scrollTo({ left: slides[n].offsetLeft - scroller.offsetLeft, behavior: reduce() ? 'auto' : 'smooth' });
    mark(n);
  };
  prev?.addEventListener('click', () => go(index - 1));
  next?.addEventListener('click', () => go(index + 1));
  dots.forEach((d, n) => d.addEventListener('click', () => go(n)));
  // The box does not scroll by itself. A sideways swipe or the arrow keys move between quotes.
  let x0 = 0, y0 = 0;
  scroller.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  scroller.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
  }, { passive: true });
  scroller.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting && e.intersectionRatio > 0.6) mark(slides.indexOf(e.target as HTMLElement)); });
  }, { root: scroller, threshold: [0.6] });
  slides.forEach((s) => io.observe(s));
  mark(0);
});
