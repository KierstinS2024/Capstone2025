// src/app/layout.tsx
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { RecipeProvider } from "@/context/RecipeContext";
import { ShoppingListProvider } from "@/context/ShoppingListContext";
import { MealPlanProvider } from "@/context/MealPlanContext";
import "@/app/global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <RecipeProvider>
            <ShoppingListProvider>
              <MealPlanProvider>{children}</MealPlanProvider>
            </ShoppingListProvider>
          </RecipeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
