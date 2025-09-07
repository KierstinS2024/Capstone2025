import { Ingredient } from "./ingredient";

export interface RecipeIngredient {
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  _id: string;
  title: string;
  description?: string;
  ingredients: RecipeIngredient[];
  steps?: string[];
  servings: number;
  [key: string]: any;
}
