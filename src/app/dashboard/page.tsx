// src/app/dashboard/page.tsx
// Dashboard page integrating recipes, meal plans, shopping lists, and favorites
"use client";

import React from "react";
import DashboardCard from "@/components/DashboardCard";
import { RecipeManager } from "@/components/RecipeManager";
import { MealPlanCard } from "@/components/MealPlanCard";
import { ShoppingListCard } from "@/components/ShoppingListCard";
import { FavoritesCard } from "@/components/FavoritesCard";
import { RecipeProvider } from "@/context/RecipeContext";
import { MealPlanProvider } from "@/context/MealPlanContext";
import { ShoppingListProvider } from "@/context/ShoppingListContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

// --------------------
// Dashboard Page
// --------------------
const DashboardPage: React.FC = () => {
  return (
    // Wrap with all relevant providers for context
    <RecipeProvider>
      <FavoritesProvider>
        <MealPlanProvider>
          <ShoppingListProvider>
            <div style={{ padding: "24px", display: "grid", gap: "24px" }}>
              {/* Recipes Section */}
              <DashboardCard title="My Recipes">
                <RecipeManager />
              </DashboardCard>

              {/* Favorites Section */}
              <DashboardCard title="My Favorites">
                <FavoritesCard />
              </DashboardCard>

              {/* Meal Plan Section */}
              <DashboardCard title="Current Meal Plan">
                <MealPlanCard />
              </DashboardCard>

              {/* Shopping List Section */}
              <DashboardCard title="Shopping List">
                <ShoppingListCard />
              </DashboardCard>
            </div>
          </ShoppingListProvider>
        </MealPlanProvider>
      </FavoritesProvider>
    </RecipeProvider>
  );
};

export default DashboardPage;
