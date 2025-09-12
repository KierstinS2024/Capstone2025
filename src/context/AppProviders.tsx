// Path: src/context/AppProviders.tsx
"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { FavoritesProvider } from "./FavoritesContext";
import { MealPlanProvider } from "./MealPlanContext";
import { RecipeProvider } from "./RecipeContext";
import { GuestProvider } from "./GuestContext";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Wraps the entire app with all necessary context providers.
 * Guest mode will bypass Auth and MealPlanProvider automatically.
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <MealPlanProvider>
          <RecipeProvider>
            <GuestProvider>{children}</GuestProvider>
          </RecipeProvider>
        </MealPlanProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
};
