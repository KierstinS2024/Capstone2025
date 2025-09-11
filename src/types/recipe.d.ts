// Path: src/types/recipe.d.ts
// Type definitions for Recipe model

export type RecipeSource = "local" | "spoonacular";

export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Recipe {
  _id: string;
  userId: string;
  title: string;
  ingredients: RecipeIngredient[];
  instructions: string;
  source: RecipeSource;
  spoonacularId?: number;
  favorite: boolean;
  image?: string; // optional image for UI
}

export interface CreateRecipePayload {
  title: string;
  ingredients: RecipeIngredient[];
  instructions: string;
  source?: RecipeSource;
  spoonacularId?: number;
  favorite?: boolean;
}
