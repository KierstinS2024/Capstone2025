// path: src/components/MealPlanCard.tsx
"use client";

import React from "react";
import MealCard from "./MealCard";
import { MealPlan } from "@/types/mealPlan";
import { useShoppingList } from "@/context/ShoppingListContext";

interface MealPlanCardProps {
  mealPlan: MealPlan;
  onOpenMealPlan?: (planId: string) => void;
}

export default function MealPlanCard({
  mealPlan,
  onOpenMealPlan,
}: MealPlanCardProps) {
  const { addItem } = useShoppingList();

  const today = new Date().toISOString().split("T")[0];
  const mealsToday = mealPlan.meals.filter((m) => m.date === today);

  const handleAddAllIngredients = () => {
    mealsToday.forEach((meal) => {
      if (meal.recipeId) {
        // fetch ingredients from recipe API or context
        // pseudo: addItem(name)
        // keep thin, we can wire actual integration later
      }
    });
  };

  return (
    <div
      className="mealplan-card"
      style={{
        padding: 16,
        borderRadius: 8,
        border: "1px solid #ccc",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>
          {mealPlan.startDate} → {mealPlan.endDate}
        </h3>
        <button onClick={handleAddAllIngredients}>Add Ingredients</button>
      </div>
      <div
        style={{ display: "flex", gap: 8, marginTop: 12, overflowX: "auto" }}
      >
        {["breakfast", "lunch", "dinner"].map((type) => {
          const meal = mealsToday.find((m) => m.type === type);
          return (
            <MealCard
              key={type}
              meal={
                meal || {
                  id: `${type}-empty`,
                  type: type as any,
                  date: today,
                  name: "",
                  source: undefined,
                }
              }
              onRemove={(id) => {}}
              onSwap={(id) => {}}
              onOpenRecipe={(recipeId) => {}}
            />
          );
        })}
      </div>
    </div>
  );
}
