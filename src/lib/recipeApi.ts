// src/lib/recipeApi.ts
import { Recipe } from "@/models/Recipe";
import { apiFetch } from "@/lib/api"; // helper for fetch wrapper

// Fetch all recipes (user + optionally external search)
export async function fetchRecipes(query?: string): Promise<Recipe[]> {
  const url = query
    ? `/api/recipes?q=${encodeURIComponent(query)}`
    : `/api/recipes`;
  const res = await apiFetch<Recipe[]>(url);
  return res;
}

// Fetch single recipe by ID
export async function getRecipeById(id: string): Promise<Recipe> {
  const res = await apiFetch<Recipe>(`/api/recipes/${id}`);
  return res;
}

// Create a new recipe
export async function createRecipe(recipe: Partial<Recipe>): Promise<Recipe> {
  const res = await apiFetch<Recipe>(`/api/recipes`, {
    method: "POST",
    body: JSON.stringify(recipe),
  });
  return res;
}

// Update an existing recipe
export async function updateRecipe(
  id: string,
  recipe: Partial<Recipe>
): Promise<Recipe> {
  const res = await apiFetch<Recipe>(`/api/recipes/${id}`, {
    method: "PUT",
    body: JSON.stringify(recipe),
  });
  return res;
}

// Delete a recipe
export async function deleteRecipe(id: string): Promise<void> {
  await apiFetch(`/api/recipes/${id}`, { method: "DELETE" });
}

// Toggle favorite
export async function toggleFavorite(id: string): Promise<Recipe> {
  const res = await apiFetch<Recipe>(`/api/recipes/${id}/favorite`, { method: "POST" });
  return res;
}
