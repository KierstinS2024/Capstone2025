// Path: src/context/MealPlanContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { MealPlanEntry } from "@/types/mealPlan";

/**
 * Context type for meal plan management
 */
interface MealPlanContextType {
  entries: MealPlanEntry[];
  todayMeals: MealPlanEntry[];
  addMeal: (meal: MealPlanEntry) => void;
  removeMeal: (recipeId: string) => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(
  undefined
);

/**
 * Provider to wrap the app and manage meal plan state
 */
export const MealPlanProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [entries, setEntries] = useState<MealPlanEntry[]>([]);

  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  /**
   * Compute meals scheduled for today
   */
  const todayMeals = entries.filter((meal) => meal.date.startsWith(today));

  /**
   * Add a meal to the plan
   */
  const addMeal = (meal: MealPlanEntry) => {
    setEntries((prev) => [...prev, meal]);
  };

  /**
   * Remove a meal by recipeId
   */
  const removeMeal = (recipeId: string) => {
    setEntries((prev) => prev.filter((meal) => meal.recipeId !== recipeId));
  };

  return (
    <MealPlanContext.Provider
      value={{ entries, todayMeals, addMeal, removeMeal }}
    >
      {children}
    </MealPlanContext.Provider>
  );
};

/**
 * Hook to use meal plan context
 */
export const useMealPlan = (): MealPlanContextType => {
  const context = useContext(MealPlanContext);
  if (!context)
    throw new Error("useMealPlan must be used within a MealPlanProvider");
  return context;
};
