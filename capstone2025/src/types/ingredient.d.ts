// Path: src/types/ingredient.d.ts
export interface IngredientBody {
  _id: string; // <-- add this
  name: string;
  quantity?: number; // optional for some cases
  unit?: string;
}
