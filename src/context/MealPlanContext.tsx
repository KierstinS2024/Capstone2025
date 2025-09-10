// src/context/MealPlanContext.tsx
// React context for managing meal plans

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { MealPlan } from "@/types/mealPlan";
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
  loading: boolean;
  fetchMealPlans: () => Promise<void>;
  createMealPlan: (plan: Partial<MealPlan>) => Promise<void>;
  deleteMealPlan: (id: string) => Promise<void>;
};

// --------------------
// Context creation
// --------------------
export const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

type ProviderProps = { children: ReactNode };

// --------------------
// Provider component
// --------------------
export const MealPlanProvider = ({ children }: ProviderProps) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
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
  };

  // --------------------
  // Context value
  // --------------------
  const value: MealPlanContextType = {
    mealPlans,
    loading,
    fetchMealPlans,
    createMealPlan,
    deleteMealPlan,
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
export const useMealPlans = (): MealPlanContextType => {
  const context = useContext(MealPlanContext);
  if (!context)
    throw new Error("useMealPlans must be used within a MealPlanProvider");
  return context;
};
