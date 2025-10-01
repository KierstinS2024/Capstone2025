// ===========================================
// PATH: src/lib/mealPlanApi.ts
// API helper functions for MealPlans
// Fully typed, supports dynamic plans
// ===========================================

import { MealPlan, MealType } from "@/types/mealPlan";

/**
 * Fetch the active meal plan for a user
 */
export async function getUserMealPlan(
  userEmail: string
): Promise<MealPlan | null> {
  const res = await fetch(
    `/api/meal-plans?userEmail=${encodeURIComponent(userEmail)}`
  );
  if (!res.ok) return null;
  return res.json();
}

/**
 * Create a new meal plan
 */
export async function createMealPlan(
  userEmail: string,
  meals: Record<string, Record<MealType, string>>,
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
 * Add a recipe to a specific day & meal type
 */
export async function addMealToPlan(
  planId: string,
  date: string,
  mealType: MealType,
  recipeId: string,
  userEmail: string
) {
  const res = await fetch(
    `/api/meal-plans/${planId}/addMeal?userEmail=${encodeURIComponent(
      userEmail
    )}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, mealType, recipeId }),
    }
  );
  if (!res.ok) throw new Error("Failed to add meal");
}

/**
 * Update the full meal plan
 */
export async function updateMealPlan(
  planId: string,
  meals: Record<string, Record<MealType, string>>,
  userEmail: string
) {
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
