// Path: src/app/dashboard/page.tsx
"use client";

import React from "react";
import MealPlanCard from "@/components/MealPlanCard";

const DashboardPage: React.FC = () => {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>
        My Meal Plan 📅
      </h1>

      {/* Single “command center” card for today */}
      <MealPlanCard />

      {/* Future sections can go below:
          Recipe suggestions, Favorites, Shopping list, etc. */}
    </div>
  );
};

export default DashboardPage;
