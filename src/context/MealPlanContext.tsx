// path: src/context/MealPlanContext.tsx
"use client";

/**
 * MealPlanContext
 *
 * Provides global state for meal plans and helpers to update them.
 * Fully typed for TypeScript.
 */

import React, { createContext, ReactNode, useContext, useState } from "react";

// Individual meal plan entry
export interface MealPlanEntry {
  _id: string;
  recipeId: string;
  mealType: string;
  dayOfWeek: string;
  servings: number;
}

// Meal plan
export interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes: string;
  entries: MealPlanEntry[];
}

// Context type
interface MealPlanContextType {
  mealPlans: MealPlan[];
  setMealPlans: React.Dispatch<React.SetStateAction<MealPlan[]>>;
}

// Create context
const MealPlanContext = createContext<MealPlanContextType | undefined>(
  undefined
);

// Provider component
export const MealPlanProvider = ({ children }: { children: ReactNode }) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  return (
    <MealPlanContext.Provider value={{ mealPlans, setMealPlans }}>
      {children}
    </MealPlanContext.Provider>
  );
};

// Custom hook for consuming the context
export const useMealPlanContext = (): MealPlanContextType => {
  const context = useContext(MealPlanContext);
  if (!context)
    throw new Error(
      "useMealPlanContext must be used within a MealPlanProvider"
    );
  return context;
};
