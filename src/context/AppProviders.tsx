// src/context/AppProviders.tsx
// Aggregates all context providers to wrap the app
// Order matters: Auth -> User -> Favorites -> MealPlan -> Recipe -> ShoppingList

"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { FavoritesProvider } from "./FavoritesContext";
import { MealPlanProvider } from "./MealPlanContext";
import { RecipeProvider } from "./RecipeContext";
import { ShoppingListProvider } from "./ShoppingListContext";

type AppProvidersProps = { children: ReactNode };

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AuthProvider>
      {/* UserProvider manages user profile + refresh logic */}
      <UserProvider>
        {/* Favorites depend on recipes/user state for display; keep near top */}
        <FavoritesProvider>
          <MealPlanProvider>
            <RecipeProvider>
              <ShoppingListProvider>{children}</ShoppingListProvider>
            </RecipeProvider>
          </MealPlanProvider>
        </FavoritesProvider>
      </UserProvider>
    </AuthProvider>
  );
};
