// Path: src/app/guest-dashboard/page.tsx
"use client";

import React from "react";
import { useGuest } from "@/context/GuestContext";
import MealPlanCard from "@/components/MealPlanCard";

const GuestDashboard: React.FC = () => {
  const { guestMealPlan } = useGuest();

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>
        Welcome, Guest!
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {guestMealPlan.map((meal) => (
          <MealPlanCard key={meal.recipeId} meal={meal} isGuest />
        ))}
      </div>
    </div>
  );
};

export default GuestDashboard;
