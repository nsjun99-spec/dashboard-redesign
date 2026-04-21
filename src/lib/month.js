export function normalizeMonthKey(input) {
  if (!input) return null;
  if (input instanceof Date && !Number.isNaN(input.getTime())) {
    return `${input.getFullYear()}-${String(input.getMonth() + 1).padStart(2, '0')}`;
  }
  const raw = String(input).trim();
  if (!raw) return null;
  const direct = raw.match(/(20\d{2})[-./\s]?(\d{1,2})/);
  if (direct) return `${direct[1]}-${String(Number(direct[2])).padStart(2, '0')}`;
  const korean = raw.match(/(\d{2,4})\s*년\s*(\d{1,2})\s*월/);
  if (korean) {
    const y = Number(korean[1]);
    const year = y < 100 ? 2000 + y : y;
    return `${year}-${String(Number(korean[2])).padStart(2, '0')}`;
  }
  return null;
}

export function monthLabel(monthKey) {
  if (!monthKey) return "-";
  const [y, m] = monthKey.split("-");
  return `${y}년 ${Number(m)}월`;
}

export function getPreviousMonth(monthKey) {
  if (!monthKey) return null;
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
