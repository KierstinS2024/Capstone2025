// ===========================================
// PATH: src/app/meal-plans/[id]/page.tsx
// Dedicated page for editing a specific meal plan
// ===========================================
"use client";

import React from "react";
import MealPlanEditor from "@/components/MealPlanEditor";
import { useMealPlans } from "@/context/MealPlanContext";

export default function MealPlanEditorPage() {
  const { activePlan } = useMealPlans();

  if (!activePlan) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>No active meal plan</h2>
        <p>Create a meal plan from the main page first.</p>
      </div>
    );
  }

  return (
    <div className="meal-plan-page" style={{ padding: "1rem" }}>
      <h1>Meal Plan Editor</h1>
      {/* Pass the active plan to the editor */}
      <MealPlanEditor plan={activePlan} />
    </div>
  );
}
