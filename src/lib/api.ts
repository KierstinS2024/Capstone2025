// src/lib/api.ts
// Central API utility with type-safe fetch wrapper and specific resource helpers

// Base URL for API calls, falls back to localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Generic fetch helper for all API calls.
 * Ensures JSON headers, proper error handling, and type safety via generics.
 *
 * @param endpoint - API endpoint, e.g., "/recipes"
 * @param options - optional RequestInit overrides (method, body, headers)
 * @returns Promise resolving to typed JSON response
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }

  return response.json() as Promise<T>;
}

/* ========================
   USER API
======================== */
import type { User } from "@/types/user";

/** Fetch all users (admin/utility purposes) */
export const fetchUsers = () => apiFetch<User[]>("/users");

/* ========================
   RECIPE API
======================== */
import type { Recipe } from "@/types/recipe";

/** Fetch all recipes for current user */
export const fetchRecipes = () => apiFetch<Recipe[]>("/recipes");

/**
 * Create a new recipe
 * @param recipe - Recipe object to save
 */
export const createRecipe = (recipe: Recipe) =>
  apiFetch<Recipe>("/recipes", {
    method: "POST",
    body: JSON.stringify(recipe),
  });

/** Delete a recipe by ID */
export const deleteRecipe = (id: string) =>
  apiFetch<void>(`/recipes/${id}`, { method: "DELETE" });

/* ========================
   MEAL PLAN API
======================== */
import type { MealPlan } from "@/types/mealPlan";

/** Fetch all meal plans for current user */
export const fetchMealPlans = () => apiFetch<MealPlan[]>("/meal-plans");

/** Create a new meal plan */
export const createMealPlan = (plan: MealPlan) =>
  apiFetch<MealPlan>("/meal-plans", {
    method: "POST",
    body: JSON.stringify(plan),
  });

/** Delete a meal plan by ID */
export const deleteMealPlan = (id: string) =>
  apiFetch<void>(`/meal-plans/${id}`, { method: "DELETE" });

/* ========================
   SHOPPING LIST API
======================== */
import type { ShoppingList } from "@/types/shoppingList";

/** Fetch all shopping lists for current user */
export const fetchShoppingLists = () => apiFetch<ShoppingList[]>("/shopping-lists");

/** Create a new shopping list */
export const createShoppingList = (list: ShoppingList) =>
  apiFetch<ShoppingList>("/shopping-lists", {
    method: "POST",
    body: JSON.stringify(list),
  });

/** Delete a shopping list by ID */
export const deleteShoppingList = (id: string) =>
  apiFetch<void>(`/shopping-lists/${id}`, { method: "DELETE" });
