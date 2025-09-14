import { apiFetch } from "./api";
import { MealPlan, Meal } from "@/types/mealPlan";

export async function fetchMealPlans(): Promise<MealPlan[]> {
  return apiFetch<MealPlan[]>("/api/meal-plans");
}

export async function addMeal(meal: Meal, date: string): Promise<MealPlan> {
  return apiFetch<MealPlan>("/api/meal-plans", {
    method: "POST",
    body: JSON.stringify({ meal, date }),
  });
}

export async function removeMeal(mealId: string): Promise<MealPlan> {
  return apiFetch<MealPlan>(`/api/meal-plans/${mealId}`, {
    method: "DELETE",
  });
}
