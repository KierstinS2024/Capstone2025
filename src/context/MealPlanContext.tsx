// ===========================================
// PATH: src/context/MealPlanContext.tsx
// MealPlanContext: handles fetching, creating, updating, and moving meals
// ===========================================
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MealPlan, MealType, DayMeals } from "@/types/mealPlan";
import { useAuth } from "./AuthContext";
import * as api from "@/lib/mealPlanApi";

// -----------------------------
// Context Props: what the context exposes
// -----------------------------
interface MealPlanContextProps {
  activePlan: MealPlan | null; // currently active meal plan
  loading: boolean; // fetching active plan
  saving: boolean; // creating/updating/moving meals
  fetchActivePlan: () => Promise<void>;
  createMealPlan: (startDate: string, endDate: string) => Promise<void>;
  addMealToPlan: (
    date: string,
    mealType: MealType,
    recipeId: string
  ) => Promise<void>;
  removeMealFromPlan: (date: string, mealType: MealType) => Promise<void>;
  updateMealPlan: (
    id: string,
    meals: Record<string, DayMeals>
  ) => Promise<void>;
  moveMeal: (
    sourceDay: string,
    sourceMealType: MealType,
    destDay: string,
    destMealType: MealType
  ) => Promise<void>;
}

// -----------------------------
// Create context
// -----------------------------
const MealPlanContext = createContext<MealPlanContextProps | undefined>(
  undefined
);

// -----------------------------
// Provider component
// -----------------------------
export const MealPlanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  const [activePlan, setActivePlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true); // true to prevent flash
  const [saving, setSaving] = useState(false);

  // -----------------------------
  // Generate empty meals for a date range
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
  // Fetch active plan for user
  // Normalize empty objects to null
  // -----------------------------
  const fetchActivePlan = async () => {
    if (!user?.email) return;
    setLoading(true);

    try {
      const plan = await api.getUserMealPlan(user.email);
      // Only consider plan valid if it has an ID
      setActivePlan(plan && plan.id ? plan : null);
    } catch (err) {
      console.error("Failed to fetch active plan:", err);
      setActivePlan(null);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Create a new meal plan
  // -----------------------------
  const createMealPlan = async (startDate: string, endDate: string) => {
    if (!user?.email) return;
    setSaving(true);

    try {
      const existingPlan = await api.getUserMealPlan(user.email);
      if (existingPlan?.id) {
        throw new Error(
          "You already have a meal plan. Delete it before creating a new one."
        );
      }

      const meals = generateEmptyMeals(startDate, endDate);
      const newPlan = await api.createMealPlan(
        user.email,
        meals,
        startDate,
        endDate
      );
      setActivePlan(newPlan);
    } catch (err) {
      console.error("Failed to create meal plan:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // Add a recipe to a slot
  // -----------------------------
  const addMealToPlan = async (
    date: string,
    mealType: MealType,
    recipeId: string
  ) => {
    if (!activePlan || !user?.email) return;
    setSaving(true);

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
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // Remove a recipe from a slot
  // -----------------------------
  const removeMealFromPlan = async (date: string, mealType: MealType) => {
    if (!activePlan) return;
    setSaving(true);

    try {
      const updatedMeals = { ...activePlan.meals };
      if (!updatedMeals[date]) return;
      updatedMeals[date][mealType] = "";
      await updateMealPlan(activePlan.id, updatedMeals);
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // Update full meal plan
  // -----------------------------
  const updateMealPlan = async (
    id: string,
    meals: Record<string, DayMeals>
  ) => {
    if (!user?.email) return;
    setSaving(true);

    try {
      const updated = await api.updateMealPlan(id, meals, user.email);
      setActivePlan(updated);
    } catch (err) {
      console.error("Failed to update meal plan:", err);
    } finally {
      setSaving(false);
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
  // Fetch active plan when user changes
  // -----------------------------
  useEffect(() => {
    if (user?.email) fetchActivePlan();
  }, [user?.email]);

  return (
    <MealPlanContext.Provider
      value={{
        activePlan,
        loading,
        saving,
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
// Custom hook to access context
// -----------------------------
export const useMealPlans = () => {
  const context = useContext(MealPlanContext);
  if (!context)
    throw new Error("useMealPlans must be used within MealPlanProvider");
  return context;
};
