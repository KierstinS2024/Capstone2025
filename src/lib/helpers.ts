export function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export function mapCategory(
  raw: string
): "produce" | "meat" | "dairy" | "frozen" | "other" {
  const lower = raw.toLowerCase();
  if (lower.includes("vegetable") || lower.includes("fruit")) return "produce";
  if (
    lower.includes("chicken") ||
    lower.includes("beef") ||
    lower.includes("pork")
  )
    return "meat";
  if (
    lower.includes("milk") ||
    lower.includes("cheese") ||
    lower.includes("yogurt")
  )
    return "dairy";
  if (lower.includes("frozen")) return "frozen";
  return "other";
}
