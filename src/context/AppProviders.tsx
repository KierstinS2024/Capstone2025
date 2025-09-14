// src/context/AppProviders.tsx
"use client";

import React from "react";
import { AuthProvider } from "./AuthContext";
import { MealPlanProvider } from "./MealPlanContext";
import { ShoppingListProvider } from "./ShoppingListContext";
import { RecipeProvider } from "./RecipeContext";

// Wrap all client-side contexts here
export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <MealPlanProvider>
        <ShoppingListProvider>
          <RecipeProvider>{children}</RecipeProvider>
        </ShoppingListProvider>
      </MealPlanProvider>
    </AuthProvider>
  );
}
