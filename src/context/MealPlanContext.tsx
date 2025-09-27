// ===========================================
// PATH: src/context/MealPlanContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { MealPlan, MealType } from "@/types/mealPlan";
import {
  getMealPlanForUser,
  getMealPlan,
  createMealPlan as apiCreateMealPlan,
  updateMealPlan as apiUpdateMealPlan,
  deleteMealPlan as apiDeleteMealPlan,
} from "@/lib/mealPlanApi";
import { useAuth } from "@/context/AuthContext";

// -------------------------------------------
// Context type definition
// -------------------------------------------
interface MealPlanContextType {
  hasPlan: boolean;
  loading: boolean;
  activePlan: MealPlan | null;
  setActivePlan: (plan: MealPlan | null) => void;
  fetchMealPlanForUser: () => Promise<void>;
  fetchMealPlan: (id: string) => Promise<MealPlan | null>;
  createMealPlan: (data: Partial<MealPlan>) => Promise<MealPlan>;
  updateMealPlan: (id: string, data: Partial<MealPlan>) => Promise<MealPlan>;
  deleteMealPlan: (id: string) => Promise<void>;
  updateMeal: (
    planId: string,
    day: string,
    mealType: MealType,
    recipeId: string | null
  ) => Promise<void>;
}

// -------------------------------------------
// Create context
// -------------------------------------------
const MealPlanContext = createContext<MealPlanContextType | undefined>(
  undefined
);

// -------------------------------------------
// Provider
// -------------------------------------------
export function MealPlanProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();

  const [activePlan, setActivePlanInternal] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const hasPlan = !!activePlan;

  // -------------------------------------------
  // Deep clone setter to prevent Mongoose $__parent issues
  // -------------------------------------------
  const setActivePlan = (plan: MealPlan | null) => {
    setActivePlanInternal(plan ? structuredClone(plan) : null);
  };

  // -------------------------------------------
  // Auto-fetch plan on login; clear on logout
  // -------------------------------------------
  useEffect(() => {
    if (authLoading) return;
    if (user?.id) fetchMealPlanForUser();
    else {
      setActivePlan(null);
      setLoading(false);
    }
  }, [user, authLoading]);

  // -------------------------------------------
  // Fetch current user's plan
  // -------------------------------------------
  async function fetchMealPlanForUser() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const plan = await getMealPlanForUser();
      setActivePlan(plan || null);
    } catch (err) {
      console.error("Failed to fetch meal plan:", err);
      setActivePlan(null);
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------
  // Fetch any plan by ID (rare)
  // -------------------------------------------
  async function fetchMealPlan(id: string): Promise<MealPlan | null> {
    try {
      const plan = await getMealPlan(id);
      return plan ?? null;
    } catch (err) {
      console.error(`Failed to fetch meal plan ${id}:`, err);
      return null;
    }
  }

  // -------------------------------------------
  // Create new plan
  // -------------------------------------------
  async function createMealPlan(data: Partial<MealPlan>): Promise<MealPlan> {
    if (!user?.id)
      throw new Error("Cannot create meal plan until user is loaded");

    if (loading) throw new Error("Please wait until the current plan loads");

    if (activePlan)
      throw new Error("You already have a meal plan. Delete it first");

    if (!data.startDate || !data.endDate)
      throw new Error("startDate and endDate are required");

    setLoading(true);
    try {
      const newPlan = await apiCreateMealPlan(data);
      setActivePlan(newPlan);
      return newPlan;
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------
  // Update entire plan
  // -------------------------------------------
  async function updateMealPlan(
    id: string,
    data: Partial<MealPlan>
  ): Promise<MealPlan> {
    const updatedPlan = await apiUpdateMealPlan(id, data);
    setActivePlan(updatedPlan);
    return updatedPlan;
  }

  // -------------------------------------------
  // Delete plan
  // -------------------------------------------
  async function deleteMealPlan(id: string): Promise<void> {
    await apiDeleteMealPlan(id);
    setActivePlan(null);
  }

  // -------------------------------------------
  // Update single meal slot safely
  // -------------------------------------------
  async function updateMeal(
    planId: string,
    day: string,
    mealType: MealType,
    recipeId: string | null
  ) {
    // Ensure we have the active plan
    const plan = activePlan;
    if (!plan || plan.id !== planId) throw new Error("Meal plan not found");

    // -----------------------------
    // Step 1: Deep clone the meals to strip Mongoose internals
    // Step 2: Ensure all days have breakfast/lunch/dinner keys
    // -----------------------------
    const mealsCopy: Record<
      string,
      { breakfast: string | null; lunch: string | null; dinner: string | null }
    > = JSON.parse(JSON.stringify(plan.meals || {}));

    if (!mealsCopy[day])
      mealsCopy[day] = { breakfast: null, lunch: null, dinner: null };

    mealsCopy[day][mealType] = recipeId;

    // -----------------------------
    // Step 3: Send normalized meals to backend
    // -----------------------------
    const updatedPlan = await updateMealPlan(planId, { meals: mealsCopy });

    // -----------------------------
    // Step 4: Update local state
    // -----------------------------
    setActivePlan(updatedPlan);
  }

  return (
    <MealPlanContext.Provider
      value={{
        hasPlan,
        loading,
        activePlan,
        setActivePlan,
        fetchMealPlanForUser,
        fetchMealPlan,
        createMealPlan,
        updateMealPlan,
        deleteMealPlan,
        updateMeal,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
}

// -------------------------------------------
// Custom hook
// -------------------------------------------
export function useMealPlans(): MealPlanContextType {
  const ctx = useContext(MealPlanContext);
  if (!ctx)
    throw new Error("useMealPlans must be used inside MealPlanProvider");
  return ctx;
}
