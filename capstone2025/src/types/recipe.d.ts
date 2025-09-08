// Path: src/types/recipe.d.ts

export type RecipeSource = "user" | "spoonacular";

export interface Recipe {
  _id: string;
  title: string; // <-- aligned with backend
  description?: string;
  servings?: number; // backend didn’t require this, so make optional
  ingredients?: {
    ingredientId: string;
    quantity: number;
    unit?: string;
  }[];
  instructions?: string[]; // backend uses array, not string
  userId?: string; // optional, only for "user" source

  /**
   * Source of recipe
   * - "user" → created inside app
   * - "spoonacular" → read-only, external import
   */
  source: RecipeSource;
}
