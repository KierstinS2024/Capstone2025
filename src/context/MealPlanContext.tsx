// ===========================================
// PATH: src/context/MealPlanContext.tsx
// MealPlanContext: handles fetching, creating, updating, and moving meals
// ===========================================
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MealPlan, MealType, DayMeals } from "@/types";
import { useAuth } from "./AuthContext";
import * as api from "@/lib/mealPlanApi";

interface MealPlanContextProps {
  activePlan: MealPlan | null;
  loading: boolean;
  saving: boolean;
  fetchActivePlan: () => Promise<void>;
  createMealPlan: (startDate: string, endDate: string) => Promise<void>;
  addMealToPlan: (
    date: string,
    mealType: MealType,
    recipeId: string
  ) => Promise<void>;
  removeMealFromPlan: (date: string, mealType: MealType) => Promise<void>;
  deleteMealPlan: (id: string) => Promise<void>;

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

const MealPlanContext = createContext<MealPlanContextProps | undefined>(
  undefined
);

export const MealPlanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [activePlan, setActivePlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch active plan
  const fetchActivePlan = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const plan = await api.getUserMealPlan(user.email);
      setActivePlan(plan && plan.id ? plan : null);
    } catch (err) {
      console.error("Failed to fetch active plan:", err);
      setActivePlan(null);
    } finally {
      setLoading(false);
    }
  };

  // Create new plan
  const createMealPlan = async (startDate: string, endDate?: string) => {
    if (!user?.email) return;
    setSaving(true);

    try {
      // If no endDate, default to a 7-day plan
      const finalEndDate =
        endDate && endDate.trim()
          ? endDate
          : new Date(
              new Date(startDate).setDate(new Date(startDate).getDate() + 6)
            )
              .toISOString()
              .split("T")[0];

      // Safety check: ensure finalEndDate is not before startDate
      if (new Date(finalEndDate) < new Date(startDate)) {
        throw new Error("End date cannot be before start date.");
      }

      const newPlan = await api.createMealPlan(
        user.email,
        {},
        startDate,
        finalEndDate
      );

      setActivePlan(newPlan);
    } catch (err) {
      console.error("Failed to create meal plan:", err);
    } finally {
      setSaving(false);
    }
  };

  // Add meal (patch entire plan)
  const addMealToPlan = async (
    date: string,
    mealType: MealType,
    recipeId: string
  ) => {
    if (!activePlan || !user?.email) return;
    setSaving(true);
    try {
      const updatedMeals = { ...activePlan.meals };
      if (!updatedMeals[date])
        updatedMeals[date] = { breakfast: "", lunch: "", dinner: "" };
      updatedMeals[date][mealType] = recipeId;

      const updated = await api.updateMealPlan(
        activePlan.id,
        updatedMeals,
        user.email
      );
      setActivePlan(updated);
    } catch (err) {
      console.error("Failed to add meal:", err);
    } finally {
      setSaving(false);
    }
  };

  //delete a meal plan:
  const deleteMealPlan = async (id: string) => {
    if (!user?.email) return;
    setSaving(true);
    try {
      await api.deleteMealPlan(id, user.email);
      setActivePlan(null); // clear it from state after deletion
    } catch (err) {
      console.error("Failed to delete meal plan:", err);
    } finally {
      setSaving(false);
    }
  };

  // Remove meal (patch entire plan)
  const removeMealFromPlan = async (date: string, mealType: MealType) => {
    if (!activePlan || !user?.email) return;
    setSaving(true);
    try {
      const updatedMeals = { ...activePlan.meals };
      if (updatedMeals[date]) {
        updatedMeals[date][mealType] = "";
        const updated = await api.updateMealPlan(
          activePlan.id,
          updatedMeals,
          user.email
        );
        setActivePlan(updated);
      }
    } catch (err) {
      console.error("Failed to remove meal:", err);
    } finally {
      setSaving(false);
    }
  };

  // Update full plan
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

  // Move meal
  const moveMeal = async (
    sourceDay: string,
    sourceMealType: MealType,
    destDay: string,
    destMealType: MealType
  ) => {
    if (!activePlan || !user?.email) return;
    const sourceRecipe = activePlan.meals[sourceDay]?.[sourceMealType];
    if (!sourceRecipe) return;

    const updatedMeals = { ...activePlan.meals };
    updatedMeals[sourceDay][sourceMealType] = "";
    if (!updatedMeals[destDay])
      updatedMeals[destDay] = { breakfast: "", lunch: "", dinner: "" };
    updatedMeals[destDay][destMealType] = sourceRecipe;

    await updateMealPlan(activePlan.id, updatedMeals);
  };

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
        deleteMealPlan,
        updateMealPlan,
        moveMeal,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
};

export const useMealPlans = () => {
  const context = useContext(MealPlanContext);
  if (!context)
    throw new Error("useMealPlans must be used within MealPlanProvider");
  return context;
};
