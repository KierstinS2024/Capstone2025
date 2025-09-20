// PATH: src/lib/spoonacularApi.ts
import { Recipe } from "./recipeApi";

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

/**
 * Search Spoonacular recipes by query
 * Returns minimal info (id, title, image) — instructions require full fetch
 */
export async function searchSpoonacular(query: string): Promise<Recipe[]> {
  const res = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
      query
    )}&number=10&apiKey=${API_KEY}`
  );

  // Check for HTTP errors
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    // Spoonacular returns 402 / 429 for quota exceeded
    if (data?.status === "failure" && data?.code === 402) {
      throw new Error("quota"); // NEW: special error for quota
    }
    throw new Error("Spoonacular search failed");
  }

  const data = await res.json();

  return data.results.map((r: any) => ({
    id: String(r.id),
    title: r.title,
    ingredients: [], // search doesn’t return ingredients
    instructions: "", // need full fetch for this
    image: r.image,
    source: "spoonacular",
  }));
}

/**
 * Get full Spoonacular recipe details
 */
export async function getSpoonacularRecipe(id: string): Promise<Recipe> {
  const res = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (data?.status === "failure" && data?.code === 402) {
      throw new Error("quota"); // special error for quota
    }
    throw new Error("Spoonacular fetch failed");
  }

  const data = await res.json();

  return {
    id: String(data.id),
    title: data.title,
    ingredients: data.extendedIngredients?.map((i: any) => i.original) || [],
    instructions:
      data.instructions ||
      data.summary?.replace(/<[^>]+>/g, "") || // fallback: strip HTML
      "",
    image: data.image,
    source: "spoonacular",
  };
}
