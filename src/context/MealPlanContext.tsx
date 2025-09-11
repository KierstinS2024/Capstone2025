import React, { createContext, useContext, useState, useEffect } from "react";
import type { MealPlanEntry, MealPlan } from "@/types/mealPlan";
import { useRecipes } from "./RecipeContext";

interface MealPlanContextType {
  todayMeals: MealPlanEntry[];
  setTodayMeals: React.Dispatch<React.SetStateAction<MealPlanEntry[]>>;
}

const MealPlanContext = createContext<MealPlanContextType>({
  todayMeals: [],
  setTodayMeals: () => {},
});

export const useMealPlan = () => useContext(MealPlanContext);

export const MealPlanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { recipes } = useRecipes();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [todayMeals, setTodayMeals] = useState<MealPlanEntry[]>([]);

  // Fetch meal plan and enrich with recipe info
  useEffect(() => {
    if (!mealPlan) return;

    const mappedEntries = mealPlan.entries.map((entry) => {
      const recipe = recipes.find((r) => r._id === entry.recipeId);
      return {
        ...entry,
        recipeTitle: recipe?.title,
        recipeImage: recipe?.image,
      };
    });

    const today = new Date().toISOString().slice(0, 10);
    setTodayMeals(mappedEntries.filter((e) => e.date === today));
  }, [mealPlan, recipes]);

  return (
    <MealPlanContext.Provider value={{ todayMeals, setTodayMeals }}>
      {children}
    </MealPlanContext.Provider>
  );
};
