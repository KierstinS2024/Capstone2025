// ===========================================
// PATH: src/components/MealPlanEditor.tsx
// Meal plan editor with drag-and-drop slots
// ===========================================

"use client";

import React, { useState } from "react";
import { MealPlan } from "@/types/mealPlan";
import { useMealPlans } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";
import RecipeModal from "./RecipeModal";
import { formatDateRange, getWeekDates } from "@/lib/helpers";
import { DragDropContext, Droppable } from "@hello-pangea/dnd"; // ✅ updated import
import RecipeSidebar from "./RecipeSidebar";
import styles from "@/styles/mealplan-editor.module.css";

interface Props {
  plan: MealPlan;
}

export default function MealPlanEditor({ plan }: Props) {
  const { updateMealPlan } = useMealPlans();
  const { recipes } = useRecipes();

  // Local editing state (clone to avoid mutating prop)
  const [editingPlan, setEditingPlan] = useState(structuredClone(plan));
  const [viewingRecipeId, setViewingRecipeId] = useState<string | null>(null);

  // Dates for table columns
  const weekDays = getWeekDates(editingPlan.startDate, editingPlan.endDate);

  /** Assign a recipe to a slot (day + meal) */
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

  /** Save meal plan back to context/API */
  async function handleSave() {
    try {
      const updated = await updateMealPlan(editingPlan.id, editingPlan);
      setEditingPlan(structuredClone(updated));
      alert("Meal plan saved!");
    } catch (err: any) {
      console.error(err);
      alert("Failed to save meal plan: " + err.message);
    }
  }

  // Recipe currently being viewed in modal
  const recipeToView = viewingRecipeId
    ? recipes.find((r) => r.id === viewingRecipeId)
    : null;

  return (
    <DragDropContext
      onDragEnd={(result) => {
        const { destination, draggableId } = result;
        if (!destination) return;

        // Ignore dragging back into recipe list
        if (destination.droppableId.startsWith("recipes")) return;

        // droppableId is formatted like "2025-09-23|breakfast"
        const [day, meal] = destination.droppableId.split("|");

        handleUpdateMeal(
          day,
          meal as "breakfast" | "lunch" | "dinner",
          draggableId
        );
      }}
    >
      <div className={styles.editorLayout}>
        {/* Sidebar containing available recipes */}
        <RecipeSidebar />

        <div className={styles.detail}>
          <h2>
            Meal Plan:{" "}
            {formatDateRange(editingPlan.startDate, editingPlan.endDate)}
          </h2>

          {/* Grid of meal slots */}
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
                        <Droppable droppableId={`${day}|${meal}`} key={meal}>
                          {(provided, snapshot) => (
                            <td>
                              {/* Wrapper div needed so ref is not attached to <td> */}
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
                                    <button
                                      className={styles.recipeBtn}
                                      onClick={() =>
                                        setViewingRecipeId(recipe.id)
                                      }
                                    >
                                      {recipe.title}
                                    </button>
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

          {/* Save button */}
          <button className={styles.saveBtn} onClick={handleSave}>
            Save Meal Plan
          </button>
        </div>
      </div>

      {/* Recipe detail modal */}
      {recipeToView && (
        <RecipeModal
          recipe={recipeToView}
          onClose={() => setViewingRecipeId(null)}
        />
      )}
    </DragDropContext>
  );
}
