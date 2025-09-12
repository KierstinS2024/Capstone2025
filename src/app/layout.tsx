"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { RecipeProvider } from "@/context/RecipeContext";
import { MealPlanProvider } from "@/context/MealPlanContext";
import { GuestProvider } from "@/context/GuestContext";
import { ShoppingListProvider } from "@/context/ShoppingListContext";
import Navbar from "@/components/Navbar";

/**
 * RootLayout
 * Wraps the entire app in all context providers
 * Ensures hooks can be safely used anywhere
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* AuthProvider must be outermost to provide user info */}
        <AuthProvider>
          {/* FavoritesProvider depends on user auth */}
          <FavoritesProvider>
            {/* MealPlanProvider can use Recipes and Auth */}
            <MealPlanProvider>
              {/* GuestProvider should be inside MealPlan if guest meals interact with plans */}
              <GuestProvider>
                {/* RecipeProvider can depend on Auth but not Guest */}
                <RecipeProvider>
                  {/* ShoppingListProvider should wrap components using shopping list */}
                  <ShoppingListProvider>
                    {/* Navbar is always visible */}
                    <Navbar />
                    <main>{children}</main>
                  </ShoppingListProvider>
                </RecipeProvider>
              </GuestProvider>
            </MealPlanProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
