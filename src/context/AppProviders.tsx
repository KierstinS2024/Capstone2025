// ============================
// src/context/AppProviders.tsx
// Wraps the app in all contexts
// Order matters: Auth -> User -> Recipe -> Favorites -> MealPlan -> ShoppingList
// ============================

"use client";
import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { RecipeProvider } from "./RecipeContext";
import { FavoritesProvider } from "./FavoritesContext";
import { MealPlanProvider } from "./MealPlanContext";
import { ShoppingListProvider } from "./ShoppingListContext";

type AppProvidersProps = { children: ReactNode };

export const AppProviders = ({ children }: AppProvidersProps) => (
  <AuthProvider>
    <UserProvider>
      <RecipeProvider>
        <FavoritesProvider>
          <MealPlanProvider>
            <ShoppingListProvider>{children}</ShoppingListProvider>
          </MealPlanProvider>
        </FavoritesProvider>
      </RecipeProvider>
    </UserProvider>
  </AuthProvider>
);
