//src/components/MealPlanEditor.tsx
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

const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

export default function MealPlanEditor({ plan }: MealPlanEditorProps) {
  const { recipes } = useRecipes();
  const { removeMealFromPlan } = useMealPlans();
  const meals = plan.meals || {};

  const buildDateRange = (start: string, end: string) => {
    const dates: string[] = [];
    const current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const sortedDates =
    plan.startDate && plan.endDate
      ? buildDateRange(plan.startDate, plan.endDate)
      : [plan.startDate || new Date().toISOString().split("T")[0]];

  const getRecipeTitle = (id: string) =>
    recipes.find((r) => r.id === id)?.title || id;

  return (
    <div className={styles.calendarGrid}>
      {/* Header row: empty corner + meal types */}
      <div className={styles.headerRow}>
        <div className={styles.dayLabel}></div>
        {mealTypes.map((meal) => (
          <div key={meal} className={styles.mealTypeHeader}>
            {meal.charAt(0).toUpperCase() + meal.slice(1)}
          </div>
        ))}
      </div>

      {/* Day rows */}
      {sortedDates.map((date) => {
        const dayMeals = meals[date] || {
          breakfast: "",
          lunch: "",
          dinner: "",
        };

        return (
          <div key={date} className={styles.dayRow}>
            <div className={styles.dayLabel}>{date}</div>

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
                        <Draggable
                          draggableId={`${recipeId}_${date}_${mealType}`}
                          index={0}
                        >
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
