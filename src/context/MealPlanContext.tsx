//src/context/MealPlanContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MealPlan, MealType, DayMeals } from "@/types/mealPlan";
import { useAuth } from "./AuthContext";
import * as api from "@/lib/mealPlanApi";

// -----------------------------
// Context Props — defines what the context exposes
// -----------------------------
interface MealPlanContextProps {
  activePlan: MealPlan | null; // current user's active meal plan
  loading: boolean; // indicates loading state
  fetchActivePlan: () => Promise<void>; // reload the user's meal plan
  createMealPlan: (startDate: string, endDate: string) => Promise<void>; // create a new meal plan
  addMealToPlan: (
    date: string,
    mealType: MealType,
    recipeId: string
  ) => Promise<void>; // add a recipe to a slot
  removeMealFromPlan: (date: string, mealType: MealType) => Promise<void>; // remove a recipe from a slot
  updateMealPlan: (
    id: string,
    meals: Record<string, DayMeals>
  ) => Promise<void>; // update the full plan
  moveMeal: (
    sourceDay: string,
    sourceMealType: MealType,
    destDay: string,
    destMealType: MealType
  ) => Promise<void>; // move a meal between slots
}

// -----------------------------
// Create the context
// -----------------------------
const MealPlanContext = createContext<MealPlanContextProps | undefined>(
  undefined
);

export const MealPlanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [activePlan, setActivePlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Generate empty meals object for any date range
  // -----------------------------
  const generateEmptyMeals = (
    start: string,
    end: string
  ): Record<string, DayMeals> => {
    const meals: Record<string, DayMeals> = {};
    const currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      meals[dateStr] = { breakfast: "", lunch: "", dinner: "" };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return meals;
  };

  // -----------------------------
  // Fetch the active meal plan for the user
  // -----------------------------
  const fetchActivePlan = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const plan = await api.getUserMealPlan(user.email);
      setActivePlan(plan || null); // explicitly null if no plan exists
    } catch (err) {
      console.error("Failed to fetch active meal plan:", err);
      setActivePlan(null);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Create a new meal plan
  // Only one plan per user is allowed
  // -----------------------------
  const createMealPlan = async (startDate: string, endDate: string) => {
    if (!user?.email) return;
    setLoading(true);

    try {
      // ✅ 0: Check database for existing plan
      const existingPlan = await api.getUserMealPlan(user.email);
      if (existingPlan && existingPlan.id) {
        throw new Error(
          "You already have a meal plan. Delete it before creating a new one."
        );
      }

      // ✅ 1: Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) throw new Error("End date cannot be before start date.");

      // ✅ 2: Generate empty meals object
      const meals = generateEmptyMeals(startDate, endDate);

      // ✅ 3: Call API to create the plan
      const newPlan = await api.createMealPlan(
        user.email,
        meals,
        startDate,
        endDate
      );

      // ✅ 4: Update state
      setActivePlan(newPlan);
    } catch (err: any) {
      console.error("Failed to create meal plan:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Add a meal to a slot
  // -----------------------------
  const addMealToPlan = async (
    date: string,
    mealType: MealType,
    recipeId: string
  ) => {
    if (!activePlan || !user?.email) return;

    try {
      await api.addMealToPlan(
        activePlan.id,
        date,
        mealType,
        recipeId,
        user.email
      );

      const updatedMeals = { ...activePlan.meals };
      if (!updatedMeals[date])
        updatedMeals[date] = { breakfast: "", lunch: "", dinner: "" };
      updatedMeals[date][mealType] = recipeId;

      setActivePlan({ ...activePlan, meals: updatedMeals });
    } catch (err) {
      console.error("Failed to add meal:", err);
    }
  };

  // -----------------------------
  // Remove a meal from a slot
  // -----------------------------
  const removeMealFromPlan = async (date: string, mealType: MealType) => {
    if (!activePlan) return;
    const updatedMeals = { ...activePlan.meals };
    if (!updatedMeals[date]) return;
    updatedMeals[date][mealType] = "";
    await updateMealPlan(activePlan.id, updatedMeals);
  };

  // -----------------------------
  // Update the full meal plan
  // -----------------------------
  const updateMealPlan = async (
    id: string,
    meals: Record<string, DayMeals>
  ) => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const updated = await api.updateMealPlan(id, meals, user.email);
      setActivePlan(updated);
    } catch (err) {
      console.error("Failed to update meal plan:", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Move a meal between slots
  // -----------------------------
  const moveMeal = async (
    sourceDay: string,
    sourceMealType: MealType,
    destDay: string,
    destMealType: MealType
  ) => {
    if (!activePlan) return;

    const sourceRecipe = activePlan.meals[sourceDay][sourceMealType];
    if (!sourceRecipe) return;

    const updatedMeals = { ...activePlan.meals };
    updatedMeals[sourceDay][sourceMealType] = "";
    updatedMeals[destDay][destMealType] = sourceRecipe;

    await updateMealPlan(activePlan.id, updatedMeals);
  };

  // -----------------------------
  // Fetch active plan on mount or when user changes
  // -----------------------------
  useEffect(() => {
    if (user?.email) fetchActivePlan();
  }, [user?.email]);

  // -----------------------------
  // Provide context to children
  // -----------------------------
  return (
    <MealPlanContext.Provider
      value={{
        activePlan,
        loading,
        fetchActivePlan,
        createMealPlan,
        addMealToPlan,
        removeMealFromPlan,
        updateMealPlan,
        moveMeal,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
};

// -----------------------------
// Custom hook to consume context
// -----------------------------
export const useMealPlans = () => {
  const context = useContext(MealPlanContext);
  if (!context)
    throw new Error("useMealPlans must be used within MealPlanProvider");
  return context;
};
