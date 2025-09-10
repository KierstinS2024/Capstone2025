// src/lib/recipeApi.ts
import type { Recipe } from "../models/Recipe";

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch("/api/recipes");
  return res.json();
}
