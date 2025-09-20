// ===========================================
// PATH: src/app/meal-plans/page.tsx
// Meal Plans page that shows the active meal plan editor
// Optimized to avoid redundant fetches
// ===========================================
"use client";

import React, { useEffect } from "react";
import { useMealPlans } from "@/context/MealPlanContext";
import MealPlanEditor from "@/components/MealPlanEditor";

export default function MealPlansPage() {
  const { activePlan, mealPlans, setActivePlan, loading } = useMealPlans();

  // -----------------------------------
  // Auto-select first valid meal plan if activePlan is null
  // -----------------------------------
  useEffect(() => {
    if (!activePlan && mealPlans.length > 0) {
      setActivePlan(mealPlans[0]);
    }
  }, [activePlan, mealPlans, setActivePlan]);

  // -----------------------------------
  // Render guards
  // -----------------------------------
  if (loading) {
    return <p>Loading meal plans...</p>;
  }

  if (!activePlan) {
    return <p>No meal plan available. Create one to get started!</p>;
  }

  // -----------------------------------
  // Safe rendering
  // -----------------------------------
  return (
    <div>
      <h1>Weekly Meal Plan</h1>
      <MealPlanEditor plan={activePlan} />
    </div>
  );
}
