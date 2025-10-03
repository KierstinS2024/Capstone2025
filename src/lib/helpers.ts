// ===========================================
// PATH: src/lib/helpers.ts
// Shared utility functions for dates and formatting
// Fully TypeScript-safe: no functions return null
// Handles local dates correctly (no UTC shift)
// ===========================================

/**
 * Format a date range for display.
 * Example: "Sep 15 – Sep 21"
 * If start or end is invalid, returns a safe placeholder "—".
 *
 * @param start ISO string or Date for start date
 * @param end ISO string or Date for end date
 * @returns Formatted string like "Sep 15 – Sep 21" or "—"
 */
export function formatDateRange(
  start?: string | Date,
  end?: string | Date
): string {
  const s = start instanceof Date ? start : start ? new Date(start) : null;
  const e = end instanceof Date ? end : end ? new Date(end) : null;

  if (!s || isNaN(s.getTime()) || !e || isNaN(e.getTime())) {
    console.warn("Invalid date passed to formatDateRange:", start, end);
    return "—";
  }

  return `${s.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} – ${e.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

/**
 * Convert YYYY-MM-DD string into a local Date at midnight
 * Avoids UTC shift
 *
 * @param dateStr string "YYYY-MM-DD"
 * @returns Date object at local midnight
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Format a Date object as YYYY-MM-DD
 * Keeps it local (no UTC conversion)
 *
 * @param date Date object
 * @returns string "YYYY-MM-DD"
 */
export function formatLocalDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Get today's date in ISO format YYYY-MM-DD
 * Local version (no UTC shift)
 *
 * @returns string YYYY-MM-DD
 */
export function todayISO(): string {
  return formatLocalDate(new Date());
}

/**
 * Generate an array of YYYY-MM-DD strings from start → end (inclusive)
 * Handles local dates correctly
 *
 * @param start ISO string or Date
 * @param end ISO string or Date
 * @returns array ["YYYY-MM-DD", ...]
 */
export function getWeekDates(
  start: string | Date,
  end: string | Date
): string[] {
  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.warn("Invalid date(s) passed to getWeekDates:", start, end);
    return [];
  }

  const days: string[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    days.push(formatLocalDate(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

/**
 * Add N days to a YYYY-MM-DD string
 * Returns new local YYYY-MM-DD string
 *
 * @param dateStr string "YYYY-MM-DD"
 * @param days number of days to add
 * @returns string "YYYY-MM-DD"
 */
export function addDays(dateStr: string, days: number): string {
  const date = parseLocalDate(dateStr);
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
}
