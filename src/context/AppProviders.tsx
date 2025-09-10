// src/context/AppProviders.tsx
// Aggregates all context providers to wrap the app
"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { MealPlanProvider } from "./MealPlanContext";
import { RecipeProvider } from "./RecipeContext";
import { ShoppingListProvider } from "./ShoppingListContext";

type AppProvidersProps = { children: ReactNode };

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AuthProvider>
      <UserProvider>
        <MealPlanProvider>
          <RecipeProvider>
            <ShoppingListProvider>{children}</ShoppingListProvider>
          </RecipeProvider>
        </MealPlanProvider>
      </UserProvider>
    </AuthProvider>
  );
};
