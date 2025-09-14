import { apiFetch } from "./api";

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_KEY;
const BASE_URL = "https://api.spoonacular.com/recipes";

export async function searchRecipes(query: string) {
  const url = `${BASE_URL}/complexSearch?query=${encodeURIComponent(
    query
  )}&apiKey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
}

export async function getRecipeById(id: string) {
  const url = `${BASE_URL}/${id}/information?apiKey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch recipe");
  return res.json();
}
