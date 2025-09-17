import React, { useState, useEffect } from "react";
import { MealPlan, MealType } from "@/lib/mealPlanApi";
import MealCard from "./MealCard";
import RecipeModal from "./RecipeModal";
import AddToMealPlanModal from "./AddToMealPlanModal";
import { useRecipes, Recipe } from "@/context/RecipeContext";
import { formatDateRange, todayISO } from "@/lib/helpers";
import styles from "@/styles/mealPlanCard.module.css";

interface Props {
  plan: MealPlan;
}

export default function MealPlanCard({ plan }: Props) {
  const { fetchRecipe } = useRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAddMeal, setShowAddMeal] = useState<{
    mealType: MealType | "";
    open: boolean;
  }>({ mealType: "", open: false });

  const today = todayISO();

  // state to hold recipes for today
  const [recipesForToday, setRecipesForToday] = useState<
    Partial<Record<MealType, Recipe>>
  >({});

  useEffect(() => {
    const loadRecipes = async () => {
      const meals = plan.meals[today] || {};
      const entries: [MealType, Recipe][] = [];

      for (const mealType of ["breakfast", "lunch", "dinner"] as MealType[]) {
        const recipeId = meals[mealType];
        if (recipeId) {
          const recipe = await fetchRecipe(recipeId);
          if (recipe) entries.push([mealType, recipe]);
        }
      }

      setRecipesForToday(Object.fromEntries(entries));
    };

    loadRecipes();
  }, [plan, today, fetchRecipe]);

  const handleMealClick = (mealType: MealType, recipe?: Recipe) => {
    if (recipe) {
      setSelectedRecipe(recipe);
    } else {
      setShowAddMeal({ mealType, open: true });
    }
  };

  return (
    <div className={styles.planCard}>
      <h2 className={styles.dateRange}>
        {formatDateRange(plan.startDate, plan.endDate)}
      </h2>

      <div className={styles.meals}>
        {(["breakfast", "lunch", "dinner"] as MealType[]).map((mealType) => {
          const recipe = recipesForToday[mealType];

          return (
            <MealCard
              key={mealType}
              mealType={mealType}
              recipe={recipe}
              onClick={() => handleMealClick(mealType, recipe)}
            />
          );
        })}
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Add Meal Modal */}
      {showAddMeal.open && showAddMeal.mealType && (
        <AddToMealPlanModal
          recipe={selectedRecipe!} // should always be set if modal opens
          plan={plan}
          mealType={showAddMeal.mealType}
          onClose={() => setShowAddMeal({ mealType: "", open: false })}
        />
      )}
    </div>
  );
}
