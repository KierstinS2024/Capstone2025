// src/context/index.tsx

import { MealPlanProvider } from "./MealPlanContext";
import { ShoppingListProvider } from "./ShoppingListContext";
import { AuthProvider } from "./AuthContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MealPlanProvider>
        <ShoppingListProvider>
          {children}
        </ShoppingListProvider>
      </MealPlanProvider>
    </AuthProvider>
  );
}
