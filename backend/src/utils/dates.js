export function todayISO() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(isoDateStr, days) {
  const [y, m, d] = isoDateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isPastDeadline(deadline) {
  if (!deadline) return false;
  return String(deadline).trim() < todayISO();
}

export function formatDisplayDate(isoDateStr) {
  if (!isoDateStr) return '';
  const [y, m, d] = isoDateStr.split('-').map(Number);
  if (!y || !m || !d) return isoDateStr;
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
