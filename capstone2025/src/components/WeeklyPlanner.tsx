// Path: src/components/WeeklyPlanner.tsx
"use client";

/**
 * WeeklyPlanner
 * -------------
 * Renders a weekly meal planner with drag-and-drop functionality.
 * Fully type-safe using MealPlanEntry and Recipe types.
 * Syncs changes with backend via optional callbacks.
 */

import React, { useState } from "react";
import { MealPlanEntry, MealType, Recipe } from "@/types/mealPlan";

// Props for the planner
interface WeeklyPlannerProps {
  /** Existing entries from backend */
  entries: MealPlanEntry[];
  /** Optional callback when entries are updated */
  onChange?: (updatedEntries: MealPlanEntry[]) => void;
}

/**
 * Days of the week in order
 */
const DAYS_OF_WEEK: WeeklyPlannerProps["entries"][number]["mealType"][] = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
];

/**
 * WeeklyPlanner Component
 */
export default function WeeklyPlanner({
  entries,
  onChange,
}: WeeklyPlannerProps) {
  // Local state for drag-drop UI
  const [plannerEntries, setPlannerEntries] =
    useState<MealPlanEntry[]>(entries);

  /**
   * handleEntryChange
   * -----------------
   * Updates a meal entry locally and triggers onChange callback
   */
  const handleEntryChange = (updated: MealPlanEntry) => {
    const updatedList = plannerEntries.map((e) =>
      e._id === updated._id ? updated : e
    );
    setPlannerEntries(updatedList);
    onChange?.(updatedList);
  };

  /**
   * handleAddEntry
   * --------------
   * Adds a new entry to a specific day and meal type
   */
  const handleAddEntry = (day: string, mealType: MealType) => {
    const newEntry: MealPlanEntry = {
      _id: `${Date.now()}`, // temporary id for UI; backend will override
      recipeId: "", // empty by default
      servings: 1,
      mealType,
    };
    const updatedList = [...plannerEntries, newEntry];
    setPlannerEntries(updatedList);
    onChange?.(updatedList);
  };

  /**
   * getEntriesForMeal
   * -----------------
   * Filters entries for a specific day and meal type
   */
  const getEntriesForMeal = (mealType: MealType) =>
    plannerEntries.filter((e) => e.mealType === mealType);

  return (
    <div
      className="weekly-planner card"
      style={{ display: "grid", gap: "1rem" }}
    >
      {DAYS_OF_WEEK.map((mealType) => (
        <div key={mealType}>
          <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>
          <ul>
            {getEntriesForMeal(mealType).map((entry) => {
              const recipe =
                typeof entry.recipeId === "object" ? entry.recipeId : null;
              return (
                <li
                  key={entry._id}
                  className="planner-entry card"
                  style={{ marginBottom: "0.5rem", padding: "0.5rem" }}
                >
                  <span>{recipe ? recipe.title : "Select Recipe"}</span>
                  <input
                    type="number"
                    min={1}
                    value={entry.servings}
                    onChange={(e) =>
                      handleEntryChange({
                        ...entry,
                        servings: Number(e.target.value),
                      })
                    }
                    style={{ width: "3rem", marginLeft: "1rem" }}
                  />
                </li>
              );
            })}
          </ul>
          <button type="button" onClick={() => handleAddEntry("", mealType)}>
            + Add {mealType}
          </button>
        </div>
      ))}
    </div>
  );
}
