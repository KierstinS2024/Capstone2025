// ===========================================
// PATH: src/lib/mealPlanApi.ts
//
// Client-side API helpers for Meal Plans
// - Normalizes MongoDB docs into clean TS objects
// - Guarantees all 3 meal slots per day
// - Matches backend contract: **only one plan per user**
// ===========================================

import { apiFetch } from "./api"; // Generic wrapper (adds auth, error handling, etc.)
import { MealPlan, MealType } from "@/types/mealPlan";

// -------------------------------------------
// Helper: normalizeMealPlan()
// Converts MongoDB doc → MealPlan
// - Ensures breakfast/lunch/dinner always exist
// - Maps `_id` → `id`
// -------------------------------------------
function normalizeMealPlan(plan: any): MealPlan {
  const normalizedMeals: Record<string, Record<MealType, string | null>> = {};

  Object.entries(plan.meals || {}).forEach(([day, meals]) => {
    const m = meals as Partial<Record<MealType, string | null>>;
    normalizedMeals[day] = {
      breakfast: m?.breakfast ?? null,
      lunch: m?.lunch ?? null,
      dinner: m?.dinner ?? null,
    };
  });

  return {
    ...plan,
    id: plan._id || plan.id,
    meals: normalizedMeals,
    _id: undefined, // strip raw Mongo field
  } as MealPlan;
}

// ==================================================
// API METHODS
// ==================================================

/**
 * Get the user’s active meal plan
 * - Backend guarantees: one plan per user OR null
 */
export async function getMealPlanForUser(): Promise<MealPlan | null> {
  const plan = await apiFetch<any>("/api/meal-plans");
  return plan ? normalizeMealPlan(plan) : null;
}

/**
 * Get a meal plan by ID
 * - Enforces ownership server-side
 */
export async function getMealPlan(id: string): Promise<MealPlan> {
  const plan = await apiFetch<any>(`/api/meal-plans/${id}`);
  return normalizeMealPlan(plan);
}

/**
 * Get the active plan overlapping a specific week
 * - GET /api/meal-plans/week/[date]
 * - Returns array for consistency
 */
export async function getWeekMealPlan(date: string): Promise<MealPlan[]> {
  const plans = await apiFetch<any[]>(`/api/meal-plans/week/${date}`);
  return (plans || []).map(normalizeMealPlan);
}

/**
 * Create a new meal plan
 * - Only allowed if none exists
 */
export async function createMealPlan(
  data: Partial<MealPlan>
): Promise<MealPlan> {
  const plan = await apiFetch<any>("/api/meal-plans", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return normalizeMealPlan(plan);
}

/**
 * Update an existing meal plan
 */
export async function updateMealPlan(
  id: string,
  data: Partial<MealPlan>
): Promise<MealPlan> {
  const plan = await apiFetch<any>(`/api/meal-plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return normalizeMealPlan(plan);
}

/**
 * Delete the user’s plan
 */
export async function deleteMealPlan(id: string): Promise<void> {
  await apiFetch(`/api/meal-plans/${id}`, { method: "DELETE" });
}
