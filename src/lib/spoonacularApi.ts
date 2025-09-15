// src/lib/spoonacularApi.ts
const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com";

export async function fetchRecipes(query: string) {
  const res = await fetch(
    `${BASE_URL}/recipes/complexSearch?query=${query}&apiKey=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
}

export async function fetchRecipeById(id: string) {
  const res = await fetch(
    `${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}`
  );
  if (!res.ok) throw new Error("Failed to fetch recipe");
  return res.json();
}
