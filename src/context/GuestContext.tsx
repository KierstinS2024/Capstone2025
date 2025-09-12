// Path: src/context/GuestContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { MealPlanEntry, MealType } from "@/types/mealPlan";

/**
 * Context type for guest user meal plan
 */
interface GuestContextType {
  guestEntries: MealPlanEntry[];
  guestMealPlan: MealPlanEntry[];
  addMealToGuestPlan: (mealType: MealType, recipeId: string) => void;
  removeMealFromGuestPlan: (recipeId: string) => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

/**
 * Provider for guest user meal management
 */
export const GuestProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [guestEntries, setGuestEntries] = useState<MealPlanEntry[]>([]);

  // Today's date
  const today = new Date().toISOString().split("T")[0];

  /**
   * Filter guest meals for today
   */
  const guestMealPlan = guestEntries.filter((meal) =>
    meal.date.startsWith(today)
  );

  /**
   * Add a meal to guest's plan
   */
  const addMealToGuestPlan = (mealType: MealType, recipeId: string) => {
    const newMeal: MealPlanEntry = {
      date: new Date().toISOString(),
      mealType,
      recipeId,
      ingredients: [],
    };
    setGuestEntries((prev) => [...prev, newMeal]);
  };

  /**
   * Remove a meal from guest's plan by recipeId
   */
  const removeMealFromGuestPlan = (recipeId: string) => {
    setGuestEntries((prev) =>
      prev.filter((meal) => meal.recipeId !== recipeId)
    );
  };

  return (
    <GuestContext.Provider
      value={{
        guestEntries,
        guestMealPlan,
        addMealToGuestPlan,
        removeMealFromGuestPlan,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
};

/**
 * Hook to use guest context
 */
export const useGuest = (): GuestContextType => {
  const context = useContext(GuestContext);
  if (!context) throw new Error("useGuest must be used within GuestProvider");
  return context;
};
