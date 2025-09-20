// ===========================================
// PATH: src/components/MealPlanEditor.tsx
// Weekly Meal Plan Editor with drag & drop, select fallback, and safe handling of null/invalid dates
// ===========================================
"use client";

import React, { useState } from "react";
import { MealPlan } from "@/types/mealPlan";
import { useMealPlans } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";
import RecipeModal from "./RecipeModal";
import { formatDateRange, getWeekDates } from "@/lib/helpers";
import styles from "@/styles/mealplan-detail.module.css";

// Props: a fully loaded MealPlan object
interface Props {
  plan: MealPlan;
}

export default function MealPlanEditor({ plan }: Props) {
  const { updateMeal } = useMealPlans(); // context function to save changes
  const { recipes } = useRecipes(); // list of all recipes

  // -----------------------------
  // Local state for editing before saving
  // Deep clone ensures editing does not mutate context directly
  // -----------------------------
  const [editingPlan, setEditingPlan] = useState(structuredClone(plan));

  // Track recipe being dragged
  const [draggingRecipeId, setDraggingRecipeId] = useState<string | null>(null);

  // Track recipe currently being viewed in modal
  const [viewingRecipeId, setViewingRecipeId] = useState<string | null>(null);

  // -----------------------------
  // Array of date strings for the current week
  // Use helper that safely handles null/invalid startDate
  // If invalid, weekDays will be empty and table will render a message
  // -----------------------------
  const weekDays = getWeekDates(editingPlan.startDate);

  // -----------------------------
  // Update a meal slot in local state
  // -----------------------------
  function handleUpdateMeal(
    day: string,
    meal: "breakfast" | "lunch" | "dinner",
    recipeId: string | null
  ) {
    const copy = structuredClone(editingPlan);
    if (!copy.meals[day]) copy.meals[day] = {};
    copy.meals[day][meal] = recipeId;
    setEditingPlan(copy);
  }

  // -----------------------------
  // Save all changes to backend via context
  // -----------------------------
  async function handleSave() {
    if (weekDays.length === 0) {
      alert("Cannot save: invalid start date.");
      return;
    }

    for (const day of weekDays) {
      const dayMeals = editingPlan.meals[day] || {};
      for (const meal of ["breakfast", "lunch", "dinner"] as const) {
        const recipeId = dayMeals[meal] ?? null;
        await updateMeal(plan.id, day, meal, recipeId);
      }
    }

    alert("Meal plan saved!");
  }

  // -----------------------------
  // Drag & Drop Handlers
  // -----------------------------
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
    const recipeId = e.dataTransfer.getData("text/plain");
    if (recipeId) handleUpdateMeal(day, meal, recipeId);
    setDraggingRecipeId(null);
  };

  // -----------------------------
  // Find recipe for modal display
  // -----------------------------
  const recipeToView = viewingRecipeId
    ? recipes.find((r) => r.id === viewingRecipeId)
    : null;

  // -----------------------------
  // Render the table
  // -----------------------------
  return (
    <div className={styles.detail}>
      <h2>
        Meal Plan: {formatDateRange(editingPlan.startDate, editingPlan.endDate)}
      </h2>

      {/* If weekDays is empty due to invalid startDate, show warning */}
      {weekDays.length === 0 ? (
        <p style={{ color: "red" }}>Invalid start date. Cannot display week.</p>
      ) : (
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
                    const recipeId = dayMeals[meal] ?? null;
                    const recipe = recipes.find((r) => r.id === recipeId);

                    return (
                      <td
                        key={meal}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, day, meal)}
                      >
                        {/* Recipe button to open modal */}
                        {recipe ? (
                          <div className={styles.recipeSlot}>
                            <button
                              className={styles.recipeBtn}
                              onClick={() => setViewingRecipeId(recipe.id)}
                            >
                              {recipe.title}
                            </button>
                            {/* Remove recipe from slot */}
                            <button
                              className={styles.removeBtn}
                              onClick={() => handleUpdateMeal(day, meal, null)}
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <span className={styles.empty}>—</span>
                        )}

                        {/* Fallback select input */}
                        <select
                          value={recipeId || ""}
                          onChange={(e) =>
                            handleUpdateMeal(day, meal, e.target.value || null)
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
      )}

      {/* Save button commits all changes */}
      <button className={styles.saveBtn} onClick={handleSave}>
        Save Meal Plan
      </button>

      {/* Recipe modal */}
      {recipeToView && (
        <RecipeModal
          recipe={recipeToView}
          onClose={() => setViewingRecipeId(null)}
        />
      )}
    </div>
  );
}
