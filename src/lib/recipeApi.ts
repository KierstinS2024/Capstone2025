// ===========================================
// PATH: src/lib/recipeApi.ts
// ===========================================

// ✅ API helpers
import { apiFetch } from "./api";
import { Recipe } from "@/types/recipe"; // ✅ use global type

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
