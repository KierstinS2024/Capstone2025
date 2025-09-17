// PATH: src/lib/recipeApi.ts
// Client-side API helpers for Recipes.

import { apiFetch } from "./api";

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  source?: "user" | "spoonacular";
}

export async function getRecipes(): Promise<Recipe[]> {
  return apiFetch<Recipe[]>("/api/recipes");
}

export async function getRecipe(id: string): Promise<Recipe> {
  return apiFetch<Recipe>(`/api/recipes/${id}`);
}

export async function createRecipe(data: Partial<Recipe>): Promise<Recipe> {
  return apiFetch<Recipe>("/api/recipes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteRecipe(id: string): Promise<void> {
  await apiFetch(`/api/recipes/${id}`, { method: "DELETE" });
}
