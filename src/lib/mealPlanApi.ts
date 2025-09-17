// PATH: src/lib/mealPlanApi.ts
// Client-side API helpers for Meal Plans

import { apiFetch } from "./api";

// -----------------------------
// Types
// -----------------------------
export type MealType = "breakfast" | "lunch" | "dinner";

export interface MealPlan {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  meals: {
    [date: string]: {
      breakfast?: string;
      lunch?: string;
      dinner?: string;
    };
  };
}

// -----------------------------
// CRUD
// -----------------------------
export async function getMealPlans(): Promise<MealPlan[]> {
  return apiFetch<MealPlan[]>("/api/meal-plans");
}

export async function getMealPlan(id: string): Promise<MealPlan> {
  return apiFetch<MealPlan>(`/api/meal-plans/${id}`);
}

export async function createMealPlan(
  data: Partial<MealPlan>
): Promise<MealPlan> {
  return apiFetch<MealPlan>("/api/meal-plans", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMealPlan(
  id: string,
  data: Partial<MealPlan>
): Promise<MealPlan> {
  return apiFetch<MealPlan>(`/api/meal-plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteMealPlan(id: string): Promise<void> {
  await apiFetch(`/api/meal-plans/${id}`, { method: "DELETE" });
}
