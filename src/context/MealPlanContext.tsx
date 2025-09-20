// ===========================================
// PATH: src/context/MealPlanContext.tsx
// React Context Provider for Meal Plans
// Optimized to fetch meal plans once and manage activePlan safely
// ===========================================
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { MealPlan, MealType } from "@/types/mealPlan";
import {
  getMealPlans,
  getMealPlan,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from "@/lib/mealPlanApi";
import { useRecipes } from "./RecipeContext";

// -----------------------------
// Context shape
// -----------------------------
interface MealPlanContextType {
  mealPlans: MealPlan[];
  loading: boolean;
  activePlan: MealPlan | null;
  setActivePlan: (plan: MealPlan | null) => void;
  fetchMealPlans: () => Promise<void>;
  fetchMealPlan: (id: string) => Promise<MealPlan | null>;
  create: (data: Partial<MealPlan>) => Promise<MealPlan>;
  update: (id: string, data: Partial<MealPlan>) => Promise<MealPlan>;
  remove: (id: string) => Promise<void>;
  updateMeal: (
    planId: string,
    date: string,
    mealType: MealType,
    recipeId: string | null
  ) => Promise<void>;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(
  undefined
);

// -----------------------------
// Provider implementation
// -----------------------------
export function MealPlanProvider({ children }: { children: React.ReactNode }) {
  const { unlinkTemporaryRecipe, recipes } = useRecipes();

  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Store a deep clone of activePlan to prevent accidental mutation
  const [activePlan, setActivePlanInternal] = useState<MealPlan | null>(null);

  // Wrapper ensures new objects are cloned when setting activePlan
  const setActivePlan = (plan: MealPlan | null) => {
    setActivePlanInternal(plan ? structuredClone(plan) : null);
  };

  // -----------------------------
  // Fetch all meal plans once on provider mount
  // -----------------------------
  useEffect(() => {
    if (mealPlans.length === 0) fetchMealPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // Fetch all meal plans from backend
  // -----------------------------
  async function fetchMealPlans() {
    setLoading(true);
    try {
      const plans = await getMealPlans();
      setMealPlans(plans);

      // Auto-select first plan if none is active
      if (plans.length > 0 && !activePlan) setActivePlan(plans[0]);
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // Fetch a single meal plan by id
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
  // Create a new meal plan
  // -----------------------------
  async function createPlan(data: Partial<MealPlan>) {
    const newPlan = await createMealPlan(data);
    await fetchMealPlans(); // refresh list
    return newPlan;
  }

  // -----------------------------
  // Update an existing meal plan
  // -----------------------------
  async function updatePlan(id: string, data: Partial<MealPlan>) {
    const updated = await updateMealPlan(id, data);
    await fetchMealPlans(); // refresh list
    return updated;
  }

  // -----------------------------
  // Delete a meal plan
  // -----------------------------
  async function removePlan(id: string) {
    await deleteMealPlan(id);
    await fetchMealPlans(); // refresh list
  }

  // -----------------------------
  // Update a single meal slot
  // Handles unlinking temporary recipes if needed
  // -----------------------------
  async function updateMeal(
    planId: string,
    date: string,
    mealType: MealType,
    recipeId: string | null
  ) {
    const plan = mealPlans.find((p) => p.id === planId);
    if (!plan) throw new Error("Meal plan not found");

    // If removing a recipe, unlink temporary one if applicable
    if (!recipeId) {
      const oldRecipeId = plan.meals?.[date]?.[mealType];
      if (oldRecipeId) {
        const oldRecipe = recipes.find((r) => r.id === oldRecipeId);
        if (oldRecipe?.temporary) {
          await unlinkTemporaryRecipe(oldRecipeId);
        }
      }
    }

    const updatedMeals = {
      ...plan.meals,
      [date]: {
        ...plan.meals[date],
        [mealType]: recipeId,
      },
    };

    await updatePlan(planId, { meals: updatedMeals });
  }

  // -----------------------------
  // Provide context values
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

// -----------------------------
// Hook for consuming context
// -----------------------------
export function useMealPlans() {
  const ctx = useContext(MealPlanContext);
  if (!ctx)
    throw new Error("useMealPlans must be used within MealPlanProvider");
  return ctx;
}
