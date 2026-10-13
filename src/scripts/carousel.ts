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
  window.addEventListener('resize', fit);
  if ('ResizeObserver' in window) { const ro = new ResizeObserver(fit); slides.forEach((s) => ro.observe(s)); }
  const go = (i: number) => {
    const n = Math.max(0, Math.min(slides.length - 1, i));
    scroller.scrollTo({ left: slides[n].offsetLeft - scroller.offsetLeft, behavior: reduce() ? 'auto' : 'smooth' });
    mark(n);
  };
  prev?.addEventListener('click', () => go(index - 1));
  next?.addEventListener('click', () => go(index + 1));
  dots.forEach((d, n) => d.addEventListener('click', () => go(n)));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting && e.intersectionRatio > 0.6) mark(slides.indexOf(e.target as HTMLElement)); });
  }, { root: scroller, threshold: [0.6] });
  slides.forEach((s) => io.observe(s));
  mark(0);
});
