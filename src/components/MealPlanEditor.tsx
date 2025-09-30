/**
 * MealPlanEditor
 * - Displays a full meal plan (dates × meal types)
 * - Each meal slot is droppable
 * - Existing meals are draggable
 * - Shows recipe titles instead of raw IDs
 */

"use client";

import React from "react";
import { MealPlan, DayMeals, MealType } from "@/types/mealPlan";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { useRecipes } from "@/context/RecipeContext"; // to map recipe IDs → human-readable titles
import styles from "@/styles/mealPlanEditor.module.css";

/**
 * Props for the MealPlanEditor component
 */
interface MealPlanEditorProps {
  plan: MealPlan; // Active meal plan must always be passed
}

export default function MealPlanEditor({ plan }: MealPlanEditorProps) {
  // -----------------------------
  // Access saved recipes to convert IDs → titles
  // -----------------------------
  const { recipes } = useRecipes();

  /**
   * Helper function to get recipe title from ID
   * Falls back to ID if recipe not found
   */
  const getRecipeTitle = (id: string) => {
    const recipe = recipes.find((r) => r.id === id);
    return recipe ? recipe.title : id;
  };

  // -----------------------------
  // Ensure meals object exists
  // Each day should have breakfast, lunch, and dinner
  // -----------------------------
  const meals: Record<string, DayMeals> = plan.meals || {};
  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

  return (
    <div className={styles.mealPlanEditor}>
      {/* -----------------------------
          Header showing date range of the plan
      ----------------------------- */}
      <h2>
        Meal Plan ({plan.startDate || "N/A"} → {plan.endDate || "N/A"})
      </h2>

      {/* -----------------------------
          Loop over each day in the plan
      ----------------------------- */}
      {Object.entries(meals).map(([date, dayMeals]) => {
        // Provide safe defaults for meals
        const safeDayMeals: DayMeals = {
          breakfast: dayMeals.breakfast || "",
          lunch: dayMeals.lunch || "",
          dinner: dayMeals.dinner || "",
        };

        return (
          <div key={date} className={styles.dayContainer}>
            <h3 className={styles.dayHeader}>{date}</h3>

            <div className={styles.mealsRow}>
              {/* -----------------------------
                  Loop over each meal type for this day
              ----------------------------- */}
              {mealTypes.map((type) => {
                const recipeId = safeDayMeals[type] || "";

                return (
                  <Droppable droppableId={`${date}_${type}`} key={type}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={
                          snapshot.isDraggingOver
                            ? `${styles.mealSlot} ${styles.dragOver}`
                            : styles.mealSlot
                        }
                      >
                        {/* -----------------------------
                            If a recipe exists for this slot:
                            - Render a draggable card
                            - Use a unique draggableId
                              Why unique? Because the same recipe may appear
                              in multiple slots. DnD needs globally unique IDs.
                        ----------------------------- */}
                        {recipeId ? (
                          <Draggable
                            draggableId={`${recipeId}_${date}_${type}`} // ✅ ensures uniqueness
                            index={0} // only one item per slot
                            key={`${recipeId}_${date}_${type}`} // match draggableId
                          >
                            {(prov, snap) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className={
                                  snap.isDragging
                                    ? `${styles.recipeCard} ${styles.dragging}`
                                    : styles.recipeCard
                                }
                              >
                                {getRecipeTitle(recipeId)}
                              </div>
                            )}
                          </Draggable>
                        ) : (
                          // -----------------------------
                          // Empty slot: placeholder for dropping recipes
                          // -----------------------------
                          <p className={styles.emptySlot}>Drop recipe here</p>
                        )}

                        {/* Placeholder required by Droppable */}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
