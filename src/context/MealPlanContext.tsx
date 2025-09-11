// Path: src/context/MealPlanContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import type {
  MealPlan,
  MealPlanEntry,
  CreateMealPlanPayload,
} from "@/types/mealPlan";

interface MealPlanContextType {
  currentMealPlan: MealPlan | null;
  todayMeals: MealPlanEntry[];
  addMeal: (meal: MealPlanEntry) => void;
  createMealPlan: (payload: CreateMealPlanPayload) => Promise<void>;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(
  undefined
);

export const useMealPlan = () => {
  const ctx = useContext(MealPlanContext);
  if (!ctx) throw new Error("useMealPlan must be used within MealPlanProvider");
  return ctx;
};

export const MealPlanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [todayMeals, setTodayMeals] = useState<MealPlanEntry[]>([]);

  const addMeal = (meal: MealPlanEntry) =>
    setTodayMeals((prev) => [...prev, meal]);

  const createMealPlan = async (payload: CreateMealPlanPayload) => {
    // Here you would call API to persist meal plan
    const newPlan: MealPlan = {
      _id: "temp-id",
      userId: "user-id",
      ...payload,
      entries: payload.entries || [],
    };
    setCurrentMealPlan(newPlan);
    setTodayMeals(payload.entries || []);
  };

  return (
    <MealPlanContext.Provider
      value={{ currentMealPlan, todayMeals, addMeal, createMealPlan }}
    >
      {children}
    </MealPlanContext.Provider>
  );
};
