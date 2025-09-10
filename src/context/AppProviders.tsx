// Path: src/context/AppProviders.tsx
import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { MealPlanProvider } from "./MealPlanContext";
import { RecipeProvider } from "./RecipeContext";
import { ShoppingListProvider } from "./ShoppingListContext";

// Wrap all context providers for the app
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
