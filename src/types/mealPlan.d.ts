// path: src/types/mealPlan.ts
// Type definitions for Meal Plans and Meals

/**
 * Represents a meal inside a meal plan.
 */
export interface Meal {
  id: string; // Unique identifier within the plan
  type: "breakfast" | "lunch" | "dinner"; // Meal type
  date: string; // ISO date string for which day in the plan
  name: string; // Display name
  recipeId?: string; // Optional link to Recipe (_id)
  source?: "spoonacular" | "custom"; // Recipe source
  image?: string; // Optional image
  description?: string; // Optional description
}

/**
 * A meal plan document.
 */
export interface MealPlan {
  _id: string; // MongoDB ObjectId
  userId: string; // Owner of the meal plan
  startDate: string; // ISO string
  endDate: string; // ISO string
  meals: Meal[]; // All meals within the date range
  createdAt?: string; // Optional timestamp
  updatedAt?: string; // Optional timestamp
}
