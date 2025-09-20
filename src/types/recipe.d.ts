// src/types/recipe.d.ts
export interface Recipe {
  id: string; // use 'id' instead of '_id' for frontend
  title: string;
  ingredients: string[];
  instructions: string;
  image?: string;
  source?: "user" | "spoonacular";
  createdAt?: string;
  updatedAt?: string;
  temporary?: boolean; // for temporary Spoonacular recipes
  linkedMealPlanIds?: string[]; // tracks meal plans using this recipe
  author?: string;
}
