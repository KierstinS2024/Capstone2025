// ===========================================
// PATH: src/lib/mealPlanApi.ts
// API helper functions for MealPlans
// Uses only CRUD routes that exist
// ===========================================

import { MealPlan, MealType, DayMeals } from "@/types";

/**
 * Fetch all meal plans for a user
 */
export async function getAllMealPlans(userEmail: string): Promise<MealPlan[]> {
  const res = await fetch(
    `/api/meal-plans?userEmail=${encodeURIComponent(userEmail)}`
  );
  if (!res.ok) throw new Error("Failed to fetch meal plans");
  return res.json();
}

/**
 * Fetch the first (active) meal plan for a user
 */
export async function getUserMealPlan(
  userEmail: string
): Promise<MealPlan | null> {
  const plans = await getAllMealPlans(userEmail);
  return plans.length > 0 ? plans[0] : null;
}

/**
 * Create a new meal plan
 */
export async function createMealPlan(
  userEmail: string,
  meals: Record<string, DayMeals>,
  startDate: string,
  endDate: string
): Promise<MealPlan> {
  const res = await fetch(
    `/api/meal-plans?userEmail=${encodeURIComponent(userEmail)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meals, startDate, endDate }),
    }
  );
  if (!res.ok) throw new Error("Failed to create meal plan");
  return res.json();
}

/**
 * Update the full meal plan
 */
export async function updateMealPlan(
  planId: string,
  meals: Record<string, DayMeals>,
  userEmail: string
): Promise<MealPlan> {
  const res = await fetch(
    `/api/meal-plans/${planId}?userEmail=${encodeURIComponent(userEmail)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meals }),
    }
  );
  if (!res.ok) throw new Error("Failed to update meal plan");
  return res.json();
}

/**
 * Delete a meal plan
 */
export async function deleteMealPlan(
  planId: string,
  userEmail: string
): Promise<void> {
  const res = await fetch(
    `/api/meal-plans/${planId}?userEmail=${encodeURIComponent(userEmail)}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("Failed to delete meal plan");
}
