// ===========================================
// PATH: src/lib/recipeApi.ts
// ===========================================

import { Recipe } from "@/types/recipe";

// -----------------------------
// Normalize backend recipe → frontend Recipe
// Handles both id + _id
// -----------------------------
function normalizeRecipe(data: any): Recipe {
  return {
    id: data.id || data._id, // handle both
    author: data.author,
    title: data.title,
    image: data.image,
    ingredients: data.ingredients || [],
    instructions: data.instructions,
    source: data.source || "user",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

// -----------------------------
// Fetch recipes for a user
// -----------------------------
export async function getRecipes(userEmail: string): Promise<Recipe[]> {
  const res = await fetch(
    `/api/recipes?userEmail=${encodeURIComponent(userEmail)}`
  );
  if (!res.ok) throw new Error("Failed to fetch recipes");
  const data = await res.json();
  return data.map(normalizeRecipe);
}

// -----------------------------
// Add recipe
// -----------------------------
export async function addRecipe(
  recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">,
  userEmail: string
): Promise<Recipe> {
  const res = await fetch(
    `/api/recipes?userEmail=${encodeURIComponent(userEmail)}`,
    {
      method: "POST",
      body: JSON.stringify(recipe),
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) throw new Error("Failed to add recipe");
  const data = await res.json();
  return normalizeRecipe(data);
}

// -----------------------------
// Update recipe
// -----------------------------
export async function updateRecipe(
  id: string,
  updates: Partial<Recipe>,
  userEmail: string
): Promise<Recipe> {
  const res = await fetch(
    `/api/recipes/${id}?userEmail=${encodeURIComponent(userEmail)}`,
    {
      method: "PATCH", // ✅ must match route
      body: JSON.stringify(updates),
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) throw new Error("Failed to update recipe");
  const data = await res.json();
  return normalizeRecipe(data);
}

// -----------------------------
// Delete recipe
// -----------------------------
export async function deleteRecipe(
  id: string,
  userEmail: string
): Promise<void> {
  const res = await fetch(
    `/api/recipes/${id}?userEmail=${encodeURIComponent(userEmail)}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("Failed to delete recipe");
}
