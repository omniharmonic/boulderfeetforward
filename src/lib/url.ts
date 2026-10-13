/** Prefix a site path with the configured base (needed on GitHub Pages project sites). */
export function u(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `${base}/${path.replace(/^\//, '')}`;
}

/** Next date for a weekday name, in Mountain Time, as a short label like "Tue, Oct 20". */
export function nextWeekday(day: string, now = new Date()): string {
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const target = names.indexOf(day);
  if (target < 0) return '';
  const mt = new Date(now.toLocaleString('en-US', { timeZone: 'America/Denver' }));
  const diff = (target - mt.getDay() + 7) % 7;
  mt.setDate(mt.getDate() + diff);
  return mt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export const money = (n: number) => '$' + n.toLocaleString('en-US');
