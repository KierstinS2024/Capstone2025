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
  // Ensure at least one date column exists for new plans
  const sortedDates =
    Object.keys(meals).length > 0
      ? Object.keys(meals).sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        )
      : [plan.startDate || new Date().toISOString().split("T")[0]];

  const getRecipeTitle = (id: string) =>
    recipes.find((r) => r.id === id)?.title || id;

  return (
    <div className={styles.mealPlanEditor}>
      {sortedDates.map((date) => {
        // Ensure each day has breakfast, lunch, dinner keys
        const dayMeals = meals[date] || {
          breakfast: "",
          lunch: "",
          dinner: "",
        };

        return (
          <div key={date} className={styles.dayColumn}>
            <h3 className={styles.dayHeader}>{date}</h3>

            {mealTypes.map((mealType) => {
              const recipeId = dayMeals[mealType] || "";

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
                                onClick={() =>
                                  removeMealFromPlan(date, mealType)
                                }
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
        );
      })}
    </div>
  );
}
