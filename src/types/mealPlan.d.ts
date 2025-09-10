// src/types/mealPlan.d.ts
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealEntry {
  date: string; // ISO date
  mealType: MealType;
  recipeId: string;
}

export interface MealPlan {
  _id: string;
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  entries: MealEntry[];
}
