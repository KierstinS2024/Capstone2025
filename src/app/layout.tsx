// Path: src/app/layout.tsx
"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { MealPlanProvider } from "@/context/MealPlanContext";
import { GuestProvider } from "@/context/GuestContext";

/**
 * RootLayout
 * Wraps the entire app in all context providers
 * Ensures all children components can safely access auth, favorites, meal plan, and guest contexts
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
            <MealPlanProvider>
              <GuestProvider>{children}</GuestProvider>
            </MealPlanProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
