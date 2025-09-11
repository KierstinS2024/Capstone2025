// Path: src/utils/guestMealPlan.ts
import type { MealPlanEntry, MealType } from "@/types/mealPlan";
import type { Recipe } from "@/types/recipe";

/**
 * Converts a set of recipes into a guest MealPlanEntry array
 * Ensures Breakfast, Lunch, Dinner are filled
 */
export const createGuestMealPlan = (recipes: Recipe[]): MealPlanEntry[] => {
  const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner"];

  // Map each meal type to a recipe if available
  return mealTypes.map((mealType, index) => ({
    date: new Date().toISOString(), // current date for guest meals
    mealType,
    recipeId: recipes[index]?._id || "", // default to empty string if not enough recipes
    recipeTitle: recipes[index]?.title,
    recipeImage: recipes[index]?.image,
    ingredients: [], // guest mode skips ingredient details
  }));
};
