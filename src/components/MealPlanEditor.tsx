// ===========================================
// PATH: src/components/MealPlanEditor.tsx
// Drag-and-drop editor for an existing meal plan
// ===========================================
"use client";

import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { MealPlan, MealType } from "@/types/mealPlan";
import { useRecipes } from "@/context/RecipeContext";
import { useMealPlans } from "@/context/MealPlanContext";
import styles from "@/styles/mealPlanEditor.module.css";

interface MealPlanEditorProps {
  plan: MealPlan;
}

// All meal types
const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

export default function MealPlanEditor({ plan }: MealPlanEditorProps) {
  const { recipes } = useRecipes();
  const { removeMealFromPlan } = useMealPlans();

  const meals = plan.meals || {};
  const sortedDates = Object.keys(meals).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const getRecipeTitle = (id: string) =>
    recipes.find((r) => r.id === id)?.title || id;

  // Show placeholder if plan empty
  if (!sortedDates.length)
    return (
      <p className={styles.noMeals}>
        No meals yet. Add recipes from the sidebar.
      </p>
    );

  return (
    <div className={styles.mealPlanEditor}>
      {sortedDates.map((date) => (
        <div key={date} className={styles.dayColumn}>
          <h3 className={styles.dayHeader}>{date}</h3>

          {mealTypes.map((mealType) => {
            const recipeId = meals[date]?.[mealType] || "";

            return (
              <Droppable droppableId={`${date}_${mealType}`} key={mealType}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`${styles.mealSlot} ${
                      snapshot.isDraggingOver ? styles.dragOver : ""
                    } ${!recipeId ? styles.emptySlot : ""}`}
                  >
                    {recipeId ? (
                      <Draggable draggableId={recipeId} index={0}>
                        {(providedDraggable, snapshotDraggable) => (
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                            className={`${styles.recipeCard} ${
                              snapshotDraggable.isDragging
                                ? styles.dragging
                                : ""
                            }`}
                          >
                            {getRecipeTitle(recipeId)}
                            <button
                              className={styles.removeBtn}
                              onClick={() => removeMealFromPlan(date, mealType)}
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ) : (
                      <span className={styles.placeholderText}>
                        Drop recipe here
                      </span>
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      ))}
    </div>
  );
}
