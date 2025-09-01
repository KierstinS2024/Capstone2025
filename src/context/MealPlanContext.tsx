// src/context/MealPlanContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";

interface MealPlan {
  id: string;
  weekStartDate: string;
  notes?: string;
  entriesCount?: number;
}

interface MealPlanContextType {
  mealPlans: MealPlan[];
  addMealPlan: (plan: MealPlan) => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export function MealPlanProvider({ children }: { children: React.ReactNode }) {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  const addMealPlan = (plan: MealPlan) => {
    setMealPlans((prev) => [...prev, plan]);
  };

  return (
    <MealPlanContext.Provider value={{ mealPlans, addMealPlan }}>
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlans() {
  const ctx = useContext(MealPlanContext);
  if (!ctx) {
    throw new Error("useMealPlans must be used within a MealPlanProvider");
  }
  return ctx;
}
