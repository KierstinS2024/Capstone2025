// src/types/foodIntakeForm.d.ts
import { MealType } from "./auth";

export interface FoodIntakeForm {
  date: string;
  mealType: MealType;
  quantity: number;
  unit: string;
  recipeId?: string;
  ingredientId?: string;
  _id?: string;
}
