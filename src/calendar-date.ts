export function makeDate(year: number, month: number, day = 1) {
  const value = new Date(0);
  value.setUTCHours(0, 0, 0, 0);
  value.setUTCFullYear(year, month, day);
  return value;
}

export function dateKey(value: Date) {
  return `${String(value.getUTCFullYear()).padStart(4, "0")}-${String(value.getUTCMonth() + 1).padStart(2, "0")}-${String(value.getUTCDate()).padStart(2, "0")}`;
}

export function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1 || year > 9999) return null;
  const result = makeDate(year, month - 1, day);
  return dateKey(result) === value ? result : null;
}

export function addDays(value: string, amount: number) {
  const date = parseDate(value)!;
  return dateKey(makeDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + amount));
}

export function moveMonth(value: string, amount: number) {
  const date = parseDate(value)!;
  const target = makeDate(date.getUTCFullYear(), date.getUTCMonth() + amount);
  const lastDay = makeDate(target.getUTCFullYear(), target.getUTCMonth() + 1, 0).getUTCDate();
  return dateKey(makeDate(target.getUTCFullYear(), target.getUTCMonth(), Math.min(date.getUTCDate(), lastDay)));
}

export function inRange(value: string, min = "", max = "") {
  return Boolean(parseDate(value)) && (!min || value >= min) && (!max || value <= max);
}

export function clampDate(value: string, min = "", max = "") {
  if (min && value < min) return min;
  if (max && value > max) return max;
  return value;
}

export function calendarDays(value: string) {
  const date = parseDate(value)!;
  const first = makeDate(date.getUTCFullYear(), date.getUTCMonth());
  const offset = (first.getUTCDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, index) => makeDate(first.getUTCFullYear(), first.getUTCMonth(), 1 - offset + index));
}

export function todayInZone(timeZone: string, now = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
    return ["year", "month", "day"].map(type => parts.find(part => part.type === type)!.value).join("-");
  } catch {
    return dateKey(makeDate(now.getFullYear(), now.getMonth(), now.getDate()));
  }
}

export function minimumSelectableDate(min = "", timeZone = "Asia/Karachi", now = new Date()) {
  const today = todayInZone(timeZone, now);
  return parseDate(min) && min > today ? min : today;
}
