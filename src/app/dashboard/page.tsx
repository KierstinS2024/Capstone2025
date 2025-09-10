// src/app/dashboard/page.tsx
"use client";

/**
 * Dashboard Page
 * Displays Recipes, Meal Plans, Shopping Lists, and Favorites
 * All contexts are provided at the top-level for full state management
 */

import React from "react";
import DashboardCard from "@/components/DashboardCard";
import { RecipeCard } from "@/components/RecipeCard";
import { MealPlanCard } from "@/components/MealPlanCard";
import { ShoppingListCard } from "@/components/ShoppingListCard";
import { FavoritesCard } from "@/components/FavoritesCard";

import { RecipeProvider } from "@/context/RecipeContext";
import { MealPlanProvider } from "@/context/MealPlanContext";
import { ShoppingListProvider } from "@/context/ShoppingListContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

const DashboardPage: React.FC = () => {
  return (
    <RecipeProvider>
      <MealPlanProvider>
        <ShoppingListProvider>
          <FavoritesProvider>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "16px",
                padding: "16px",
              }}
            >
              {/* Recipes */}
              <DashboardCard title="Recipes">
                <RecipeCard />
              </DashboardCard>

              {/* Meal Plans */}
              <DashboardCard title="Meal Plans">
                <MealPlanCard />
              </DashboardCard>

              {/* Shopping Lists */}
              <DashboardCard title="Shopping Lists">
                <ShoppingListCard />
              </DashboardCard>

              {/* Favorites */}
              <DashboardCard title="Favorites">
                <FavoritesCard />
              </DashboardCard>
            </div>
          </FavoritesProvider>
        </ShoppingListProvider>
      </MealPlanProvider>
    </RecipeProvider>
  );
};

export default DashboardPage;
