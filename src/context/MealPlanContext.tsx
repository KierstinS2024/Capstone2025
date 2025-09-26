// ===========================================
// PATH: src/context/MealPlanContext.tsx
//
// React Context for Meal Plans
// - Tracks a single activePlan per user
// - Supports slot-level updates (breakfast/lunch/dinner)
// - Automatically syncs with backend
// - Uses plain JSON cloning to prevent Mongoose $__parent errors
// ===========================================

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
  hasPlan: boolean; // whether user has an active plan
  loading: boolean; // true while fetching data
  activePlan: MealPlan | null; // currently active meal plan
  setActivePlan: (plan: MealPlan | null) => void; // safely set plan

  fetchMealPlanForUser: () => Promise<void>; // fetch single plan for logged-in user
  fetchMealPlan: (id: string) => Promise<MealPlan | null>; // fetch plan by id
  createMealPlan: (data: Partial<MealPlan>) => Promise<MealPlan>; // create new plan
  updateMealPlan: (id: string, data: Partial<MealPlan>) => Promise<MealPlan>; // update full plan
  deleteMealPlan: (id: string) => Promise<void>; // delete plan
  updateMeal: (
    planId: string,
    day: string,
    mealType: MealType,
    recipeId: string | null
  ) => Promise<void>; // update single meal slot
}

// -------------------------------------------
// Create context
// -------------------------------------------
const MealPlanContext = createContext<MealPlanContextType | undefined>(
  undefined
);

// -------------------------------------------
// Provider component
// -------------------------------------------
export function MealPlanProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth(); // auth info
  const [activePlan, setActivePlanInternal] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const hasPlan = !!activePlan;

  // -------------------------------------------
  // Wrapper to deep-clone plan to prevent mutation issues
  // -------------------------------------------
  const setActivePlan = (plan: MealPlan | null) => {
    // Use structuredClone or null
    setActivePlanInternal(plan ? structuredClone(plan) : null);
  };

  // -------------------------------------------
  // Auto-fetch plan after login / clear on logout
  // -------------------------------------------
  useEffect(() => {
    if (authLoading) return;
    if (user?.id) {
      fetchMealPlanForUser();
    } else {
      setActivePlan(null);
      setLoading(false);
    }
  }, [user, authLoading]);

  // -------------------------------------------
  // Fetch user's single meal plan
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
  // Fetch plan by ID (rarely used)
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
  // Create new meal plan (only if none exists)
  // -------------------------------------------
  async function createMealPlan(data: Partial<MealPlan>): Promise<MealPlan> {
    if (!user?.id)
      throw new Error("Cannot create meal plan until user is loaded");
    if (activePlan)
      throw new Error("You already have a meal plan. Delete first.");
    if (!data.startDate || !data.endDate)
      throw new Error("startDate and endDate required");

    const newPlan = await apiCreateMealPlan(data);
    setActivePlan(newPlan);
    return newPlan;
  }

  // -------------------------------------------
  // Update entire meal plan (sync context)
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
  // Update a single meal slot (e.g. Tuesday lunch)
  // Safe: only sends meals object and avoids Mongoose $__parent errors
  // -------------------------------------------
  async function updateMeal(
    planId: string,
    day: string,
    mealType: MealType,
    recipeId: string | null
  ) {
    const plan = activePlan;
    if (!plan || plan.id !== planId) throw new Error("Meal plan not found");

    // -------------------------------
    // Deep clone meals as plain JSON
    // This avoids Mongoose internal keys like $__parent
    // -------------------------------
    const mealsCopy: Record<
      string,
      Record<MealType, string | null>
    > = JSON.parse(JSON.stringify(plan.meals || {}));

    // Initialize day if missing
    if (!mealsCopy[day])
      mealsCopy[day] = { breakfast: null, lunch: null, dinner: null };

    // Update the specific meal slot
    mealsCopy[day][mealType] = recipeId;

    // -------------------------------
    // Update backend with only meals object
    // -------------------------------
    await updateMealPlan(planId, { meals: mealsCopy });

    // -------------------------------
    // Update local context immediately for instant UI feedback
    // -------------------------------
    setActivePlan({ ...plan, meals: mealsCopy });
  }

  // -------------------------------------------
  // Provide context values
  // -------------------------------------------
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
// Hook for safe consumption
// -------------------------------------------
export function useMealPlans(): MealPlanContextType {
  const ctx = useContext(MealPlanContext);
  if (!ctx)
    throw new Error("useMealPlans must be used inside MealPlanProvider");
  return ctx;
}
