// Path: src/context/GuestContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { guestRecipes } from "@/data/guestRecipes";
import type { Recipe } from "@/types/recipe";
import type { MealPlanEntry, MealType } from "@/types/mealPlan";

/**
 * GuestContextType
 * Provides preloaded recipes and temporary guest meal plan state
 */
interface GuestContextType {
  guestRecipes: Recipe[];
  guestMealPlan: MealPlanEntry[];
  addMealToGuestPlan: (mealType: MealType, recipeId: string) => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const GuestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [guestMealPlan, setGuestMealPlan] = useState<MealPlanEntry[]>([
    {
      date: new Date().toISOString(),
      mealType: "Breakfast",
      recipeId: "guest1",
      recipeTitle: "Oatmeal with Berries",
      recipeImage: "/guest/oatmeal-berries.jpg",
      ingredients: [],
    },
    {
      date: new Date().toISOString(),
      mealType: "Lunch",
      recipeId: "guest2",
      recipeTitle: "Greek Salad",
      recipeImage: "/guest/greek-salad.jpg",
      ingredients: [],
    },
    {
      date: new Date().toISOString(),
      mealType: "Dinner",
      recipeId: "guest3",
      recipeTitle: "Avocado Toast",
      recipeImage: "/guest/avocado-toast.jpg",
      ingredients: [],
    },
  ]);

  const addMealToGuestPlan = (mealType: MealType, recipeId: string) => {
    const recipe = guestRecipes.find((r) => r._id === recipeId);
    if (!recipe) return;

    setGuestMealPlan((prev) =>
      prev.map((meal) =>
        meal.mealType === mealType
          ? {
              ...meal,
              recipeId: recipe._id,
              recipeTitle: recipe.title,
              recipeImage: recipe.image,
            }
          : meal
      )
    );
  };

  return (
    <GuestContext.Provider
      value={{ guestRecipes, guestMealPlan, addMealToGuestPlan }}
    >
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) throw new Error("useGuest must be used within GuestProvider");
  return context;
};
