// Path: src/app/meal-plans/page.tsx
"use client";

import React, { useState } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import MealPlanCard from "@/components/MealPlanCard";
import type { MealPlanEntry } from "@/types/mealPlan";

/**
 * MealPlansPage
 * Displays the current user's meal plan with options to add/edit meals.
 */
const MealPlansPage: React.FC = () => {
  const { currentMealPlan, todayMeals } = useMealPlan(); // Meal plan context
  const [isAddingMeal, setIsAddingMeal] = useState<boolean>(false); // Modal state

  if (!currentMealPlan) {
    return (
      <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Meal Plans</h1>
        <p>No meal plan found. Start by creating a new plan!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>
        Meal Plan: {currentMealPlan.title}
      </h1>

      {/* Today's meals */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {todayMeals.length === 0 ? (
          <div>No meals for today. Add some!</div>
        ) : (
          todayMeals.map((meal: MealPlanEntry) => (
            <MealPlanCard key={meal.recipeId} meal={meal} />
          ))
        )}
      </div>
    </div>
  );
};

export default MealPlansPage;
