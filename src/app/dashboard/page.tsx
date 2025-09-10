// src/app/dashboard/page.tsx
import React, { useContext } from "react";
import { MealPlanContext } from "@/context/MealPlanContext";
import { ShoppingListContext } from "@/context/ShoppingListContext";
import { UserContext } from "@/context/UserContext";
import { DashboardCard } from "@/components/DashboardCard";
import { ShoppingListCard } from "@/components/ShoppingListCard";
import { FavoritesCard } from "@/components/FavoritesCard";

/**
 * Dashboard Page
 * Shows current meal plan, active shopping list, and favorite recipes.
 */
const DashboardPage: React.FC = () => {
  const { mealPlans } = useContext(MealPlanContext);
  const { shoppingLists } = useContext(ShoppingListContext);
  const { user } = useContext(UserContext);

  // Pick the first active meal plan
  const currentPlan = mealPlans[0] || null;

  return (
    <div
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>Dashboard</h1>

      {/* Current Meal Plan */}
      <DashboardCard title="Current Meal Plan">
        {currentPlan ? (
          <div>
            <p>
              {currentPlan.title} |{" "}
              {new Date(currentPlan.startDate).toLocaleDateString()} -{" "}
              {new Date(currentPlan.endDate).toLocaleDateString()}
            </p>
            <ul>
              {currentPlan.entries.map((entry, idx) => (
                <li key={idx}>
                  {entry.mealType}: Recipe ID {entry.recipeId.toString()}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No active meal plan.</p>
        )}
      </DashboardCard>

      {/* Active Shopping List */}
      <ShoppingListCard />

      {/* Favorite Recipes */}
      <FavoritesCard />
    </div>
  );
};

export default DashboardPage;
