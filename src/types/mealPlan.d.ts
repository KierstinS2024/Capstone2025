// src/types/mealPlan.d.ts
import type { Types } from "mongoose";

// Meal types
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

// Ingredient type for meal plan entries
export interface MealIngredient {
  name: string;
  quantity: string;
  category?: string;
}

// Single entry in a meal plan
export interface MealPlanEntry {
  date: string; // ISO date string
  mealType: MealType;
  recipeId: string;
  ingredients: MealIngredient[]; // added for shopping list generation
}

// Meal plan type
export interface MealPlan {
  _id: string;
  userId: string; // reference to User._id
  title: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  entries: MealPlanEntry[];
}

// Payload used for creating a new meal plan
export interface CreateMealPlanPayload {
  title: string;
  startDate: string;
  endDate: string;
  entries?: MealPlanEntry[];
}
