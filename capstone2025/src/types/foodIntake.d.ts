export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface FoodEntry {
  _id?: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  mealType: MealType;
  date: Date;
}

export interface FoodIntake {
  _id: string;
  userId: string;
  entries: FoodEntry[];
  date: Date;
}
