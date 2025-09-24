// ===========================================
// PATH: src/components/Dashboard.tsx
// Main dashboard layout: shows active meal plan and shopping list
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
  const { user } = useAuth();
  const { mealPlans, loading } = useMealPlans();
  const router = useRouter();

  // Pick the first active plan
  const activePlan = mealPlans[0] || null;

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Welcome {user?.email}</h1>
      </header>

      {/* Main layout: left = meal plan, right = shopping list */}
      <main className={styles.main}>
        <div className={styles.mealPlanSection}>
          {loading ? (
            <p>Loading meal plan...</p>
          ) : activePlan ? (
            <MealPlanCard plan={activePlan} />
          ) : (
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

        <aside className={styles.shoppingListSection}>
          <ShoppingListPanel />
        </aside>
      </main>
    </div>
  );
}
