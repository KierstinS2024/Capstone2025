// ===========================================
// PATH: src/context/MealPlanContext.tsx
// Context to manage Meal Plans and provide CRUD + updateMeal functionality
// ===========================================

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { MealPlan, MealType } from "@/types/mealPlan";
import {
  getMealPlans,
  getMealPlan,
  createMealPlan as apiCreateMealPlan,
  updateMealPlan as apiUpdateMealPlan,
  deleteMealPlan as apiDeleteMealPlan,
} from "@/lib/mealPlanApi";
import { useRecipes } from "./RecipeContext";

// -----------------------------
// Define context type
// -----------------------------
interface MealPlanContextType {
  mealPlans: MealPlan[];
  loading: boolean;
  activePlan: MealPlan | null;
  setActivePlan: (plan: MealPlan | null) => void;
  fetchMealPlans: () => Promise<void>;
  fetchMealPlan: (id: string) => Promise<MealPlan | null>;
  createMealPlan: (data: Partial<MealPlan>) => Promise<MealPlan>;
  updateMealPlan: (id: string, data: Partial<MealPlan>) => Promise<MealPlan>;
  deleteMealPlan: (id: string) => Promise<void>;

  // Update a single meal slot (breakfast/lunch/dinner) for a day
  updateMeal: (
    planId: string,
    day: string,
    mealType: MealType,
    recipeId: string | null
  ) => Promise<void>;
}

// -----------------------------
// Create context
// -----------------------------
const MealPlanContext = createContext<MealPlanContextType | undefined>(
  undefined
);

// -----------------------------
// Provider component
// -----------------------------
export function MealPlanProvider({ children }: { children: React.ReactNode }) {
  const { unlinkTemporaryRecipe } = useRecipes();

  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlanInternal] = useState<MealPlan | null>(null);

  const setActivePlan = (plan: MealPlan | null) => {
    setActivePlanInternal(plan ? structuredClone(plan) : null);
  };

  // Load meal plans on mount
  useEffect(() => {
    if (mealPlans.length === 0) fetchMealPlans();
  }, []);

  // -----------------------------
  // Fetch all meal plans
  // -----------------------------
  async function fetchMealPlans() {
    setLoading(true);
    try {
      const plans = await getMealPlans();
      setMealPlans(plans);
      if (plans.length > 0 && !activePlan) setActivePlan(plans[0]);
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // Fetch a single meal plan by ID
  // -----------------------------
  async function fetchMealPlan(id: string) {
    try {
      const plan = await getMealPlan(id);
      return plan ?? null;
    } catch {
      return null;
    }
  }

  // -----------------------------
  // Helper: check for overlapping date ranges
  // -----------------------------
  function hasOverlap(start: string, end: string, excludeId?: string) {
    const newStart = new Date(start);
    const newEnd = new Date(end);

    return mealPlans.some((plan) => {
      if (excludeId && plan.id === excludeId) return false;
      const existingStart = new Date(plan.startDate);
      const existingEnd = new Date(plan.endDate);
      return newStart <= existingEnd && newEnd >= existingStart;
    });
  }

  // -----------------------------
  // Create a new meal plan
  // -----------------------------
  async function createMealPlan(data: Partial<MealPlan>) {
    if (!data.startDate || !data.endDate) {
      throw new Error("Meal plan requires startDate and endDate");
    }

    if (hasOverlap(data.startDate, data.endDate)) {
      throw new Error("New plan overlaps with an existing plan");
    }

    const newPlan = await apiCreateMealPlan(data);
    await fetchMealPlans();
    setActivePlan(newPlan);
    return newPlan;
  }

  // -----------------------------
  // Update an existing meal plan
  // -----------------------------
  async function updateMealPlan(id: string, data: Partial<MealPlan>) {
    if (
      data.startDate &&
      data.endDate &&
      hasOverlap(data.startDate, data.endDate, id)
    ) {
      throw new Error("Updated date range overlaps with another plan");
    }

    const updated = await apiUpdateMealPlan(id, data);

    setMealPlans((prev) => prev.map((p) => (p.id === id ? updated : p)));
    if (activePlan?.id === id) setActivePlan(updated);

    return updated;
  }

  // -----------------------------
  // Delete a meal plan
  // -----------------------------
  async function deleteMealPlan(id: string) {
    await apiDeleteMealPlan(id);
    setMealPlans((prev) => prev.filter((p) => p.id !== id));

    if (activePlan?.id === id) {
      setActivePlan(mealPlans[0] || null);
    }
  }

  // -----------------------------
  // Update a single meal slot (breakfast/lunch/dinner) for a day
  // Returns void for type safety
  // -----------------------------
  async function updateMeal(
    planId: string,
    day: string,
    mealType: MealType,
    recipeId: string | null
  ): Promise<void> {
    const plan = mealPlans.find((p) => p.id === planId);
    if (!plan) throw new Error("Meal plan not found");

    const updatedPlan = structuredClone(plan);

    if (!updatedPlan.meals[day]) updatedPlan.meals[day] = {};
    updatedPlan.meals[day][mealType] = recipeId;

    // Persist to backend
    await updateMealPlan(planId, { meals: updatedPlan.meals });

    // Update local state
    setMealPlans((prev) =>
      prev.map((p) => (p.id === planId ? updatedPlan : p))
    );
    if (activePlan?.id === planId) setActivePlan(updatedPlan);

    // Optionally unlink temporary recipe if removed
    if (
      recipeId === null &&
      plan.meals[day]?.[mealType] &&
      plan.meals[day][mealType]?.startsWith("tmp_")
    ) {
      try {
        await unlinkTemporaryRecipe(plan.meals[day][mealType]!);
      } catch (err) {
        console.error("Failed to unlink temporary recipe:", err);
      }
    }
  }

  // -----------------------------
  // Provide context value
  // -----------------------------
  return (
    <MealPlanContext.Provider
      value={{
        mealPlans,
        loading,
        activePlan,
        setActivePlan,
        fetchMealPlans,
        fetchMealPlan,
        createMealPlan,
        updateMealPlan,
        deleteMealPlan,
        updateMeal, // added
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
}

// -----------------------------
// Hook to consume context
// -----------------------------
export function useMealPlans() {
  const ctx = useContext(MealPlanContext);
  if (!ctx)
    throw new Error("useMealPlans must be used within MealPlanProvider");
  return ctx;
}
