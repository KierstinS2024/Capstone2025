// src/context/AppProviders.tsx
// Wraps all contexts into one provider for use in layout.tsx

"use client";
import React, { ReactNode } from "react";
import { UserProvider } from "./UserContext";
import { MealPlanProvider } from "./MealPlanContext";
import { RecipeProvider } from "./RecipeContext";
import { ShoppingListProvider } from "./ShoppingListContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <MealPlanProvider>
        <RecipeProvider>
          <ShoppingListProvider>{children}</ShoppingListProvider>
        </RecipeProvider>
      </MealPlanProvider>
    </UserProvider>
  );
}
