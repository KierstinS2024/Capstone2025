// src/components/TodayMealPlanCard.tsx
"use client";
import React from "react";
import MealCard from "./MealCard";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";

export default function TodayMealPlanCard() {
  const { mealPlans, addMeal, removeMeal } = useMealPlan();
  const { addItem } = useShoppingList();

  const today = new Date().toISOString().split("T")[0];
  const todayPlan = mealPlans.find((p) => p.date === today);

  const handleAddAllIngredients = () => {
    todayPlan?.meals.forEach((meal) => {
      meal.ingredients?.forEach((ing) => addItem(ing.name, "other"));
    });
  };

  return (
    <div className="today-plan-card">
      <div className="plan-header">
        <h3>Today’s Meals</h3>
        {todayPlan && todayPlan.meals.length > 0 && (
          <button className="add-all-button" onClick={handleAddAllIngredients}>
            Add All Ingredients
          </button>
        )}
      </div>
      <div className="meals-row">
        {["Breakfast", "Lunch", "Dinner"].map((type, i) => (
          <MealCard
            key={type}
            type={type as any}
            meal={todayPlan?.meals[i] || null}
            onRemove={(mealId) => removeMeal(mealId)}
            onOpen={(meal) => console.log("Open recipe", meal)}
          />
        ))}
      </div>
    </div>
  );
}
