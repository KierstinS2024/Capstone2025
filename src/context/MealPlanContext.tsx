// src/context/MealPlanContext.tsx
// React Context for meal plans with API integration

"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { MealPlan } from "../models/MealPlan";
import {
  fetchMealPlans,
  createMealPlan,
  deleteMealPlan,
} from "../lib/mealPlanApi";

type MealPlanContextType = {
  mealPlans: MealPlan[];
  addMealPlan: (plan: MealPlan) => Promise<void>;
  removeMealPlan: (id: string) => Promise<void>;
  refreshMealPlans: () => Promise<void>;
};

const MealPlanContext = createContext<MealPlanContextType | undefined>(
  undefined
);

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  useEffect(() => {
    refreshMealPlans();
  }, []);

  async function refreshMealPlans() {
    const data = await fetchMealPlans();
    setMealPlans(data);
  }

  async function addMealPlan(plan: MealPlan) {
    const newPlan = await createMealPlan(plan);
    setMealPlans((prev) => [...prev, newPlan]);
  }

  async function removeMealPlan(id: string) {
    await deleteMealPlan(id);
    setMealPlans((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <MealPlanContext.Provider
      value={{ mealPlans, addMealPlan, removeMealPlan, refreshMealPlans }}
    >
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlans() {
  const ctx = useContext(MealPlanContext);
  if (!ctx)
    throw new Error("useMealPlans must be used inside MealPlanProvider");
  return ctx;
}
