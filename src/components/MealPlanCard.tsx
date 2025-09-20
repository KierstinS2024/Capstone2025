// ===========================================
// PATH: src/components/MealPlanCard.tsx
// ===========================================
"use client";

import React, { useState, useEffect } from "react";
import { MealPlan, MealType } from "@/lib/mealPlanApi";
import MealCard from "./MealCard";
import RecipeModal from "./RecipeModal";
import AddToMealPlanModal from "./AddToMealPlanModal";
import { useRecipes } from "@/context/RecipeContext";
import { useMealPlans } from "@/context/MealPlanContext";
import { Recipe } from "@/types/recipe";
import { formatDateRange, todayISO } from "@/lib/helpers";
import styles from "@/styles/mealPlanCard.module.css";

interface Props {
  plan: MealPlan;
}

export default function MealPlanCard({ plan }: Props) {
  const { fetchRecipe, unlinkTemporaryRecipe } = useRecipes(); // Recipe context
  const { updateMeal } = useMealPlans(); // Meal plan context

  const today = todayISO(); // Current day in YYYY-MM-DD format

  // -----------------------------
  // Local state
  // -----------------------------
  const [recipesForToday, setRecipesForToday] = useState<
    Partial<Record<MealType, Recipe>>
  >({}); // Holds recipes for breakfast, lunch, dinner
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null); // Recipe to show in modal
  const [showAddMeal, setShowAddMeal] = useState<{
    mealType: MealType | "";
    open: boolean;
  }>({ mealType: "", open: false }); // Controls AddToMealPlan modal

  // Callback to immediately update UI when a recipe is added
  const handleAddToToday = (mealType: MealType, recipe: Recipe) => {
    setRecipesForToday((prev) => ({ ...prev, [mealType]: recipe }));
  };

  // -----------------------------
  // Load recipes for today
  // -----------------------------
  useEffect(() => {
    const loadRecipesForToday = async () => {
      const todayMeals = plan.meals[today] || {};
      const entries: [MealType, Recipe][] = [];

      // Fetch each meal's recipe
      for (const mealType of ["breakfast", "lunch", "dinner"] as MealType[]) {
        const recipeId = todayMeals[mealType];
        if (recipeId) {
          const recipe = await fetchRecipe(recipeId);
          if (recipe) entries.push([mealType, recipe]);
        }
      }

      setRecipesForToday(Object.fromEntries(entries));
    };

    loadRecipesForToday();
  }, [plan, today, fetchRecipe]);

  // -----------------------------
  // Handle meal card click
  // -----------------------------
  const handleMealClick = (mealType: MealType, recipe?: Recipe) => {
    if (recipe) setSelectedRecipe(recipe); // Open recipe modal
    else setShowAddMeal({ mealType, open: true }); // Open AddToMealPlan modal
  };

  // -----------------------------
  // Remove meal from plan
  // -----------------------------
  const handleRemoveMeal = async (mealType: MealType) => {
    const recipe = recipesForToday[mealType];
    if (!recipe) return;

    // Remove from backend
    await updateMeal(plan.id, today, mealType, undefined);

    // Update local UI
    setRecipesForToday((prev) => {
      const updated = { ...prev };
      delete updated[mealType];
      return updated;
    });

    // Cleanup temporary Spoonacular recipe
    if (recipe.source === "spoonacular" && recipe.temporary) {
      try {
        await unlinkTemporaryRecipe(recipe.id);
      } catch (err) {
        console.error("Failed to unlink temporary recipe:", err);
      }
    }
  };

  return (
    <div className={styles.planCard}>
      {/* Date range */}
      <h2 className={styles.dateRange}>
        {formatDateRange(plan.startDate, plan.endDate)}
      </h2>

      {/* Meal cards for breakfast, lunch, dinner */}
      <div className={styles.meals}>
        {(["breakfast", "lunch", "dinner"] as MealType[]).map((mealType) => {
          const recipe = recipesForToday[mealType];
          return (
            <MealCard
              key={mealType}
              mealType={mealType}
              recipe={recipe}
              onClick={() => handleMealClick(mealType, recipe)}
              onRemove={() => handleRemoveMeal(mealType)}
            />
          );
        })}
      </div>

      {/* Recipe modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* AddToMealPlan modal */}
      {showAddMeal.open && showAddMeal.mealType && (
        <AddToMealPlanModal
          recipe={selectedRecipe ?? undefined}
          plan={plan}
          mealType={showAddMeal.mealType}
          onClose={() => setShowAddMeal({ mealType: "", open: false })}
          onAdd={handleAddToToday} // Update local state immediately
        />
      )}
    </div>
  );
}
