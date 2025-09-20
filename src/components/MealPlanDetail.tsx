// ===========================================
// PATH: src/components/MealPlanDetail.tsx
// ===========================================
"use client";

import React, { useState } from "react";
import { MealPlan } from "@/lib/mealPlanApi";
import { useRecipes } from "@/context/RecipeContext";
import RecipeModal from "@/components/RecipeModal";
import styles from "@/styles/mealplan-detail.module.css";
import { formatDateRange, getWeekDates } from "@/lib/helpers";

interface Props {
  plan: MealPlan; // The meal plan to edit
  onSave: (updated: MealPlan) => void; // Callback to save changes
}

export default function MealPlanDetail({ plan, onSave }: Props) {
  const { recipes } = useRecipes(); // All recipes from context
  const [editingPlan, setEditingPlan] = useState<MealPlan>(
    structuredClone(plan)
  );
  const [viewingRecipeId, setViewingRecipeId] = useState<string | null>(null);
  const [draggingRecipeId, setDraggingRecipeId] = useState<string | null>(null);

  const weekDays = getWeekDates(plan.startDate); // 7-day array

  // -----------------------------
  // Update meal in state
  // -----------------------------
  function updateMeal(
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
  // Save handler
  // -----------------------------
  function handleSave() {
    onSave(editingPlan);
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
    if (draggingRecipeId) {
      updateMeal(day, meal, draggingRecipeId);
      setDraggingRecipeId(null);
    }
  };

  const recipeToView = viewingRecipeId
    ? recipes.find((r) => r.id === viewingRecipeId)
    : null;

  return (
    <div className={styles.detail}>
      <h2>Meal Plan: {formatDateRange(plan.startDate, plan.endDate)}</h2>

      <div className={styles.layout}>
        {/* Sidebar: Draggable recipes */}
        <div className={styles.sidebar}>
          <h3>Recipes</h3>
          {recipes.map((recipe) => (
            <div
              key={recipe.id} // unique key per recipe
              className={`${styles.recipeCard} ${
                recipe.temporary ? styles.temporary : ""
              }`}
              draggable
              onDragStart={() => handleDragStart(recipe.id)}
            >
              {recipe.title}
            </div>
          ))}
        </div>

        {/* Meal plan table */}
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
                    const recipeId = dayMeals[meal];
                    const recipe = recipes.find((r) => r.id === recipeId);
                    return (
                      <td
                        key={meal} // key per meal column
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, day, meal)}
                      >
                        {recipe ? (
                          <button onClick={() => setViewingRecipeId(recipe.id)}>
                            {recipe.title}
                          </button>
                        ) : (
                          <span className={styles.empty}>—</span>
                        )}

                        {/* Fallback select */}
                        <select
                          onChange={(e) =>
                            updateMeal(day, meal, e.target.value || null)
                          }
                          value={recipeId || ""}
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
      </div>

      <button className={styles.saveBtn} onClick={handleSave}>
        Save Meal Plan
      </button>

      {recipeToView && (
        <RecipeModal
          recipe={recipeToView}
          onClose={() => setViewingRecipeId(null)}
        />
      )}
    </div>
  );
}
