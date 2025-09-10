// src/lib/recipeApi.ts
// Typed API client for Recipe endpoints

import type { Recipe } from "../types/recipe";

// Base fetch helper with error handling
async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // important for JWT cookie auth
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText}`);
  }

  return res.json() as Promise<T>;
}

// ---- Recipe API helpers ----

// Get all recipes (local + Spoonacular if query passed)
export async function fetchRecipes(query?: string): Promise<Recipe[]> {
  const url = query ? `/api/recipes?q=${encodeURIComponent(query)}` : "/api/recipes";
  return apiFetch<Recipe[]>(url);
}

// Get one recipe by ID
export async function fetchRecipeById(id: string): Promise<Recipe> {
  return apiFetch<Recipe>(`/api/recipes/${id}`);
}

// Create a new recipe
export async function createRecipe(data: Partial<Recipe>): Promise<Recipe> {
  return apiFetch<Recipe>("/api/recipes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Update a recipe
export async function updateRecipe(id: string, data: Partial<Recipe>): Promise<Recipe> {
  return apiFetch<Recipe>(`/api/recipes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Delete a recipe
export async function deleteRecipe(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/api/recipes/${id}`, {
    method: "DELETE",
  });
}

// Toggle favorite for a recipe
export async function toggleFavorite(id: string): Promise<Recipe> {
  return apiFetch<Recipe>(`/api/recipes/${id}/favorite`, {
    method: "POST",
  });
}
