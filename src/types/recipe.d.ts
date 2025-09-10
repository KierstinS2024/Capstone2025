// src/types/recipe.d.ts
// Type definitions for Recipe model

import type { Types } from "mongoose";

export type RecipeSource = "local" | "spoonacular";

export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Recipe {
  _id: string;
  userId: string; // reference to User._id
  title: string;
  ingredients: RecipeIngredient[];
  instructions: string;
  source: RecipeSource;
  spoonacularId?: number;
}

export interface CreateRecipePayload {
  title: string;
  ingredients: RecipeIngredient[];
  instructions: string;
  source?: RecipeSource;
  spoonacularId?: number;
}
