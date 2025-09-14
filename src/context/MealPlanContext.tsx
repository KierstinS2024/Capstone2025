"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { MealPlan, Meal } from "@/types/mealPlan";
import { fetchMealPlans, addMeal, removeMeal } from "@/lib/mealPlanApi";
import { useAuth } from "./AuthContext";

interface MealPlanContextValue {
  mealPlans: MealPlan[];
  loading: boolean;
  addMealToPlan: (meal: Meal, date: string) => Promise<void>;
  removeMealFromPlan: (mealId: string) => Promise<void>;
  refreshPlans: () => Promise<void>;
  getAllMealNames: () => string[];
}

const MealPlanContext = createContext<MealPlanContextValue | undefined>(
  undefined
);

export const MealPlanProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshPlans = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const plans = await fetchMealPlans();
      setMealPlans(plans);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshPlans();
  }, [refreshPlans]);

  const addMealToPlan = useCallback(async (meal: Meal, date: string) => {
    const newPlan = await addMeal(meal, date);
    setMealPlans((prev) => [
      ...prev.filter((p) => p._id !== newPlan._id),
      newPlan,
    ]);
  }, []);

  const removeMealFromPlan = useCallback(async (mealId: string) => {
    const updated = await removeMeal(mealId);
    setMealPlans((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );
  }, []);

  const getAllMealNames = useCallback(() => {
    return mealPlans.flatMap((plan) => plan.meals.map((meal) => meal.name));
  }, [mealPlans]);

  return (
    <MealPlanContext.Provider
      value={{
        mealPlans,
        loading,
        addMealToPlan,
        removeMealFromPlan,
        refreshPlans,
        getAllMealNames,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
};

export function useMealPlan() {
  const ctx = useContext(MealPlanContext);
  if (!ctx) throw new Error("useMealPlan must be used inside MealPlanProvider");
  return ctx;
}
