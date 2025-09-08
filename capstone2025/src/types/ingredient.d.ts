// Path: src/types/ingredient.d.ts
export interface IngredientBody {
  _id?: string; // optional for new ingredients
  name: string;
  unit: string;
  defaultQuantity?: number; // optional for existing data
  nutritionInfo?: Record<string, any>; // optional JSON for nutrition details
}

