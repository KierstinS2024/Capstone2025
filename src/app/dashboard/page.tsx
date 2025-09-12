"use client";

import React from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import MealPlanCard from "@/components/MealPlanCard";

const DashboardPage: React.FC = () => {
  const { todayMeals } = useMealPlan();
  const todayDate = new Date().toISOString();

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>
        My Meal Plan 📅
      </h1>

      <MealPlanCard todayMeals={todayMeals} mealPlanDate={todayDate} />

      {todayMeals.length === 0 && (
        <p style={{ marginTop: 24, fontStyle: "italic", color: "#8b7d70" }}>
          No meals planned for today. Click “+ Add Meal” to get started!
        </p>
      )}
    </div>
  );
};

export default DashboardPage;
