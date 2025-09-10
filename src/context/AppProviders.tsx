// src/context/AppProviders.tsx
// Aggregates all context providers for the app

import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { MealPlanProvider } from "./MealPlanContext";
import { RecipeProvider } from "./RecipeContext";
import { ShoppingListProvider } from "./ShoppingListContext";

type Props = { children: ReactNode };

export const AppProviders = ({ children }: Props) => (
  <AuthProvider>
    <MealPlanProvider>
      <RecipeProvider>
        <ShoppingListProvider>{children}</ShoppingListProvider>
      </RecipeProvider>
    </MealPlanProvider>
  </AuthProvider>
);
