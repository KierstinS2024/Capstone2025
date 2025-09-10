// src/lib/recipeApi.ts
// Recipe API helpers (type-safe)

import type { Recipe } from "@/types/recipe";
import { apiFetch } from "./api";

/** Fetch all recipes */
export const fetchRecipesAPI = async (): Promise<Recipe[]> => {
  return apiFetch<Recipe[]>("/recipes");
};

/** Create a new recipe */
export const createRecipeAPI = async (
  recipe: Partial<Recipe>
): Promise<Recipe> => {
  return apiFetch<Recipe>("/recipes", {
    method: "POST",
    body: JSON.stringify(recipe),
  });
};

/** Delete recipe by ID */
export const deleteRecipeAPI = async (id: string): Promise<void> => {
  return apiFetch<void>(`/recipes/${id}`, { method: "DELETE" });
};

/** Toggle favorite status for recipe */
export const toggleFavoriteAPI = async (id: string): Promise<void> => {
  return apiFetch<void>(`/recipes/${id}/favorite`, { method: "POST" });
};
