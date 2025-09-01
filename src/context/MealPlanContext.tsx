// src/context/MealPlanContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of a meal plan
export interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes?: string;
  entries?: any[];
}

// The context type
interface MealPlanContextType {
  mealPlans: MealPlan[];
  setMealPlans: React.Dispatch<React.SetStateAction<MealPlan[]>>;
}

// Create the context
const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

// Provider component
export const MealPlanProvider = ({ children }: { children: ReactNode }) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  return (
    <MealPlanContext.Provider value={{ mealPlans, setMealPlans }}>
      {children}
    </MealPlanContext.Provider>
  );
};

// Custom hook to consume the context
export const useMealPlanContext = () => {
  const context = useContext(MealPlanContext);
  if (!context) throw new Error("useMealPlanContext must be used within a MealPlanProvider");
  return context;
};
