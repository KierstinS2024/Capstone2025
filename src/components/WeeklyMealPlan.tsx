// PATH: src/components/WeeklyMealPlan.tsx
"use client";

import React from "react";
import { MealPlan, MealType, DayMeals } from "@/types/mealPlan";
import { useRecipes } from "@/context/RecipeContext";
import styles from "@/styles/weeklyMealPlan.module.css";

interface WeeklyMealPlanProps {
  plan: MealPlan;
  showTodayOnly?: boolean; // optional: show only today's meals
}

/**
 * WeeklyMealPlan Component
 * -----------------------------
 * Renders a week (or today only) of meals from the meal plan.
 * Displays recipe titles for each meal type.
 */
export default function WeeklyMealPlan({
  plan,
  showTodayOnly = false,
}: WeeklyMealPlanProps) {
  const { recipes } = useRecipes();

  // Helper: get recipe object by ID
  const getRecipe = (id: string) => recipes.find((r) => r.id === id);

  // Determine which dates to render
  const datesToRender = showTodayOnly
    ? [new Date().toISOString().split("T")[0]]
    : Object.keys(plan.meals).sort(); // sort chronologically

  return (
    <div className={styles.weeklyMealPlan}>
      {datesToRender.map((date) => {
        const dayMeals: DayMeals = plan.meals[date] || {
          breakfast: "",
          lunch: "",
          dinner: "",
        };
        return (
          <div key={date} className={styles.dayCard}>
            <h4 className={styles.date}>{date}</h4>
            <ul className={styles.mealList}>
              {(Object.keys(dayMeals) as MealType[]).map((mealType) => {
                const recipeId = dayMeals[mealType];
                const recipe = recipeId ? getRecipe(recipeId) : null;
                return (
                  <li key={mealType} className={styles.mealItem}>
                    <strong>
                      {mealType.charAt(0).toUpperCase() + mealType.slice(1)}:
                    </strong>{" "}
                    {recipe ? recipe.title : "—"}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
