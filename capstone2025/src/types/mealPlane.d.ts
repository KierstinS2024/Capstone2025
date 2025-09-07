import { Recipe } from "./recipe";

export interface MealPlanEntry {
  _id: string;
  recipeId: Recipe;
  servings: number;
}

export interface MealPlan {
  _id: string;
  title: string;
  weekStartDate?: Date;
  entries: MealPlanEntry[];
  userId: string;
}
