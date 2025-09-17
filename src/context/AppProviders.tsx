// ===========================================
// src/context/AppProviders.tsx
// Wrapper to compose all contexts
// ===========================================
"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { MealPlanProvider } from "./MealPlanContext";
import { RecipeProvider } from "./RecipeContext";
import { ShoppingListProvider } from "./ShoppingListContext";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <MealPlanProvider>
        <RecipeProvider>
          <ShoppingListProvider>{children}</ShoppingListProvider>
        </RecipeProvider>
      </MealPlanProvider>
    </AuthProvider>
  );
};
