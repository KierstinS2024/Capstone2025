// src/context/index.tsx

import { AuthProvider } from "./AuthContext";
import { MealPlanProvider } from "./MealPlanContext";
import { ShoppingListProvider } from "./ShoppingListContext";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
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
