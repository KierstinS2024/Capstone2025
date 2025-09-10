// Path: src/context/MealPlanContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { MealPlan } from "@/models/MealPlan";
import {
  fetchMealPlans,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from "@/lib/mealPlanApi";

type MealPlanContextType = {
  mealPlans: MealPlan[];
  addMealPlan: (plan: Omit<MealPlan, "_id">) => Promise<void>;
  editMealPlan: (id: string, plan: Partial<MealPlan>) => Promise<void>;
  removeMealPlan: (id: string) => Promise<void>;
};

const MealPlanContext = createContext<MealPlanContextType | undefined>(
  undefined
);

export const MealPlanProvider = ({ children }: { children: ReactNode }) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  useEffect(() => {
    fetchMealPlans().then(setMealPlans);
  }, []);

  const addMealPlan = async (plan: Omit<MealPlan, "_id">) => {
    const newPlan = await createMealPlan(plan);
    setMealPlans((prev) => [...prev, newPlan]);
  };

  const editMealPlan = async (id: string, plan: Partial<MealPlan>) => {
    const updated = await updateMealPlan(id, plan);
    setMealPlans((prev) => prev.map((p) => (p._id === id ? updated : p)));
  };

  const removeMealPlan = async (id: string) => {
    await deleteMealPlan(id);
    setMealPlans((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <MealPlanContext.Provider
      value={{ mealPlans, addMealPlan, editMealPlan, removeMealPlan }}
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
