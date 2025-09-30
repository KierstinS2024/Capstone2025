// ===========================================
// PATH: src/context/AppProviders.tsx
// ===========================================
"use client";

import React, { ReactNode } from "react";

// Context Providers
import { AuthProvider } from "./AuthContext";
import { MealPlanProvider } from "./MealPlanContext";
import { RecipeProvider } from "./RecipeContext";
import { ShoppingListProvider } from "./ShoppingListContext";

/**
 * AppProviders wraps the entire application with all context providers.
 * This ensures that any component can access Auth, MealPlans, Recipes, and ShoppingLists.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    // AuthProvider should wrap everything to centralize user info
    <AuthProvider>
      {/* MealPlanProvider depends on Auth to fetch user's plans */}
      <MealPlanProvider>
        {/* RecipeProvider may depend on Auth for user-owned recipes */}
        <RecipeProvider>
          {/* ShoppingListProvider depends on Auth + MealPlans */}
          <ShoppingListProvider>{children}</ShoppingListProvider>
        </RecipeProvider>
      </MealPlanProvider>
    </AuthProvider>
  );
}
