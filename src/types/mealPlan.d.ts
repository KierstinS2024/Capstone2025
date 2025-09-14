export interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner";
  date: string; // YYYY-MM-DD
  recipeId?: string;
  image?: string;
  ingredients?: { name: string; quantity?: string }[];
}

export interface MealPlan {
  _id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  meals: Meal[];
}
