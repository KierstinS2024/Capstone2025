// Path: src/types/dashboard.d.ts
export interface DashboardMeal {
  id: string;
  title: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DashboardData {
  meals: DashboardMeal[];
  nutritionSummary: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
