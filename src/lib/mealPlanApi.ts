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
 * ✅ Now includes startDate and endDate to prevent duplicate week errors in Mongo
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
      body: JSON.stringify({ meals, startDate, endDate }), // include start/end dates
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
 * Move a recipe between meal slots
 */
export async function moveMeal(
  planId: string,
  sourceDate: string,
  sourceMealType: MealType,
  destDate: string,
  destMealType: MealType,
  userEmail: string
) {
  const res = await fetch(
    `/api/meal-plans/${planId}/moveMeal?userEmail=${encodeURIComponent(
      userEmail
    )}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceDate,
        sourceMealType,
        destDate,
        destMealType,
      }),
    }
  );
  if (!res.ok) throw new Error("Failed to move meal");
}

/**
 * Update the full meals object for a meal plan
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
