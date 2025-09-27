// ===========================================
// PATH: src/components/MealPlanEditor.tsx
//
// MealPlanEditor — week-based table for planning meals
// - Drag-and-drop from RecipeSidebar
// - Instant updates to backend/context
// - Warns before overwriting slots
// - Read-only recipe display (no modal)
// - Fully TypeScript-safe
// ===========================================

"use client";

import React, { useState, useEffect } from "react";
import { MealPlan, MealType } from "@/types/mealPlan";
import { useMealPlans } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";
import RecipeSidebar from "./RecipeSidebar";
import { formatDateRange, getWeekDates } from "@/lib/helpers";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import styles from "@/styles/theme-mealplan.module.css";

// Props: single meal plan to edit
interface Props {
  plan: MealPlan;
}

export default function MealPlanEditor({ plan }: Props) {
  const { updateMeal } = useMealPlans(); // update function
  const { recipes } = useRecipes(); // all user recipes

  // Local copy of plan for UI updates
  const [editingPlan, setEditingPlan] = useState<MealPlan>(plan);

  // Toast messages for feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync local state when prop changes
  useEffect(() => {
    setEditingPlan(plan);
  }, [plan]);

  // Compute week dates for table rows
  const weekDays = getWeekDates(editingPlan.startDate, editingPlan.endDate);

  // -------------------------------
  // Helper: show temporary toast
  // -------------------------------
  function showToast(message: string, duration = 1500) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), duration);
  }

  // -------------------------------
  // Update a single meal slot
  // -------------------------------
  async function handleUpdateMeal(
    day: string,
    meal: MealType,
    recipeId: string | null
  ) {
    const existingRecipe = editingPlan.meals[day]?.[meal];

    // Confirm overwrite if replacing a different recipe
    if (existingRecipe && recipeId && existingRecipe !== recipeId) {
      const overwriteConfirmed = confirm(
        "This slot already has a recipe. Replace it?"
      );
      if (!overwriteConfirmed) return;
    }

    try {
      await updateMeal(editingPlan.id, day, meal, recipeId);
      showToast(
        recipeId
          ? `Added ${recipes.find((r) => r.id === recipeId)?.title} to ${meal}`
          : `Removed ${meal} for ${day}`
      );
    } catch (err) {
      console.error("Failed to update meal:", err);
      showToast("Failed to update meal");
    }
  }

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <DragDropContext
      onDragEnd={(result) => {
        const { destination, draggableId } = result;
        if (!destination) return;

        // Prevent dropping back into sidebar
        if (destination.droppableId.startsWith("recipes")) return;

        const [day, meal] = destination.droppableId.split("|");
        handleUpdateMeal(day, meal as MealType, draggableId);
      }}
    >
      <div className={styles.editorLayout}>
        {/* Sidebar with draggable recipes */}
        <RecipeSidebar />

        {/* Main meal plan table */}
        <div className={styles.detail}>
          <h2 className={styles.heading2}>
            Meal Plan:{" "}
            {formatDateRange(editingPlan.startDate, editingPlan.endDate)}
          </h2>

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

                    {/* Breakfast, Lunch, Dinner slots */}
                    {(["breakfast", "lunch", "dinner"] as const).map((meal) => {
                      const recipeId = dayMeals[meal] ?? null;
                      const recipe = recipes.find((r) => r.id === recipeId);

                      return (
                        <Droppable droppableId={`${day}|${meal}`} key={meal}>
                          {(provided, snapshot) => (
                            <td>
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={
                                  snapshot.isDraggingOver
                                    ? styles.highlight
                                    : styles.slot
                                }
                              >
                                {recipe ? (
                                  <div className={styles.recipeSlot}>
                                    {/* Recipe title (read-only) */}
                                    <span>{recipe.title}</span>

                                    {/* Remove button */}
                                    <button
                                      className={styles.removeBtn}
                                      onClick={() =>
                                        handleUpdateMeal(day, meal, null)
                                      }
                                    >
                                      ×
                                    </button>
                                  </div>
                                ) : (
                                  <span className={styles.empty}>
                                    Drop here
                                  </span>
                                )}

                                {provided.placeholder}
                              </div>
                            </td>
                          )}
                        </Droppable>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Toast message */}
          {toastMessage && <div className={styles.toast}>{toastMessage}</div>}
        </div>
      </div>
    </DragDropContext>
  );
}
