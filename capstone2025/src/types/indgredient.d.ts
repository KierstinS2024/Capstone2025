export interface Ingredient {
  _id: string;
  name: string;
  unit: string;
  calories?: number;
  [key: string]: any;
}

export interface IngredientInput {
  name: string;
  unit: string;
  calories?: number;
}
