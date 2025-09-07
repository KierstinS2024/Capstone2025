// src/types/recipe.d.ts

export interface Recipe {
  _id: string;
  title: string;
  description?: string;
  servings: number;
  ingredients?: {
    ingredientId: string;
    quantity: number;
    unit?: string;
  }[];
  instructions?: string;
  userId: string;
}
