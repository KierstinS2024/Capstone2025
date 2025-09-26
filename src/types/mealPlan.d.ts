// ===========================================
// PATH: src/types/mealPlan.d.ts
// TypeScript types for MealPlan
// Fully type-safe: startDate/endDate always strings
// ===========================================

/**
 * Meal types for each slot in a day
 */
export type MealType = "breakfast" | "lunch" | "dinner";

/**
 * Frontend-facing MealPlan interface
 * - Dates are always ISO strings (YYYY-MM-DD)
 * - Meals object maps date → meal slots
 * - Handles optional fields safely
 */
export interface MealPlan {
  id: string; // normalized from MongoDB _id
  title: string; // plan title
  startDate: string; // ISO string (YYYY-MM-DD)
  endDate: string; // ISO string (YYYY-MM-DD)
  meals: {
    [date: string]: {
      breakfast?: string | null; // recipe ID or null
      lunch?: string | null;
      dinner?: string | null;
    };
  };
  user?: string; // owner ID, optional
  createdAt?: string; // ISO string timestamp
  updatedAt?: string; // ISO string timestamp
}

/**
 * Default empty plan for new users (no plan yet)
 * - Ensures startDate/endDate are always valid strings
 */
export const EMPTY_PLAN: MealPlan = {
  id: "empty",
  title: "New Meal Plan",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(new Date().setDate(new Date().getDate() + 6))
    .toISOString()
    .split("T")[0],
  meals: {},
};
