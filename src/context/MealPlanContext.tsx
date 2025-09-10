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
import { apiFetch } from "@/lib/api";

type MealPlanContextType = {
  mealPlans: MealPlan[];
  loading: boolean;
  fetchMealPlans: () => Promise<void>;
  createMealPlan: (plan: Partial<MealPlan>) => Promise<void>;
  deleteMealPlan: (id: string) => Promise<void>;
};

export const MealPlanContext = createContext<MealPlanContextType | undefined>(
  undefined
);

type ProviderProps = { children: ReactNode };

export const MealPlanProvider = ({ children }: ProviderProps) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMealPlans();
  }, []);

  /** Fetch all meal plans */
  const fetchMealPlans = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<MealPlan[]>("/meal-plans");
      setMealPlans(data);
    } finally {
      setLoading(false);
    }
  };

  /** Create a meal plan */
  const createMealPlan = async (plan: Partial<MealPlan>) => {
    await apiFetch("/meal-plans", {
      method: "POST",
      body: JSON.stringify(plan),
    });
    await fetchMealPlans();
  };

  /** Delete a meal plan */
  const deleteMealPlan = async (id: string) => {
    await apiFetch(`/meal-plans/${id}`, { method: "DELETE" });
    setMealPlans(mealPlans.filter((p) => p._id !== id));
  };

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

export const useMealPlans = () => {
  const context = useContext(MealPlanContext);
  if (!context)
    throw new Error("useMealPlans must be used within a MealPlanProvider");
  return context;
};
