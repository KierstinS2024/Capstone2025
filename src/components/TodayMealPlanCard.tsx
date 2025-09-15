// src/components/TodayMealPlanCard.tsx
"use client";

import React from "react";
import MealCard from "./MealCard";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";

export default function TodayMealPlanCard() {
  const { mealPlans, removeMealFromPlan } = useMealPlan();
  const { addMultipleItems } = useShoppingList();

  const today = new Date().toISOString().split("T")[0];
  const todayPlan = mealPlans.find(
    (p) => p.startDate <= today && p.endDate >= today
  );

  const handleAddAllIngredients = () => {
    if (!todayPlan) return;
    const allIngredients = todayPlan.meals.flatMap(
      (meal) => meal.ingredients?.map((ing) => ing.name) || []
    );
    addMultipleItems(allIngredients);
  };

  return (
    <div className="today-mealplan-card">
      <div className="header">
        <h3>Today's Meals</h3>
        {todayPlan && todayPlan.meals.length > 0 && (
          <button onClick={handleAddAllIngredients}>Add All Ingredients</button>
        )}
      </div>
      <div className="meals-row">
        {["breakfast", "lunch", "dinner"].map((type) => {
          const meal = todayPlan?.meals.find((m) => m.type === type);
          return (
            <MealCard
              key={type}
              type={type as any}
              meal={meal || null}
              onRemove={(mealId) => removeMealFromPlan(mealId)}
            />
          );
        })}
      </div>
    </div>
  );
}
