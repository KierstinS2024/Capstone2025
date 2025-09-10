// src/app/dashboard/page.tsx
"use client";

import React from "react";
import { RecipeCard } from "@/components/RecipeCard";
import { FavoritesCard } from "@/components/FavoritesCard";
import { MealPlanCard } from "@/components/MealPlanCard";
import { ShoppingListCard } from "@/components/ShoppingListCard";
import { useRecipes } from "@/context/RecipeContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingLists } from "@/context/ShoppingListContext";

/**
 * DashboardPage
 * Displays main dashboard with Recipes, Favorites, Meal Plan, and Shopping List cards
 */
const DashboardPage: React.FC = () => {
  const { recipes, loading: recipesLoading } = useRecipes();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const { currentMealPlan } = useMealPlan();
  const { shoppingLists, loading: shoppingListsLoading } = useShoppingLists();

  const isLoading = recipesLoading || favoritesLoading || shoppingListsLoading;

  return (
    <div
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {isLoading && <div>Loading dashboard...</div>}

      {/* Recipes */}
      <RecipeCard />

      {/* Favorites */}
      <FavoritesCard />

      {/* Meal Plan */}
      <MealPlanCard mealPlan={currentMealPlan ?? undefined} />

      {/* Shopping List */}
      <ShoppingListCard />
    </div>
  );
};

export default DashboardPage;
