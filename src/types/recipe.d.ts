// path: src/types/recipe.d.ts
// Type definitions for Recipe model and API payloads

export type RecipeSource = "local" | "spoonacular";

/**
 * A single ingredient in a recipe.
 */
export interface RecipeIngredient {
  name: string; // Ingredient name
  quantity: string; // Amount, stored as string (e.g., "2 cups")
  unit: string; // Unit (e.g., "cups", "tsp")
}

/**
 * A recipe document stored in the database.
 */
export interface Recipe {
  _id: string; // MongoDB ObjectId
  userId?: string; // Owner userId (optional for Spoonacular)
  title: string; // Recipe title
  ingredients: RecipeIngredient[]; // List of ingredients
  instructions: string; // Recipe instructions
  source: RecipeSource; // "local" or "spoonacular"
  spoonacularId?: number; // Optional ID for Spoonacular recipes
  image?: string; // Optional image for display
}

/**
 * Payload for creating a new recipe.
 */
export interface CreateRecipePayload {
  title: string;
  ingredients: RecipeIngredient[];
  instructions: string;
  source?: RecipeSource; // Defaults to "local"
  spoonacularId?: number;
}
