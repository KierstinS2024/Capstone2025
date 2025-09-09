// Path: src/types/mealPlan.d.ts
import { Recipe } from "./recipe";

/* ------------------------------ */
/* API / Database Models           */
/* ------------------------------ */

/**
 * MealPlanEntry
 * -------------
 * Represents a single entry in a meal plan.
 * `_id` is optional because new entries do not have an ID yet.
 */
export interface MealPlanEntry {
  _id?: string; // optional, only exists for saved entries
  recipeId: string | Recipe; // can be just the ID or a populated Recipe object
  servings: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}

/**
 * MealPlan
 * --------
 * Represents a full meal plan belonging to a user.
 */
export interface MealPlan {
  _id: string;
  title: string;
  weekStartDate?: Date;
  entries: MealPlanEntry[];
  userId: string;
  notes?: string;
}

/* ------------------------------ */
/* Frontend / UI Models            */
/* ------------------------------ */

/**
 * MealType
 * --------
 * Frontend-friendly type for drag-and-drop planner.
 */
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

/**
 * MealEntry
 * ---------
 * UI-friendly meal entry for the weekly planner component.
 */
export interface MealEntry {
  id: string; // unique id for react keys & drag-drop
  title: string; // display name of the meal/recipe
  mealType: MealType;
  calories?: number;
}

/**
 * DailyMeals
 * ----------
 * Collection of meals for a single day.
 */
export interface DailyMeals {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  meals: MealEntry[];
}

/**
 * WeeklyMealPlan
 * --------------
 * Collection of DailyMeals for a week.
 */
export interface WeeklyMealPlan {
  days: DailyMeals[];
}

/* ------------------------------ */
/* Re-exports                     */
/* ------------------------------ */
export { Recipe }; // export Recipe type to use in pages/components
