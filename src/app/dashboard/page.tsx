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
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px",
      }}
    >
      {isLoading && (
        <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
          Loading dashboard...
        </div>
      )}

      {/* Recipes Card */}
      <RecipeCard />

      {/* Favorites Card */}
      <FavoritesCard />

      {/* Meal Plan Card */}
      <MealPlanCard mealPlan={currentMealPlan || undefined} />

      {/* Shopping List Card */}
      <ShoppingListCard />
    </div>
  );
};

export default DashboardPage;
