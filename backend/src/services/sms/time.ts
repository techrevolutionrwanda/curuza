/**
 * Rwanda runs on Central Africa Time (UTC+2) all year, so a fixed offset is
 * both correct and simpler than pulling in a timezone library.
 */

const KIGALI_OFFSET_MS = 2 * 60 * 60 * 1000;

function shifted(date: Date): Date {
  return new Date(date.getTime() + KIGALI_OFFSET_MS);
}

export function kigaliDateKey(date: Date = new Date()): string {
  return shifted(date).toISOString().slice(0, 10);
}

export function kigaliHour(date: Date = new Date()): number {
  return shifted(date).getUTCHours();
}

export function kigaliWeekday(date: Date = new Date()): number {
  return shifted(date).getUTCDay();
}

export function addDaysToKey(key: string, days: number): string {
  const [year, month, day] = key.split("-").map(Number);
  const base = new Date(Date.UTC(year, month - 1, day));
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().slice(0, 10);
}

/** Whole days from `fromKey` to `toKey` (positive means `toKey` is later). */
export function daysBetween(fromKey: string, toKey: string): number {
  const [fy, fm, fd] = fromKey.split("-").map(Number);
  const [ty, tm, td] = toKey.split("-").map(Number);
  const from = Date.UTC(fy, fm - 1, fd);
  const to = Date.UTC(ty, tm - 1, td);
  return Math.round((to - from) / (24 * 60 * 60 * 1000));
}

/** A Kigali wall-clock time on a Kigali date, as a real UTC Date. */
export function kigaliDateAt(dateKey: string, hour: number): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour) - KIGALI_OFFSET_MS);
}

export type SendWindow = {
  sendHour: number;
  quietStart: number;
  quietEnd: number;
  sendOnSunday: boolean;
};

/**
 * The next automatic send slot. Manual reminders use `nextAllowedMoment`, which
 * only enforces quiet hours and can go out immediately during the day.
 */
export function nextSendTime(from: Date, window: SendWindow): Date {
  let key = kigaliDateKey(from);
  if (kigaliHour(from) >= window.sendHour) {
    key = addDaysToKey(key, 1);
  }

  let candidate = kigaliDateAt(key, window.sendHour);
  let guard = 0;
  while (!window.sendOnSunday && kigaliWeekday(candidate) === 0 && guard < 7) {
    key = addDaysToKey(key, 1);
    candidate = kigaliDateAt(key, window.sendHour);
    guard += 1;
  }
  return candidate;
}

export function startOfKigaliDay(date: Date = new Date()): Date {
  return kigaliDateAt(kigaliDateKey(date), 0);
}

/**
 * Only the quiet-hours guard: manual reminders should go out immediately when
 * the shop asks for them during the day, not wait for the automatic send hour.
 */
export function nextAllowedMoment(from: Date, window: SendWindow): Date {
  const key = kigaliDateKey(from);
  const hour = kigaliHour(from);

  if (hour < window.quietStart) return kigaliDateAt(key, window.quietStart);
  if (hour >= window.quietEnd) {
    return kigaliDateAt(addDaysToKey(key, 1), window.quietStart);
  }
  return from;
}

/**
 * Automatic reminders wait for the shop's send hour when the planner runs
 * early, but go out immediately when it is already later that day.
 */
export function nextAutomaticSend(from: Date, window: SendWindow): Date {
  const key = kigaliDateKey(from);
  const hour = kigaliHour(from);

  let candidate: Date;
  if (hour < window.quietStart) {
    candidate = kigaliDateAt(key, window.sendHour);
  } else if (hour < window.quietEnd) {
    candidate = hour < window.sendHour ? kigaliDateAt(key, window.sendHour) : from;
  } else {
    candidate = nextSendTime(from, window);
  }

  if (!window.sendOnSunday) {
    let guard = 0;
    while (kigaliWeekday(candidate) === 0 && guard < 7) {
      candidate = kigaliDateAt(addDaysToKey(kigaliDateKey(candidate), 1), window.sendHour);
      guard += 1;
    }
  }
  return candidate;
}


