import { Recipe } from "./recipe";

export interface MealPlanEntry {
  _id: string;
  recipeId: string; // Can reference Recipe._id or full Recipe object
  servings: number;
}

export interface MealPlan {
  _id: string;
  title: string;
  weekStartDate?: Date;
  entries: MealPlanEntry[];
  userId: string;
}
