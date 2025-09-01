// src/context/MealPlanContext.tsx
"use client";

// Context for managing meal plans globally in the app
import React, { createContext, ReactNode, useState } from "react";

interface MealPlanContextProps {
  mealPlans: any[];
  setMealPlans: React.Dispatch<React.SetStateAction<any[]>>;
}

export const MealPlanContext = createContext<MealPlanContextProps>({
  mealPlans: [],
  setMealPlans: () => {},
});

export const MealPlanProvider = ({ children }: { children: ReactNode }) => {
  const [mealPlans, setMealPlans] = useState<any[]>([]);

  return (
    <MealPlanContext.Provider value={{ mealPlans, setMealPlans }}>
      {children}
    </MealPlanContext.Provider>
  );
};
