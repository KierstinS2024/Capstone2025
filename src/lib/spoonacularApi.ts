// ===========================================
// PATH: src/lib/spoonacularApi.ts
// Spoonacular API helper functions
// Fully typed and robust with error handling
// ===========================================

import { Recipe } from "@/types/recipe";

// Use your public environment variable for Spoonacular API key
const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

// -----------------------------
// Search Spoonacular recipes by query
// Returns minimal recipe info: id, title, image
// Ingredients & instructions require full fetch
// -----------------------------
export async function searchSpoonacular(query: string): Promise<Recipe[]> {
  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
    query
  )}&number=10&apiKey=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (data?.status === "failure" && data?.code === 402) {
      throw new Error("quota");
    }
    throw new Error("Spoonacular search failed");
  }

  // Map results to Recipe type, including author
  return (data.results || []).map((r: any) => ({
    id: String(r.id),
    title: r.title,
    ingredients: [], // search API does not provide ingredients
    instructions: "", // need full fetch for instructions
    image: r.image || "",
    source: "spoonacular",
    author: "Spoonacular", // added to satisfy Recipe type
  }));
}

// -----------------------------
// Fetch full Spoonacular recipe by ID
// Returns complete Recipe object
// -----------------------------
export async function getSpoonacularRecipe(id: string): Promise<Recipe> {
  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Spoonacular fetch error:", data);
    if (data?.status === "failure" && data?.code === 402) {
      throw new Error("quota");
    }
    throw new Error("Spoonacular fetch failed");
  }

  return {
    id: String(data.id),
    title: data.title,
    ingredients: data.extendedIngredients?.map((i: any) => i.original) || [],
    instructions:
      data.instructions ||
      data.summary?.replace(/<[^>]+>/g, "") || // fallback: strip HTML
      "",
    image: data.image || "",
    source: "spoonacular",
    author: "Spoonacular", // added
  };
}
