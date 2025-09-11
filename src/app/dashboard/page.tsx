// Path: src/app/dashboard/page.tsx
"use client";

import React from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";
import MealPlanCard from "@/components/MealPlanCard";
import type { MealPlanEntry } from "@/types/mealPlan";

/**
 * Dashboard
 * Shows the current user's meal plan with full recipes.
 */
const DashboardPage: React.FC = () => {
  const { todayMeals } = useMealPlan(); // meal entries for today
  const { recipes } = useRecipes(); // full recipe objects

  // Map today's meals to full recipe objects
  const mealsWithRecipes = todayMeals.map((meal: MealPlanEntry) => {
    const recipe = recipes.find((r) => r._id === meal.recipeId);
    if (!recipe) throw new Error(`Recipe not found for ID: ${meal.recipeId}`);
    return { meal, recipe };
  });

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "24px" }}>
        My Meal Plan 🍽
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {mealsWithRecipes.map(({ meal, recipe }) => (
          <MealPlanCard key={meal.recipeId} meal={meal} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
