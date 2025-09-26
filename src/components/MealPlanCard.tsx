// ===========================================
// PATH: src/components/MealPlanCard.tsx
// Card component showing meals for today with ability to view, add, remove recipes
// Fully wired to MealPlanContext.updateMeal
// Temporary recipe handling removed
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
  plan: MealPlan; // MealPlan to display
}

export default function MealPlanCard({ plan }: Props) {
  const { fetchRecipe } = useRecipes(); // Function to fetch a single recipe by ID
  const { updateMeal } = useMealPlans(); // Function to update a meal slot
  const today = todayISO(); // Get today's date in YYYY-MM-DD

  // -------------------------------
  // Holds recipes assigned for today's meal slots
  // Keyed by MealType (breakfast, lunch, dinner)
  // -------------------------------
  const [recipesForToday, setRecipesForToday] = useState<
    Partial<Record<MealType, Recipe>>
  >({});

  // -------------------------------
  // Recipe currently selected to view in RecipeModal
  // -------------------------------
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // -------------------------------
  // Controls AddToMealPlanModal visibility and which meal slot it affects
  // -------------------------------
  const [showAddMeal, setShowAddMeal] = useState<{
    mealType: MealType | "";
    open: boolean;
  }>({ mealType: "", open: false });

  // -------------------------------------------
  // Load recipes for today's meal slots when component mounts or plan changes
  // -------------------------------------------
  useEffect(() => {
    const loadRecipesForToday = async () => {
      const todayMeals = plan.meals[today] || {};
      const entries: [MealType, Recipe][] = [];

      // Loop over each meal type and fetch its recipe if assigned
      for (const mealType of ["breakfast", "lunch", "dinner"] as MealType[]) {
        const recipeId = todayMeals[mealType] ?? null;
        if (recipeId) {
          const recipe = await fetchRecipe(recipeId);
          if (recipe) entries.push([mealType, recipe]);
        }
      }

      // Set recipesForToday state
      setRecipesForToday(Object.fromEntries(entries));
    };

    loadRecipesForToday();
  }, [plan, today, fetchRecipe]);

  // -------------------------------------------
  // Handle clicking on a meal slot
  // - Opens RecipeModal if a recipe exists
  // - Opens AddToMealPlanModal if slot is empty
  // -------------------------------------------
  const handleMealClick = (mealType: MealType, recipe?: Recipe) => {
    if (recipe) setSelectedRecipe(recipe);
    else setShowAddMeal({ mealType, open: true });
  };

  // -------------------------------------------
  // Remove a meal from today's plan
  // - Updates backend via MealPlanContext
  // - Updates local state
  // -------------------------------------------
  const handleRemoveMeal = async (mealType: MealType) => {
    const recipe = recipesForToday[mealType];
    if (!recipe) return;

    // Remove recipe from backend
    await updateMeal(plan.id, today, mealType, null);

    // Remove recipe from local state
    setRecipesForToday((prev) => {
      const updated = { ...prev };
      delete updated[mealType];
      return updated;
    });
  };

  return (
    <div className={styles.planCard}>
      {/* -------------------------------
          Display the plan's date range
      ------------------------------- */}
      <h2 className={styles.dateRange}>
        {formatDateRange(plan.startDate, plan.endDate || plan.startDate)}
      </h2>

      {/* -------------------------------
          Today's meal slots
      ------------------------------- */}
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

      {/* -------------------------------
          Modal for viewing a recipe
      ------------------------------- */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* -------------------------------
          Modal for adding a recipe to a meal slot
          - Directly calls updateMeal to sync backend + state
      ------------------------------- */}
      {showAddMeal.open && showAddMeal.mealType && (
        <AddToMealPlanModal
          plan={plan}
          onClose={() => setShowAddMeal({ mealType: "", open: false })}
          onAdd={async (mealType: MealType, recipe: Recipe) => {
            if (!plan.id) return;

            // Update backend
            await updateMeal(plan.id, today, mealType, recipe.id);

            // Update local state
            setRecipesForToday((prev) => ({ ...prev, [mealType]: recipe }));
          }}
        />
      )}
    </div>
  );
}
