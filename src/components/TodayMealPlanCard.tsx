"use client";

import React, { useState } from "react";
import { MealPlan, MealType, Recipe } from "@/types";
import MealCard from "./MealCard";
import RecipeModal from "./RecipeModal";
import { useRecipes } from "@/context/RecipeContext";
import { useRouter } from "next/navigation";
import styles from "@/styles/mealPlanCard.module.css";

export interface TodayMealPlanCardProps {
  plan: MealPlan;
  date: string;
  onRemoveMeal: (mealType: MealType) => Promise<void>;
  onOpenMeal?: (recipe: Recipe) => void; // ✅ now expects Recipe
}

/**
 * TodayMealPlanCard
 * - Shows breakfast, lunch, dinner for a day
 * - Opens modal on click if recipe exists
 * - Navigates to /meal-plans on empty slot
 * - Displays recipe images
 */
export default function TodayMealPlanCard({
  plan,
  date,
  onRemoveMeal,
  onOpenMeal,
}: TodayMealPlanCardProps) {
  const { recipes: allRecipes } = useRecipes();
  const router = useRouter();

  // Ensure the day has meal slots
  const dayMeals = (plan.meals || {})[date] || {
    breakfast: "",
    lunch: "",
    dinner: "",
  };

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <>
      <div className={styles.todayMealPlanContainer}>
        {(["breakfast", "lunch", "dinner"] as MealType[]).map((mealType) => {
          const recipeId = dayMeals[mealType];
          const recipe: Recipe | undefined = recipeId
            ? allRecipes.find((r) => r.id === recipeId)
            : undefined;

          return (
            <MealCard
              key={mealType}
              mealType={mealType}
              recipe={recipe}
              onRemove={recipe ? () => onRemoveMeal(mealType) : undefined}
              onClick={() => {
                if (recipe) {
                  if (onOpenMeal) {
                    onOpenMeal(recipe); // ✅ pass full recipe object
                  } else {
                    setSelectedRecipe(recipe); // fallback internal modal
                  }
                } else {
                  router.push("/meal-plans"); // navigate if empty
                }
              }}
            />
          );
        })}
      </div>

      {/* Internal Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </>
  );
}
