// src/lib/mealPlanApi.ts
// Meal Plan API helpers (type-safe)

import type { MealPlan } from "@/types/mealPlan";
import { apiFetch } from "./api";

/** Fetch all meal plans for current user */
export const fetchMealPlansAPI = async (): Promise<MealPlan[]> => {
  return apiFetch<MealPlan[]>("/meal-plans");
};

/** Create a new meal plan */
export const createMealPlanAPI = async (plan: Partial<MealPlan>): Promise<MealPlan> => {
  return apiFetch<MealPlan>("/meal-plans", {
    method: "POST",
    body: JSON.stringify(plan),
  });
};

/** Delete meal plan by ID */
export const deleteMealPlanAPI = async (id: string): Promise<void> => {
  return apiFetch<void>(`/meal-plans/${id}`, { method: "DELETE" });
};
