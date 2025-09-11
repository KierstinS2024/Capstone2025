// Path: src/pages/DashboardPage.tsx
import React from "react";
import { MealPlanCard } from "@/components/MealPlanCard";
import { RecipeCard } from "@/components/RecipeCard";

/**
 * DashboardPage
 * Main landing page after login
 * Shows:
 * - Today's Meal Plan
 * - Recipes list (favorites, delete, etc.)
 */
export const DashboardPage: React.FC = () => {
  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Section: Today's Meal Plan */}
      <section>
        <MealPlanCard />
      </section>

      {/* Section: Recipes / Favorites */}
      <section>
        <RecipeCard />
      </section>
    </div>
  );
};
