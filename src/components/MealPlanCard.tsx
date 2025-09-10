// src/components/MealPlanCard.tsx
import React from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import type { MealPlanEntry } from "@/types/mealPlan";

/**
 * MealPlanCard
 * Displays the current meal plan with title, date range, and entries.
 * Pulls data from MealPlanContext.
 */
export const MealPlanCard: React.FC = () => {
  const { currentMealPlan } = useMealPlan();

  if (!currentMealPlan) {
    return <div>No active meal plan. Create one to get started!</div>;
  }

  const { title, startDate, endDate, entries } = currentMealPlan;

  return (
    <div className="meal-plan-card p-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-gray-500">
        {new Date(startDate).toLocaleDateString()} -{" "}
        {new Date(endDate).toLocaleDateString()}
      </p>
      <div className="entries mt-2">
        {entries.map((entry: MealPlanEntry) => (
          <div
            key={entry.date.toString() + entry.mealType}
            className="entry border-t py-1 flex justify-between"
          >
            <span className="meal-type font-medium">{entry.mealType}</span>
            <span className="recipe-id text-gray-700">
              Recipe ID: {entry.recipeId}
            </span>
          </div>
        ))}
      </div>
      <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">
        Edit Plan
      </button>
    </div>
  );
};
