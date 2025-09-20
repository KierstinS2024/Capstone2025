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
 * Generate an array of 7 ISO date strings starting from a given date.
 * Used for weekly meal plan rendering.
 * If the start date is invalid, returns an empty array.
 */
export function getWeekDates(start: string | null | undefined): string[] {
  if (!start) {
    console.warn("No start date provided to getWeekDates");
    return [];
  }

  const startDate = new Date(start);
  if (isNaN(startDate.getTime())) {
    console.warn("Invalid start date passed to getWeekDates:", start);
    return [];
  }

  const week: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    week.push(d.toISOString().split("T")[0]); // convert to YYYY-MM-DD
  }

  return week;
}

/**
 * Optional helper: add N days to a date string (YYYY-MM-DD)
 * Returns YYYY-MM-DD format or null if invalid
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
