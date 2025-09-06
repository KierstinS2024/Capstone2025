"use client";

/**
 * Global context for managing MealPlans and their entries
 */

import React, { createContext, ReactNode, useContext, useState } from "react";

// Types
export interface MealPlanEntry {
  _id: string;
  recipeId: string;
  mealType: string;
  dayOfWeek: string;
  servings: number;
}

export interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes: string;
  entries: MealPlanEntry[];
}

// Context type
interface MealPlanContextProps {
  mealPlans: MealPlan[];
  setMealPlans: React.Dispatch<React.SetStateAction<MealPlan[]>>;
}

// Create context
const MealPlanContext = createContext<MealPlanContextProps | undefined>(
  undefined
);

// Provider
export const MealPlanProvider = ({ children }: { children: ReactNode }) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  return (
    <MealPlanContext.Provider value={{ mealPlans, setMealPlans }}>
      {children}
    </MealPlanContext.Provider>
  );
};

// Custom hook
export const useMealPlanContext = (): MealPlanContextProps => {
  const context = useContext(MealPlanContext);
  if (!context)
    throw new Error(
      "useMealPlanContext must be used within a MealPlanProvider"
    );
  return context;
};
