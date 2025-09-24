// ===========================================
// PATH: src/lib/helpers.ts
// Shared utility functions for dates and formatting
// ===========================================

/**
 * Format a date range for display.
 * Example: "Sep 15 – Sep 21"
 * If start or end is invalid, returns a safe placeholder.
 */
export function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined
): string {
  // Convert strings to Date objects
  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : null;

  // Validate dates
  if (!s || isNaN(s.getTime()) || !e || isNaN(e.getTime())) {
    console.warn("Invalid date passed to formatDateRange:", start, end);
    return "—"; // fallback display
  }

  // Return formatted short month/day strings
  return `${s.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} – ${e.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

/**
 * Get today's date in ISO format YYYY-MM-DD
 */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Generate an array of ISO date strings from start → end (inclusive).
 * Used for rendering custom-length meal plans (default = 7 days).
 * If start or end are invalid, returns an empty array.
 */
export function getWeekDates(
  start: string | null | undefined,
  end: string | null | undefined
): string[] {
  if (!start || !end) {
    console.warn("Missing start or end date in getWeekDates:", start, end);
    return [];
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.warn("Invalid date(s) passed to getWeekDates:", start, end);
    return [];
  }

  const days: string[] = [];
  let current = new Date(startDate);

  // Walk from start → end, inclusive
  while (current <= endDate) {
    days.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return days;
}

/**
 * Add N days to a date string (YYYY-MM-DD).
 * Returns YYYY-MM-DD format or null if invalid.
 */
export function addDays(dateStr: string, days: number): string | null {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.warn("Invalid date passed to addDays:", dateStr);
    return null;
  }
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}
