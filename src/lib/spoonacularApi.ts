// PATH: src/lib/spoonacularApi.ts
// Wrapper for Spoonacular external API requests.
// Always use NEXT_PUBLIC_SPOONACULAR_API_KEY from .env.local.

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

export async function searchSpoonacular(query: string) {
  const res = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
      query
    )}&number=10&apiKey=${API_KEY}`
  );
  if (!res.ok) throw new Error("Spoonacular search failed");
  return res.json();
}

export async function getSpoonacularRecipe(id: string) {
  const res = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
  );
  if (!res.ok) throw new Error("Spoonacular fetch failed");
  return res.json();
}
