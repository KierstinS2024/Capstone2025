// Path: src/components/GuestDashboard.tsx
"use client";

import React from "react";
import { useGuest } from "@/context/GuestContext";
import MealPlanCard from "./MealPlanCard";
import type { MealPlanEntry } from "@/types/mealPlan";

/**
 * GuestDashboard
 * Displays the guest user's simulated meal plan.
 * Only uses GuestContext; no authenticated providers required.
 */
export const GuestDashboard: React.FC = () => {
  const { guestMealPlan } = useGuest();

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "28px", color: "#6b4c3b", marginBottom: "24px" }}>
        Guest Mode Meal Plan
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {guestMealPlan.map((meal: MealPlanEntry) => (
          <MealPlanCard key={meal.mealType} meal={meal} isGuest />
        ))}
      </div>
    </div>
  );
};
