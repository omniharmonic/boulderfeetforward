/* The trail: one path down the left rail that draws as you scroll, with footprints landing along it.
   Static (fully drawn) for reduced motion. Without JS the rail is simply empty. */

const SVGNS = 'http://www.w3.org/2000/svg';
const FEET = { l: { id: 'foot-l', ratio: 136.2 / 311.3 }, r: { id: 'foot-r', ratio: 162.4 / 325.3 } };

function el<K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string | number> = {}) {
  const n = document.createElementNS(SVGNS, name);
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  return n;
}

const stage = document.querySelector<HTMLElement>('[data-stage]');
const host = stage?.querySelector<HTMLElement>('.trail');

if (stage && host) {
  const reduce = () => document.documentElement.classList.contains('reduce');
  let steps: { g: SVGGElement; s: number }[] = [];
  let draw: SVGPathElement | null = null;
  let len = 0;
  let top = 0;
  let height = 0;
  let frame = 0;

  const build = () => {
    host.replaceChildren();
    const w = host.clientWidth;
    height = host.clientHeight;
    if (w < 20 || height < 200) return;
    const rect = stage.getBoundingClientRect();
    top = rect.top + scrollY;

    // a gentle meander: swing from side to side every ~280px
    const pts: [number, number][] = [[w * 0.5, 0]];
    const step = Math.max(220, Math.min(320, height / 14));
    for (let y = step * 0.6, i = 0; y < height - step * 0.4; y += step, i++) pts.push([w * (i % 2 ? 0.78 : 0.22), y]);
    pts.push([w * 0.5, height]);
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const k = (y1 - y0) * 0.5;
      d += ` C ${x0} ${y0 + k}, ${x1} ${y1 - k}, ${x1} ${y1}`;
    }

    const svg = el('svg', { viewBox: `0 0 ${w} ${height}`, preserveAspectRatio: 'none', 'aria-hidden': 'true' });
    const defs = el('defs');
    const grad = el('linearGradient', { id: 'trail-grad', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 0, y2: height });
    [['0', '--g0'], ['0.35', '--g1'], ['0.7', '--g2'], ['1', '--g3']].forEach(([o, v]) => {
      const s = el('stop', { offset: o });
      s.setAttribute('style', `stop-color:var(${v})`);
      grad.append(s);
    });
    defs.append(grad);
    const base = el('path', { d, class: 'path-base' });
    draw = el('path', { d, class: 'path-draw' }) as SVGPathElement;
    svg.append(defs, base, draw);
    len = (draw as SVGPathElement).getTotalLength();
    draw.style.strokeDasharray = String(len);

    // footprints, alternating left and right, pointing the way we are walking
    const footH = Math.max(18, Math.min(46, w * 0.42));
    const gap = Math.max(110, footH * 3.4);
    steps = [];
    for (let i = 0, s = 60; s < len - 30; i++, s += gap) {
      const p = draw.getPointAtLength(s);
      const q = draw.getPointAtLength(s + 2);
      const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
      const tx = Math.cos((ang * Math.PI) / 180);
      const ty = Math.sin((ang * Math.PI) / 180);
      const left = i % 2 === 0;
      const off = footH * 0.32 * (left ? 1 : -1);
      const foot = left ? FEET.l : FEET.r;
      const fw = footH * foot.ratio;
      const g = el('g', { class: 'step', transform: `translate(${p.x + ty * off} ${p.y - tx * off}) rotate(${ang + 90 + (left ? 8 : -8)})` }) as SVGGElement;
      const use = el('use', { href: `#${foot.id}`, x: -fw / 2, y: -footH / 2, width: fw, height: footH });
      g.append(use);
      g.style.color = `color-mix(in oklab, var(--leaf), var(--gold) ${Math.round((s / len) * 100)}%)`;
      svg.append(g);
      steps.push({ g, s });
    }
    host.append(svg);
    update();
  };

  const update = () => {
    frame = 0;
    if (!draw) return;
    const p = reduce() ? 1 : Math.max(0, Math.min(1, (scrollY + innerHeight * 0.7 - top) / height));
    const shown = len * p;
    draw.style.strokeDashoffset = String(len - shown);
    for (const { g, s } of steps) g.classList.toggle('on', s <= shown);
  };

  const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
  addEventListener('scroll', queue, { passive: true });

  let t = 0;
  const rebuild = () => { clearTimeout(t); t = window.setTimeout(build, 120); };
  new ResizeObserver(rebuild).observe(stage);
  addEventListener('resize', rebuild);
  addEventListener('load', build);
  build();
}
