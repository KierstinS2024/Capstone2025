// PATH: src/components/Dashboard.tsx
"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useMealPlans } from "@/context/MealPlanContext";
import MealPlanCard from "@/components/MealPlanCard";
import ShoppingListPanel from "@/components/ShoppingListPanel";
import styles from "@/styles/dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuth();
  const { mealPlans, loading } = useMealPlans();

  // Active meal plan = first in the list
  const activePlan = mealPlans[0] || null;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Welcome {user?.email}</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.mealPlanSection}>
          {loading ? (
            <p>Loading meal plan...</p>
          ) : activePlan ? (
            <MealPlanCard plan={activePlan} />
          ) : (
            <p>No active meal plan. Create one on the Meal Plans page.</p>
          )}
        </div>

        <aside className={styles.shoppingListSection}>
          <ShoppingListPanel />
        </aside>
      </main>
    </div>
  );
}
