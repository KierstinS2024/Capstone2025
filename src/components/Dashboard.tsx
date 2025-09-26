// ===========================================
// PATH: src/components/Dashboard.tsx
// Main dashboard layout: shows active meal plan and shopping list
// Reactively waits for MealPlanContext to fetch data
// ===========================================

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useMealPlans } from "@/context/MealPlanContext";
import MealPlanCard from "@/components/MealPlanCard";
import ShoppingListPanel from "@/components/ShoppingListPanel";
import styles from "@/styles/dashboard.module.css";

export default function Dashboard() {
  // -------------------------------
  // Get current user info from AuthContext
  // -------------------------------
  const { user } = useAuth();

  // -------------------------------
  // Destructure meal plan context
  // - loading: fetch status
  // - activePlan: current user’s single plan (or null)
  // -------------------------------
  const { loading, activePlan } = useMealPlans();

  const router = useRouter();

  return (
    <div className={styles.dashboard}>
      {/* -------------------------------
          Header
          Displays welcome message with user's email
      ------------------------------- */}
      <header className={styles.header}>
        <h1>Welcome {user?.email}</h1>
      </header>

      {/* -------------------------------
          Main layout
          Left: meal plan card / empty state
          Right: shopping list panel
      ------------------------------- */}
      <main className={styles.main}>
        {/* -------------------------------
            Meal plan section
        ------------------------------- */}
        <div className={styles.mealPlanSection}>
          {loading ? (
            // Show loading indicator while meal plan is fetched
            <p>Loading meal plan...</p>
          ) : activePlan ? (
            // Render the active meal plan
            <MealPlanCard plan={activePlan} />
          ) : (
            // Empty state if no meal plan exists
            <div className={styles.emptyState}>
              <p>No active meal plan yet.</p>
              <button
                className={styles.createPlanButton}
                onClick={() => router.push("/meal-plans")}
              >
                + Create Meal Plan
              </button>
            </div>
          )}
        </div>

        {/* -------------------------------
            Shopping list sidebar
        ------------------------------- */}
        <aside className={styles.shoppingListSection}>
          <ShoppingListPanel />
        </aside>
      </main>
    </div>
  );
}
