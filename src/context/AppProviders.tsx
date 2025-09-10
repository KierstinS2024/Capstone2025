// Path: src/context/AppProviders.tsx
"use client"; // This is a client component

import React, { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { RecipeProvider } from "./RecipeContext";
import { MealPlanProvider } from "./MealPlanContext";
import { ShoppingListProvider } from "./ShoppingListContext";

type AppProvidersProps = {
  children: ReactNode;
};

// Combine all providers into a single wrapper
export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AuthProvider>
      <RecipeProvider>
        <MealPlanProvider>
          <ShoppingListProvider>{children}</ShoppingListProvider>
        </MealPlanProvider>
      </RecipeProvider>
    </AuthProvider>
  );
};
