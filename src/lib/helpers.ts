// PATH: src/lib/helpers.ts
// Utility functions shared across client + server.

export function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} – ${e.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`;
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}
