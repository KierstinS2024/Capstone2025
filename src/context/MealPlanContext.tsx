// PATH: src/context/MealPlanContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  MealPlan,
  MealType,
  getMealPlans,
  getMealPlan,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from "@/lib/mealPlanApi";

interface MealPlanContextType {
  mealPlans: MealPlan[];
  loading: boolean;
  fetchMealPlans: () => Promise<void>;
  fetchMealPlan: (id: string) => Promise<MealPlan | null>;
  create: (data: Partial<MealPlan>) => Promise<MealPlan>;
  update: (id: string, data: Partial<MealPlan>) => Promise<MealPlan>;
  remove: (id: string) => Promise<void>;
  updateMeal: (
    planId: string,
    date: string,
    mealType: MealType,
    recipeId: string
  ) => Promise<void>;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(
  undefined
);

export function MealPlanProvider({ children }: { children: React.ReactNode }) {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMealPlans();
  }, []);

  async function fetchMealPlans() {
    setLoading(true);
    try {
      const plans = await getMealPlans();
      setMealPlans(plans);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMealPlan(id: string) {
    try {
      return await getMealPlan(id);
    } catch {
      return null;
    }
  }

  async function createPlan(data: Partial<MealPlan>) {
    const newPlan = await createMealPlan(data);
    await fetchMealPlans();
    return newPlan;
  }

  async function updatePlan(id: string, data: Partial<MealPlan>) {
    const updated = await updateMealPlan(id, data);
    await fetchMealPlans();
    return updated;
  }

  async function removePlan(id: string) {
    await deleteMealPlan(id);
    await fetchMealPlans();
  }

  // -----------------------------
  // Update a single meal
  async function updateMeal(
    planId: string,
    date: string,
    mealType: MealType,
    recipeId: string
  ) {
    const plan = mealPlans.find((p) => p.id === planId);
    if (!plan) throw new Error("Meal plan not found");

    const updatedMeals = {
      ...plan.meals,
      [date]: {
        ...plan.meals[date],
        [mealType]: recipeId,
      },
    };

    await updatePlan(planId, { meals: updatedMeals });
  }

  return (
    <MealPlanContext.Provider
      value={{
        mealPlans,
        loading,
        fetchMealPlans,
        fetchMealPlan,
        create: createPlan,
        update: updatePlan,
        remove: removePlan,
        updateMeal,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlans() {
  const ctx = useContext(MealPlanContext);
  if (!ctx)
    throw new Error("useMealPlans must be used within MealPlanProvider");
  return ctx;
}
