// src/context/AppProviders.tsx
// Combines all context providers for the app

import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { RecipeProvider } from "./RecipeContext";
import { MealPlanProvider } from "./MealPlanContext";
import { ShoppingListProvider } from "./ShoppingListContext";
import { UserProvider } from "./UserContext";

type AppProvidersProps = { children: ReactNode };

export const AppProviders = ({ children }: AppProvidersProps) => {
  // Wrap children in all providers in proper order
  return (
    <AuthProvider>
      <UserProvider>
        <RecipeProvider>
          <MealPlanProvider>
            <ShoppingListProvider>{children}</ShoppingListProvider>
          </MealPlanProvider>
        </RecipeProvider>
      </UserProvider>
    </AuthProvider>
  );
};
