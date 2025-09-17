// ===========================================
// src/types/recipe.d.ts
// ===========================================
export interface Recipe {
  _id?: string;
  title: string;
  ingredients: string[];
  instructions: string;
  author?: string;
}
