// Path: src/app/guest-dashboard/page.tsx
"use client";

import React from "react";
import MealPlanCard from "@/components/MealPlanCard";

const GuestDashboard: React.FC = () => {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>
        Welcome, Guest!
      </h1>

      {/* Single “command center” card for guest today */}
      <MealPlanCard isGuest />
    </div>
  );
};

export default GuestDashboard;
