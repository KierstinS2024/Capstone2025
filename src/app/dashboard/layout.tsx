// path: src/app/dashboard/layout.tsx
"use client";

// --- React imports ---
import { ReactNode } from "react";

// --- Component imports ---
import ProtectedRoute from "@/components/ProtectedRoute"; // ensures user is authenticated
import NavBar from "@/components/NavBar"; // main dashboard navigation
import { ThemeProvider } from "@/context/ThemeContext"; // dark/light mode support
import { MealPlanProvider } from "@/context/MealPlanContext"; // global meal plan state
import { IngredientProvider } from "@/context/IngredientContext"; // global ingredient state

// --- Styles ---
import styles from "./DashboardLayout.module.css";

// --- Props ---
interface DashboardLayoutProps {
  children: ReactNode; // content of each dashboard page
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ThemeProvider>
      <ProtectedRoute>
        {/* Wrap all dashboard children with contexts */}
        <MealPlanProvider>
          <IngredientProvider>
            <div className={styles.dashboardContainer}>
              <NavBar />
              <main className={styles.mainContent}>{children}</main>
            </div>
          </IngredientProvider>
        </MealPlanProvider>
      </ProtectedRoute>
    </ThemeProvider>
  );
}
