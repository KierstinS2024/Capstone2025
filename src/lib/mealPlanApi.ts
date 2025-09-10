// src/lib/mealPlanApi.ts
// Meal plan API helpers

import { apiFetch } from "./api";
import type { MealPlan } from "../models/MealPlan";

export async function fetchMealPlans(): Promise<MealPlan[]> {
  return apiFetch<MealPlan[]>("/meal-plans");
}

export async function createMealPlan(plan: MealPlan): Promise<MealPlan> {
  return apiFetch<MealPlan>("/meal-plans", {
    method: "POST",
    body: JSON.stringify(plan),
  });
}

export async function deleteMealPlan(id: string): Promise<void> {
  return apiFetch<void>(`/meal-plans/${id}`, { method: "DELETE" });
}
