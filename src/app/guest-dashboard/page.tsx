"use client";

import React from "react";
import { useGuest } from "@/context/GuestContext";
import MealPlanCard from "@/components/MealPlanCard";

const GuestDashboard: React.FC = () => {
  const { guestMealPlan } = useGuest();
  const todayDate = new Date().toISOString();

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>
        Welcome, Guest!
      </h1>

      <MealPlanCard
        todayMeals={guestMealPlan}
        mealPlanDate={todayDate}
        isGuest
      />

      {guestMealPlan.length === 0 && (
        <p style={{ marginTop: 24, fontStyle: "italic", color: "#8b7d70" }}>
          No meals planned for today. Click “+ Add Meal” to start your guest
          plan!
        </p>
      )}
    </div>
  );
};

export default GuestDashboard;
