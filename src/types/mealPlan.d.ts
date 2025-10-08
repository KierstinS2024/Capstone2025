// PATH: src/types/mealPlan.ts
// -----------------------------
// Types for Meal Planning
// -----------------------------

export type MealType = "breakfast" | "lunch" | "dinner";

// Represents a day's meals
export interface DayMeals {
  breakfast: string; // recipeId or empty string
  lunch: string;
  dinner: string;
}

// Full meal plan object
export interface MealPlan {
  id: string;
  ownerEmail: string;
  meals: Record<string, DayMeals>; // keyed by YYYY-MM-DD
  startDate?: string; // optional start date for display
  endDate?: string; // optional end date for display
}
