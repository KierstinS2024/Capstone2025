// Path: src/types/mealPlan.d.ts
// Type definitions for meal planning feature

/**
 * Meal types for UI/UX consistency
 */
export type MealType = "Breakfast" | "Lunch" | "Dinner";

/**
 * Ingredient used in a meal plan entry
 */
export interface MealIngredient {
  name: string;
  quantity: string;
  category?: string; // optional: e.g., produce, dairy
}

/**
 * Single meal entry in a meal plan
 */
export interface MealPlanEntry {
  date: string; // ISO date string
  mealType: MealType;
  recipeId: string;
  recipeTitle?: string; // optional, for UI display
  recipeImage?: string; // optional, for UI display
  ingredients: MealIngredient[];
}

/**
 * Meal plan type
 */
export interface MealPlan {
  _id: string;
  userId: string;
  title: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  entries: MealPlanEntry[];
}

/**
 * Payload for creating a new meal plan
 */
export interface CreateMealPlanPayload {
  title: string;
  startDate: string;
  endDate: string;
  entries?: MealPlanEntry[];
}
