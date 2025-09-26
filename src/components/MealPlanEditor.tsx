// ===========================================
// PATH: src/components/MealPlanEditor.tsx
//
// MealPlanEditor — week-based table for planning meals
// - Drag-and-drop from RecipeSidebar
// - Instant updates to backend/context
// - Warns before overwriting slots
// - Integrates RecipeModal in read-only mode
// - Fully TypeScript-safe
// ===========================================

"use client";

import React, { useState, useEffect } from "react";
import { MealPlan, MealType } from "@/types/mealPlan";
import { useMealPlans } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";
import RecipeModal from "./RecipeModal"; // now supports optional delete
import RecipeSidebar from "./RecipeSidebar";
import { formatDateRange, getWeekDates } from "@/lib/helpers";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import styles from "@/styles/theme-mealplan.module.css";

// Props: MealPlan object to edit
interface Props {
  plan: MealPlan;
}

export default function MealPlanEditor({ plan }: Props) {
  const { updateMeal } = useMealPlans(); // slot update function (context + backend)
  const { recipes } = useRecipes(); // all recipes available to the user

  // Local copy of plan for immediate UI updates
  const [editingPlan, setEditingPlan] = useState<MealPlan>(
    structuredClone(plan)
  );

  // Currently open recipe modal (null = no modal open)
  const [recipeModalId, setRecipeModalId] = useState<string | null>(null);

  // Toast messages for quick feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync local state when prop `plan` changes
  useEffect(() => {
    setEditingPlan(structuredClone(plan));
  }, [plan]);

  // Compute array of ISO dates (start → end)
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
  function handleUpdateMeal(
    day: string,
    meal: MealType,
    recipeId: string | null
  ) {
    // Validate recipe exists if recipeId provided
    if (recipeId && !recipes.find((r) => r.id === recipeId)) {
      alert("Selected recipe does not exist.");
      return;
    }

    // Clone plan safely
    const planCopy = structuredClone(editingPlan);
    const existingRecipe = planCopy.meals[day]?.[meal];

    // Confirm overwrite if replacing
    if (existingRecipe && recipeId && existingRecipe !== recipeId) {
      const overwriteConfirmed = confirm(
        "This slot already has a recipe. Replace it?"
      );
      if (!overwriteConfirmed) return;
    }

    // Ensure day object exists
    if (!planCopy.meals[day]) planCopy.meals[day] = {};

    // Update local state
    planCopy.meals[day][meal] = recipeId;
    setEditingPlan(planCopy);

    // Update backend/context asynchronously
    updateMeal(planCopy.id, day, meal, recipeId)
      .then(() => {
        showToast(
          recipeId
            ? `Added ${
                recipes.find((r) => r.id === recipeId)?.title
              } to ${meal}`
            : `Removed ${meal} for ${day}`
        );
      })
      .catch((err) => {
        console.error("Failed to update meal:", err);
        showToast("Failed to update meal");
      });
  }

  // Recipe object currently shown in modal
  const currentRecipe = recipeModalId
    ? recipes.find((r) => r.id === recipeModalId)
    : null;

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <DragDropContext
      onDragEnd={(result) => {
        const { destination, draggableId } = result;
        if (!destination) return;

        // Ignore drags into sidebar
        if (destination.droppableId.startsWith("recipes")) return;

        // droppableId format: "YYYY-MM-DD|mealType"
        const [day, meal] = destination.droppableId.split("|");
        handleUpdateMeal(day, meal as MealType, draggableId);
      }}
    >
      <div className={styles.editorLayout}>
        {/* Sidebar with draggable recipes */}
        <RecipeSidebar />

        <div className={styles.detail}>
          <h2 className={styles.heading2}>
            Meal Plan:{" "}
            {formatDateRange(editingPlan.startDate, editingPlan.endDate)}
          </h2>

          {/* Meal plan week table */}
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

                    {/* For each meal slot */}
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
                                    {/* Recipe name opens modal */}
                                    <button
                                      onClick={() =>
                                        setRecipeModalId(recipe.id)
                                      }
                                    >
                                      {recipe.title}
                                    </button>

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

          {/* Toast feedback */}
          {toastMessage && <div className={styles.toast}>{toastMessage}</div>}
        </div>
      </div>

      {/* Recipe modal (read-only: no delete passed) */}
      {currentRecipe && (
        <RecipeModal
          recipe={currentRecipe}
          onClose={() => setRecipeModalId(null)}
          // no onDelete → modal runs in read-only mode
        />
      )}
    </DragDropContext>
  );
}
