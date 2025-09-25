// ===========================================
// PATH: src/lib/spoonacularApi.ts
// Spoonacular API helper functions
// Fully typed and robust with error handling
// ===========================================

import { Recipe } from "@/types/recipe";

// Use your public environment variable for Spoonacular API key
const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

/**
 * Search Spoonacular recipes by a query string
 * Returns minimal recipe info: id, title, image
 * Ingredients and instructions require full recipe fetch
 * @param query string search term
 * @returns Array of Recipe objects (partial)
 */
export async function searchSpoonacular(query: string): Promise<Recipe[]> {
  // Encode query for URL
  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
    query
  )}&number=10&apiKey=${API_KEY}`;

  const res = await fetch(url);

  // Try to parse response body, even on error
  const data = await res.json().catch(() => ({}));

  // Handle HTTP error
  if (!res.ok) {
    // Special handling for quota exceeded
    if (data?.status === "failure" && data?.code === 402) {
      throw new Error("quota");
    }
    throw new Error("Spoonacular search failed");
  }

  // Map results to Recipe type (minimal info)
  return (data.results || []).map((r: any) => ({
    id: String(r.id),
    title: r.title,
    ingredients: [], // search API does not provide ingredients
    instructions: "", // need full fetch for instructions
    image: r.image,
    source: "spoonacular",
  }));
}

/**
 * Fetch full Spoonacular recipe details by ID
 * Returns all fields: title, ingredients, instructions, image
 * @param id string recipe ID
 * @returns Recipe object (full)
 */
export async function getSpoonacularRecipe(id: string): Promise<Recipe> {
  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`;

  const res = await fetch(url);

  // Parse response body safely
  const data = await res.json().catch(() => ({}));

  // Handle HTTP error
  if (!res.ok) {
    console.error("Spoonacular fetch error:", data);

    // Special error for quota exceeded
    if (data?.status === "failure" && data?.code === 402) {
      throw new Error("quota");
    }

    throw new Error("Spoonacular fetch failed");
  }

  // Map Spoonacular response to our Recipe type
  return {
    id: String(data.id),
    title: data.title,
    ingredients: data.extendedIngredients?.map((i: any) => i.original) || [],
    instructions:
      data.instructions ||
      data.summary?.replace(/<[^>]+>/g, "") || // fallback: strip HTML if instructions missing
      "",
    image: data.image,
    source: "spoonacular",
  };
}
