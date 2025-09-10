// src/context/MealPlanContext.tsx
// React context for managing meal plans
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { MealPlan, MealPlanEntry } from "@/types/mealPlan";
import {
  fetchMealPlansAPI,
  createMealPlanAPI,
  deleteMealPlanAPI,
} from "@/lib/mealPlanApi";

// --------------------
// Types
// --------------------
type MealPlanContextType = {
  mealPlans: MealPlan[];
  currentMealPlan: MealPlan | null;
  loading: boolean;
  fetchMealPlans: () => Promise<void>;
  createMealPlan: (plan: Partial<MealPlan>) => Promise<void>;
  deleteMealPlan: (id: string) => Promise<void>;
  setCurrentMealPlan: (plan: MealPlan | null) => void;
};

// --------------------
// Context creation
// --------------------
export const MealPlanContext = createContext<MealPlanContextType | undefined>(
  undefined
);

type ProviderProps = { children: ReactNode };

// --------------------
// Provider component
// --------------------
export const MealPlanProvider = ({ children }: ProviderProps) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch meal plans on mount
  useEffect(() => {
    fetchMealPlans();
  }, []);

  // --------------------
  // Context actions
  // --------------------

  /** Fetch all meal plans and update state */
  const fetchMealPlans = async () => {
    setLoading(true);
    try {
      const data = await fetchMealPlansAPI();
      setMealPlans(data);
      // Optionally set first plan as current if none selected
      if (!currentMealPlan && data.length > 0) setCurrentMealPlan(data[0]);
    } finally {
      setLoading(false);
    }
  };

  /** Create a new meal plan and refresh list */
  const createMealPlan = async (plan: Partial<MealPlan>) => {
    await createMealPlanAPI(plan);
    await fetchMealPlans();
  };

  /** Delete a meal plan by ID */
  const deleteMealPlan = async (id: string) => {
    await deleteMealPlanAPI(id);
    setMealPlans((prev) => prev.filter((p) => p._id !== id));
    // Reset current plan if it was deleted
    if (currentMealPlan?._id === id) setCurrentMealPlan(null);
  };

  // --------------------
  // Context value
  // --------------------
  const value: MealPlanContextType = {
    mealPlans,
    currentMealPlan,
    loading,
    fetchMealPlans,
    createMealPlan,
    deleteMealPlan,
    setCurrentMealPlan,
  };

  return (
    <MealPlanContext.Provider value={value}>
      {children}
    </MealPlanContext.Provider>
  );
};

// --------------------
// Hook for consuming MealPlanContext safely
// --------------------
export const useMealPlan = (): MealPlanContextType => {
  const context = useContext(MealPlanContext);
  if (!context)
    throw new Error("useMealPlan must be used within MealPlanProvider");
  return context;
};
