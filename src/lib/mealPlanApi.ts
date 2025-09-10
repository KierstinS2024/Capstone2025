// src/lib/mealPlanApi.ts
import type { MealPlan } from "../models/MealPlan";

export async function fetchMealPlans(): Promise<MealPlan[]> {
  const res = await fetch("/api/meal-plans");
  return res.json();
}
