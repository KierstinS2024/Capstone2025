// ===========================================
// PATH: src/context/MealPlanContext.tsx
// MealPlanContext: handles fetching, creating, updating, and moving meals
// ===========================================
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MealPlan, MealType, DayMeals } from "@/types";
import { useAuth } from "./AuthContext";
import * as api from "@/lib/mealPlanApi";

// ============================================================
// Context Type Definition
// ============================================================
interface MealPlanContextProps {
  activePlan: MealPlan | null;
  loading: boolean;
  saving: boolean;
  fetchActivePlan: () => Promise<void>;
  createMealPlan: (startDate: string, endDate?: string) => Promise<void>;
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

// Create the context
const MealPlanContext = createContext<MealPlanContextProps | undefined>(
  undefined
);

// ============================================================
// Helper: convert a YYYY-MM-DD local string to an ISO string
// at **local midnight**, avoiding timezone shifts.
// ============================================================
const localDateStringToISO = (localStr: string): string => {
  // e.g. "2025-10-02" → Date("2025-10-02T00:00:00" in local time)
  const d = new Date(`${localStr}T00:00:00`);
  return d.toISOString();
};

export const MealPlanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [activePlan, setActivePlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ============================================================
  // Fetch the currently active meal plan for the logged-in user
  // ============================================================
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

  // ============================================================
  // Create a new meal plan
  // - Accepts plain "YYYY-MM-DD" strings from the UI
  // - Converts to ISO dates at local midnight for DB
  // - Defaults to a 7-day plan if no end date provided
  // ============================================================
  const createMealPlan = async (startDate: string, endDate?: string) => {
    if (!user?.email) return;
    setSaving(true);

    try {
      // Normalize start → ISO string
      const startISO = localDateStringToISO(startDate);

      // Normalize or calculate end → ISO string
      let endISO: string;
      if (endDate && endDate.trim()) {
        endISO = localDateStringToISO(endDate);
      } else {
        const temp = new Date(`${startDate}T00:00:00`);
        temp.setDate(temp.getDate() + 6);
        endISO = temp.toISOString();
      }

      // Safety check: prevent accidental reversed dates
      if (new Date(endISO) < new Date(startISO)) {
        throw new Error("End date cannot be before start date.");
      }

      // Call API with normalized dates
      const newPlan = await api.createMealPlan(
        user.email,
        {},
        startISO,
        endISO
      );

      setActivePlan(newPlan);
    } catch (err) {
      console.error("Failed to create meal plan:", err);
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // Add a recipe to a given day/meal type
  // (PATCH the entire meals object)
  // ============================================================
  const addMealToPlan = async (
    date: string,
    mealType: MealType,
    recipeId: string
  ) => {
    if (!activePlan || !user?.email) return;
    setSaving(true);
    try {
      const updatedMeals = { ...activePlan.meals };
      if (!updatedMeals[date]) {
        updatedMeals[date] = { breakfast: "", lunch: "", dinner: "" };
      }
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

  // ============================================================
  // Delete a meal plan entirely
  // ============================================================
  const deleteMealPlan = async (id: string) => {
    if (!user?.email) return;
    setSaving(true);
    try {
      await api.deleteMealPlan(id, user.email);
      setActivePlan(null);
    } catch (err) {
      console.error("Failed to delete meal plan:", err);
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // Remove a recipe from a given day/meal type
  // ============================================================
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

  // ============================================================
  // Update the entire meals object for a plan (bulk save)
  // ============================================================
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

  // ============================================================
  // Move a recipe from one slot to another (drag & drop)
  // ============================================================
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
    if (!updatedMeals[destDay]) {
      updatedMeals[destDay] = { breakfast: "", lunch: "", dinner: "" };
    }
    updatedMeals[destDay][destMealType] = sourceRecipe;

    await updateMealPlan(activePlan.id, updatedMeals);
  };

  // ============================================================
  // Auto-fetch active plan on login
  // ============================================================
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

// Custom hook
export const useMealPlans = () => {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error("useMealPlans must be used within MealPlanProvider");
  }
  return context;
};
