// ===========================================
// src/types/mealPlan.d.ts
// ===========================================
export interface MealPlan {
  _id?: string;
  title: string;
  startDate: string;
  endDate: string;
  meals: {
    day: string;
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  }[];
}
