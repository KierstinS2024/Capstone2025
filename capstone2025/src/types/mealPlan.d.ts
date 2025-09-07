// path: src/types/mealPlan.d.ts
import { Recipe } from "./recipe";

export interface MealPlanEntry {
  _id: string;
  recipeId: string | Recipe; // either populated Recipe object or just the ID
  servings: number;
}

export interface MealPlan {
  _id: string;
  title: string;
  weekStartDate?: Date;
  entries: MealPlanEntry[];
  userId: string;
  notes?: string;
}
