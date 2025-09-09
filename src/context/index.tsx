// src/context/index.tsx

"use client";

// Aggregates all context providers for the app
import { AuthProvider } from "./AuthContext";
import { MealPlanProvider } from "./MealPlanContext";
import { ShoppingListProvider } from "./ShoppingListContext";
import React, { ReactNode } from "react";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <MealPlanProvider>
        <ShoppingListProvider>{children}</ShoppingListProvider>
      </MealPlanProvider>
    </AuthProvider>
  );
};
