export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function startOfWeek(date: Date): Date {
  const copy = startOfDay(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function toIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromIso(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDay(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(fromIso(iso));
}

export function formatShort(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
  }).format(fromIso(iso));
}

export function weekLabel(monday: Date): string {
  const sunday = addDays(monday, 6);
  const start = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
  }).format(monday);
  const end = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
  }).format(sunday);
  return `${start} – ${end}`;
}

export function addMonths(iso: string, months: number): string {
  const date = fromIso(iso);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, last));
  return toIso(date);
}

export function todayIso(): string {
  return toIso(new Date());
}

export function daysFromToday(days: number): string {
  return toIso(addDays(new Date(), days));
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export function monthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("es-AR", { month: "short" }).format(new Date(year, month - 1, 1));
}

export function lastMonthKeys(count: number): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - index), 1);
    return monthKey(toIso(date));
  });
}

export function formatLong(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(fromIso(iso.slice(0, 10)));
}

export function weekdayShort(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", { weekday: "short" }).format(fromIso(iso));
}
