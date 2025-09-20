// ===========================================
// PATH: src/lib/mealPlanApi.ts
// Client-side API helpers for Meal Plans.
// Normalizes MongoDB `_id` → `id` and ensures full MealSlots
// ===========================================

import { apiFetch } from "./api";
import { MealPlan, MealType } from "@/types/mealPlan";

// -----------------------------
// Normalizer
// Ensures each date has breakfast/lunch/dinner and uses `id`
// -----------------------------
function normalizeMealPlan(plan: any): MealPlan {
  // Ensure we always have the full 3 meal slots for each day
  const normalizedMeals: Record<string, Record<MealType, string | null>> = {};

  Object.entries(plan.meals || {}).forEach(([day, meals]) => {
    // `meals` may be incomplete from server → fill with nulls
    const m = meals as Partial<Record<MealType, string | null>>;
    normalizedMeals[day] = {
      breakfast: m?.breakfast ?? null,
      lunch: m?.lunch ?? null,
      dinner: m?.dinner ?? null,
    };
  });

  return {
    ...plan,
    id: plan._id || plan.id, // normalize Mongo `_id` into `id`
    meals: normalizedMeals,
    _id: undefined, // drop raw _id to avoid confusion
  } as MealPlan;
}

// -----------------------------
// CRUD API Calls
// -----------------------------

/**
 * Get all meal plans (normalized)
 */
export async function getMealPlans(): Promise<MealPlan[]> {
  const plans = await apiFetch<any[]>("/api/meal-plans");
  return (plans || []).map(normalizeMealPlan);
}

/**
 * Get one meal plan by id (normalized)
 */
export async function getMealPlan(id: string): Promise<MealPlan> {
  const plan = await apiFetch<any>(`/api/meal-plans/${id}`);
  return normalizeMealPlan(plan);
}

/**
 * Create a new meal plan
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
 * Delete a meal plan
 */
export async function deleteMealPlan(id: string): Promise<void> {
  await apiFetch(`/api/meal-plans/${id}`, { method: "DELETE" });
}
