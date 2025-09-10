// src/context/MealPlanContext.tsx
import { createContext, useState, useEffect, ReactNode } from "react";
import type { MealPlan } from "../models/MealPlan";
import { fetchMealPlans } from "../lib/mealPlanApi";

type MealPlanContextType = {
  plans: MealPlan[];
  refresh: () => Promise<void>;
};

export const MealPlanContext = createContext<MealPlanContextType | undefined>(
  undefined
);

export const MealPlanProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<MealPlan[]>([]);

  const refresh = async () => {
    const data = await fetchMealPlans();
    setPlans(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <MealPlanContext.Provider value={{ plans, refresh }}>
      {children}
    </MealPlanContext.Provider>
  );
};
