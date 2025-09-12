// Path: src/context/MealPlanContext.tsx
// Context for managing authenticated user's meal plans and daily meals

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { MealPlan, MealPlanEntry } from "@/types/mealPlan";
import type { CreateMealPlanPayload } from "@/types/mealPlan";

// Context type for authenticated users
interface MealPlanContextType {
  mealPlans: MealPlan[]; // All meal plans for the user
  currentMealPlan: MealPlan | null; // Currently active meal plan
  todayMeals: MealPlanEntry[]; // Meals scheduled for today
  addMeal: (meal: MealPlanEntry) => void; // Add a meal to current plan & todayMeals
  createMealPlan: (payload: CreateMealPlanPayload) => Promise<void>; // Create a new meal plan
}

// Create context with optional default
const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

// Hook to consume MealPlanContext safely
export const useMealPlan = () => {
  const context = useContext(MealPlanContext);
  if (!context)
    throw new Error("useMealPlan must be used within a MealPlanProvider");
  return context;
};

// Provider component
export const MealPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // All meal plans for authenticated user
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  // Currently active meal plan (e.g., this week)
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  // Meals scheduled for today
  const [todayMeals, setTodayMeals] = useState<MealPlanEntry[]>([]);

  /**
   * Add a meal to current meal plan
   * Updates currentMealPlan entries, mealPlans array, and todayMeals
   */
  const addMeal = (meal: MealPlanEntry) => {
    setMealPlans((prevPlans) => {
      if (!currentMealPlan) return prevPlans;

      // Update the relevant meal plan in the mealPlans array
      const updatedPlans = prevPlans.map((plan) =>
        plan._id === currentMealPlan._id
          ? { ...plan, entries: [...plan.entries, meal] }
          : plan
      );

      // Update currentMealPlan state
      setCurrentMealPlan((prev) =>
        prev ? { ...prev, entries: [...prev.entries, meal] } : null
      );

      // Update today's meals
      setTodayMeals((prev) => [...prev, meal]);

      return updatedPlans;
    });
  };

  /**
   * Create a new meal plan
   * Simulates API call and updates context state
   */
  const createMealPlan = async (payload: CreateMealPlanPayload) => {
    const newPlan: MealPlan = {
      _id: `plan-${Date.now()}`,
      userId: "current-user",
      title: payload.title,
      startDate: payload.startDate,
      endDate: payload.endDate,
      entries: payload.entries || [],
    };

    // Add new plan to the array of meal plans
    setMealPlans((prev) => [...prev, newPlan]);
    // Set as current active plan
    setCurrentMealPlan(newPlan);

    // Update today's meals based on new plan
    const todayISO = new Date().toISOString().split("T")[0];
    setTodayMeals(newPlan.entries.filter((e) => e.date === todayISO));
  };

  return (
    <MealPlanContext.Provider
      value={{
        mealPlans,
        currentMealPlan,
        todayMeals,
        addMeal,
        createMealPlan,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
};
