// src/types/recipe.d.ts
export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Recipe {
  _id: string;
  userId: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string;
  source: "local" | "spoonacular";
  spoonacularId?: number;
  isFavorite?: boolean; // helpful client-side flag
}
