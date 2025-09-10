// src/types/mealPlan.d.ts
// Type definitions for MealPlan model

import type { Types } from "mongoose";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealPlanEntry {
  date: string; // ISO date string
  mealType: MealType;
  recipeId: string;
}

export interface MealPlan {
  _id: string;
  userId: string; // reference to User._id
  title: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  entries: MealPlanEntry[];
}

export interface CreateMealPlanPayload {
  title: string;
  startDate: string;
  endDate: string;
  entries?: MealPlanEntry[];
}
