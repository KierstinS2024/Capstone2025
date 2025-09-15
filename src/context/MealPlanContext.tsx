// src/context/MealPlanContext.tsx
"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  fetchMealPlans,
  createMealPlan,
  addMeal,
  removeMeal,
  deleteMealPlan,
} from "@/lib/mealPlanApi";
import { MealPlan, Meal } from "@/types/mealPlan";

interface MealPlanContextType {
  mealPlans: MealPlan[];
  loading: boolean;
  refreshPlans: () => void;
  createPlan: (startDate: string, endDate: string) => void;
  addMealToPlan: (planId: string, meal: Meal) => void;
  removeMealFromPlan: (planId: string, mealId: string) => void;
  deletePlan: (planId: string) => void;
}

const MealPlanContext = createContext<MealPlanContextType>(
  {} as MealPlanContextType
);

export const MealPlanProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshPlans = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const plans = await fetchMealPlans(user.id);
    setMealPlans(plans);
    setLoading(false);
  }, [user]);

  const createPlan = async (startDate: string, endDate: string) => {
    if (!user) return;
    const newPlan = await createMealPlan(user.id, startDate, endDate);
    setMealPlans((prev) => [...prev, newPlan]);
  };

  const addMealToPlan = async (planId: string, meal: Meal) => {
    if (!user) return;
    const updatedPlan = await addMeal(user.id, planId, meal);
    setMealPlans((prev) =>
      prev.map((p) => (p._id === planId ? updatedPlan : p))
    );
  };

  const removeMealFromPlan = async (planId: string, mealId: string) => {
    if (!user) return;
    const updatedPlan = await removeMeal(user.id, planId, mealId);
    setMealPlans((prev) =>
      prev.map((p) => (p._id === planId ? updatedPlan : p))
    );
  };

  const deletePlan = async (planId: string) => {
    if (!user) return;
    await deleteMealPlan(user.id, planId);
    setMealPlans((prev) => prev.filter((p) => p._id !== planId));
  };

  return (
    <MealPlanContext.Provider
      value={{
        mealPlans,
        loading,
        refreshPlans,
        createPlan,
        addMealToPlan,
        removeMealFromPlan,
        deletePlan,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
};

export const useMealPlan = () => useContext(MealPlanContext);
