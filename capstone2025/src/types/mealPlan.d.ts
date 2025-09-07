// Path: src/types/mealPlan.d.ts
import { Recipe } from "./recipe";

export { Recipe }; // Export to import in pages

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
