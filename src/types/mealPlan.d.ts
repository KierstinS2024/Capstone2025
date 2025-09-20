// ===========================================
// PATH: src/types/mealPlan.d.ts
// ===========================================

export type MealType = "breakfast" | "lunch" | "dinner";

/**
 * A MealPlan represents a week of scheduled meals.
 * Meals are stored as a map keyed by date string (YYYY-MM-DD).
 */
export interface MealPlan {
  id: string; // normalized from Mongo _id
  title: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  meals: {
    [date: string]: {
      breakfast?: string | null; // recipeId or null
      lunch?: string | null;
      dinner?: string | null;
    };
  };
  user?: string; // optional: owner ID (set server-side)
  createdAt?: string;
  updatedAt?: string;
}
