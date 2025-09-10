// src/lib/recipeApi.ts
// Recipe fetching helpers (external API e.g. Spoonacular)

import { apiFetch } from "./api";
import type { Recipe } from "../models/Recipe";

export async function searchRecipes(query: string): Promise<Recipe[]> {
  return apiFetch<Recipe[]>(`/recipes/search?q=${encodeURIComponent(query)}`);
}

export async function getRecipeById(id: string): Promise<Recipe> {
  return apiFetch<Recipe>(`/recipes/${id}`);
}
