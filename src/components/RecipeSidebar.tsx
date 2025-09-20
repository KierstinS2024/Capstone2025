// ===========================================
// PATH: src/components/MealPlanEditor.tsx
// Weekly Meal Plan Table with drag & drop functionality
// -------------------------------------------
// 1. Shows a table of days x meals (breakfast/lunch/dinner)
// 2. Users can drag recipes from sidebar into cells
// 3. Users can click recipes to open RecipeModal
// 4. Optional select fallback for accessibility
// 5. Save button commits changes to context & backend
// 6. Handles temporary recipes cleanup via RecipeContext
// ===========================================
"use client";

import React, { useState } from "react";
import { MealPlan } from "@/types/mealPlan"; // type from your types folder
import { useMealPlans } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";
import RecipeModal from "./RecipeModal";
import { formatDateRange, getWeekDates } from "@/lib/helpers";
import styles from "@/styles/mealplan-detail.module.css";

interface Props {
  plan: MealPlan;
}

export default function MealPlanEditor({ plan }: Props) {
  const { updateMeal } = useMealPlans();
  const { recipes, unlinkTemporaryRecipe } = useRecipes();

  // Local copy for editing before saving
  const [editingPlan, setEditingPlan] = useState(structuredClone(plan));

  // Track recipe being dragged
  const [draggingRecipeId, setDraggingRecipeId] = useState<string | null>(null);

  // Track recipe currently being viewed in modal
  const [viewingRecipeId, setViewingRecipeId] = useState<string | null>(null);

  // Array of date strings for the current week
  const weekDays = getWeekDates(plan.startDate);

  // -----------------------------
  // Update a meal slot in local state
  // -----------------------------
  function handleUpdateMeal(
    day: string,
    meal: "breakfast" | "lunch" | "dinner",
    recipeId: string | undefined
  ) {
    const copy = structuredClone(editingPlan);
    if (!copy.meals[day]) copy.meals[day] = {};
    copy.meals[day][meal] = recipeId ?? undefined;
    setEditingPlan(copy);
  }

  // -----------------------------
  // Save all changes to context & backend
  // -----------------------------
  async function handleSave() {
    for (const day of weekDays) {
      const dayMeals = editingPlan.meals[day] || {};
      for (const meal of ["breakfast", "lunch", "dinner"] as const) {
        const recipeId = dayMeals[meal] ?? undefined;

        // If removing a recipe, clean up temporary recipe
        if (!recipeId) {
          const oldRecipeId = plan.meals?.[day]?.[meal];
          if (oldRecipeId) {
            const oldRecipe = recipes.find((r) => r.id === oldRecipeId);
            if (oldRecipe?.temporary) {
              await unlinkTemporaryRecipe(oldRecipeId);
            }
          }
        }

        await updateMeal(plan.id, day, meal, recipeId);
      }
    }
    alert("Meal plan saved!");
  }

  // -----------------------------
  // Drag & Drop Handlers
  // -----------------------------
  const handleDragStart = (recipeId: string) => setDraggingRecipeId(recipeId);

  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add(styles.over);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.currentTarget.classList.remove(styles.over);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLTableCellElement>,
    day: string,
    meal: "breakfast" | "lunch" | "dinner"
  ) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.over);

    // Dragging recipe id comes from drag start
    if (draggingRecipeId) {
      handleUpdateMeal(day, meal, draggingRecipeId);
      setDraggingRecipeId(null);
    }
  };

  // Find recipe for modal display
  const recipeToView = viewingRecipeId
    ? recipes.find((r) => r.id === viewingRecipeId)
    : null;

  return (
    <div className={styles.detail}>
      <h2>Meal Plan: {formatDateRange(plan.startDate, plan.endDate)}</h2>

      {/* Weekly Table */}
      <table className={styles.planTable}>
        <thead>
          <tr>
            <th>Day</th>
            <th>Breakfast</th>
            <th>Lunch</th>
            <th>Dinner</th>
          </tr>
        </thead>
        <tbody>
          {weekDays.map((day) => {
            const dayMeals = editingPlan.meals[day] || {};
            return (
              <tr key={day}>
                <td>{day}</td>
                {(["breakfast", "lunch", "dinner"] as const).map((meal) => {
                  const recipeId = dayMeals[meal] ?? undefined;
                  const recipe = recipes.find((r) => r.id === recipeId);
                  return (
                    <td
                      key={meal}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, day, meal)}
                    >
                      {/* Recipe button to view modal */}
                      {recipe ? (
                        <button onClick={() => setViewingRecipeId(recipe.id)}>
                          {recipe.title}
                        </button>
                      ) : (
                        <span className={styles.empty}>—</span>
                      )}

                      {/* Fallback select input */}
                      <select
                        value={recipeId || ""}
                        onChange={(e) =>
                          handleUpdateMeal(
                            day,
                            meal,
                            e.target.value || undefined
                          )
                        }
                      >
                        <option value="">— Select —</option>
                        {recipes.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <button className={styles.saveBtn} onClick={handleSave}>
        Save Meal Plan
      </button>

      {/* Recipe Modal */}
      {recipeToView && (
        <RecipeModal
          recipe={recipeToView}
          onClose={() => setViewingRecipeId(null)}
        />
      )}
    </div>
  );
}
