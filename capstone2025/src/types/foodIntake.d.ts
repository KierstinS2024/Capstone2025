export interface FoodEntry {
  _id?: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  date: Date;
}

export interface FoodIntake {
  _id: string;
  userId: string;
  entries: FoodEntry[];
  date: Date;
}
