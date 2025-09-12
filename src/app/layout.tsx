// Path: src/app/layout.tsx
"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { RecipeProvider } from "@/context/RecipeContext";
import { MealPlanProvider } from "@/context/MealPlanContext";
import { GuestProvider } from "@/context/GuestContext";
import Navbar from "@/components/Navbar";

/**
 * RootLayout
 * Wraps the entire app in all context providers
 * Includes Navbar for navigation
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <FavoritesProvider>
            <RecipeProvider>
              <MealPlanProvider>
                <GuestProvider>
                  {/* ✅ Navbar is always visible */}
                  <Navbar />
                  <main>{children}</main>
                </GuestProvider>
              </MealPlanProvider>
            </RecipeProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
