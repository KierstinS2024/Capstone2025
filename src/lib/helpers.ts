// ===========================================
// PATH: src/lib/helpers.ts
// Shared utility functions for dates and formatting
// Fully TypeScript-safe: no functions return null
// ===========================================

/**
 * Format a date range for display.
 * Example: "Sep 15 – Sep 21"
 * If start or end is invalid, returns a safe placeholder "—".
 *
 * @param start ISO string for start date
 * @param end ISO string for end date
 * @returns Formatted string like "Sep 15 – Sep 21" or "—"
 */
export function formatDateRange(
  start: string | undefined,
  end: string | undefined
): string {
  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : null;

  // Validate that both dates are valid
  if (!s || isNaN(s.getTime()) || !e || isNaN(e.getTime())) {
    console.warn("Invalid date passed to formatDateRange:", start, end);
    return "—"; // safe fallback
  }

  // Return short month/day format
  return `${s.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} – ${e.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

/**
 * Get today's date in ISO format YYYY-MM-DD
 *
 * @returns string YYYY-MM-DD
 */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Generate an array of ISO date strings from start → end (inclusive)
 * Used for rendering meal plans week by week.
 * If dates are invalid, returns an empty array.
 *
 * @param start ISO string start date
 * @param end ISO string end date
 * @returns array of strings ["YYYY-MM-DD", ...]
 */
export function getWeekDates(start: string, end: string): string[] {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.warn("Invalid date(s) passed to getWeekDates:", start, end);
    return [];
  }

  const days: string[] = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    days.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1); // increment by 1 day
  }

  return days;
}

/**
 * Add N days to a date string (YYYY-MM-DD).
 * Fully type-safe: never returns null.
 * If the input date is invalid, returns today's date as fallback.
 *
 * @param dateStr ISO string "YYYY-MM-DD"
 * @param days Number of days to add
 * @returns new ISO string "YYYY-MM-DD"
 */
export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    console.warn(
      "Invalid date passed to addDays, using today instead:",
      dateStr
    );
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + days);
    return fallback.toISOString().split("T")[0];
  }

  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}
