// ===========================================
// PATH: src/components/MealPlanCard.tsx
// Card showing meals for today with ability to view, add, remove recipes
// Updated to wire AddToMealPlanModal to MealPlanContext.updateMeal
// ===========================================

"use client";

import React, { useState, useEffect } from "react";
import { MealPlan, MealType } from "@/types/mealPlan";
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
  const { fetchRecipe, unlinkTemporaryRecipe } = useRecipes();
  const { updateMeal } = useMealPlans();
  const today = todayISO();

  // Holds the recipes assigned for today's meals
  const [recipesForToday, setRecipesForToday] = useState<
    Partial<Record<MealType, Recipe>>
  >({});

  // Recipe selected to view in modal
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Controls AddToMealPlanModal visibility and meal type
  const [showAddMeal, setShowAddMeal] = useState<{
    mealType: MealType | "";
    open: boolean;
  }>({ mealType: "", open: false });

  /**
   * Load recipes for today's meal slots on mount
   */
  useEffect(() => {
    const loadRecipesForToday = async () => {
      const todayMeals = plan.meals[today] || {};
      const entries: [MealType, Recipe][] = [];

      for (const mealType of ["breakfast", "lunch", "dinner"] as MealType[]) {
        const recipeId = todayMeals[mealType] ?? null;
        if (recipeId) {
          const recipe = await fetchRecipe(recipeId);
          if (recipe) entries.push([mealType, recipe]);
        }
      }

      setRecipesForToday(Object.fromEntries(entries));
    };

    loadRecipesForToday();
  }, [plan, today, fetchRecipe]);

  /**
   * Handle clicking on a meal slot
   */
  const handleMealClick = (mealType: MealType, recipe?: Recipe) => {
    if (recipe) setSelectedRecipe(recipe);
    else setShowAddMeal({ mealType, open: true });
  };

  /**
   * Remove meal from today
   */
  const handleRemoveMeal = async (mealType: MealType) => {
    const recipe = recipesForToday[mealType];
    if (!recipe) return;

    // Update backend
    await updateMeal(plan.id, today, mealType, null);

    // Update local state
    setRecipesForToday((prev) => {
      const updated = { ...prev };
      delete updated[mealType];
      return updated;
    });

    // If temporary recipe, unlink it
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
      <h2 className={styles.dateRange}>
        {formatDateRange(plan.startDate, plan.endDate || plan.startDate)}
      </h2>

      {/* Today's meal slots */}
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

      {/* Recipe modal for viewing */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Add recipe modal */}
      {showAddMeal.open && showAddMeal.mealType && (
        <AddToMealPlanModal
          recipe={selectedRecipe ?? undefined}
          plan={plan}
          onClose={() => setShowAddMeal({ mealType: "", open: false })}
          // **Wire directly to updateMeal so backend + state stays in sync**
          onAdd={async (mealType: MealType, recipe: Recipe) => {
            if (!plan.id) return;
            await updateMeal(plan.id, today, mealType, recipe.id);
            setRecipesForToday((prev) => ({ ...prev, [mealType]: recipe }));
          }}
        />
      )}
    </div>
  );
}
