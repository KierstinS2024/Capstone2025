// Path: src/lib/spoonacularApi.ts
// Handles fetching recipes from Spoonacular

import type { RecipeIngredient } from "@/types/recipe";

// Spoonacular API key (replace with your key or use environment variable)
const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com";

export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  ingredients: RecipeIngredient[];
  instructions?: string;
}

/**
 * Search recipes by query from Spoonacular
 */
export const searchRecipes = async (
  query: string
): Promise<SpoonacularRecipe[]> => {
  const res = await fetch(
    `${BASE_URL}/recipes/complexSearch?query=${encodeURIComponent(
      query
    )}&addRecipeInformation=true&apiKey=${API_KEY}`
  );
  const data = await res.json();

  // Map Spoonacular response to our app Recipe type
  return data.results.map((r: any) => ({
    id: r.id,
    title: r.title,
    image: r.image,
    instructions: r.instructions || "",
    ingredients:
      r.extendedIngredients?.map((i: any) => ({
        name: i.name,
        quantity: `${i.amount} ${i.unit}`,
      })) || [],
  }));
};

/**
 * Fetch a single recipe by Spoonacular ID
 */
export const getRecipeById = async (id: number): Promise<SpoonacularRecipe> => {
  const res = await fetch(
    `${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}`
  );
  const data = await res.json();

  return {
    id: data.id,
    title: data.title,
    image: data.image,
    instructions: data.instructions || "",
    ingredients:
      data.extendedIngredients?.map((i: any) => ({
        name: i.name,
        quantity: `${i.amount} ${i.unit}`,
      })) || [],
  };
};
