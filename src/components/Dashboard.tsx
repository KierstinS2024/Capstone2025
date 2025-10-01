// PATH: src/components/Dashboard.tsx
"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useMealPlans } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";
import { useRouter } from "next/navigation";
import WeeklyMealPlan from "@/components/WeeklyMealPlan";
import ShoppingListPanel from "@/components/ShoppingListPanel";
import styles from "@/styles/dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuth();
  const { activePlan, loading } = useMealPlans();
  const { recipes } = useRecipes();
  const router = useRouter();

  // -----------------------------
  // Loading fallback
  // -----------------------------
  if (loading || !recipes)
    return <p className={styles.loading}>Loading dashboard...</p>;

  const hasPlan = !!activePlan;

  // -----------------------------
  // Today's meals
  // -----------------------------
  const today = new Date().toISOString().split("T")[0];
  const todayMeals = activePlan?.meals?.[today] || {
    breakfast: "",
    lunch: "",
    dinner: "",
  };
  const hasMeals = Object.values(todayMeals).some(Boolean);

  // -----------------------------
  // Render dashboard
  // -----------------------------
  return (
    <div className={styles.dashboardContainer}>
      {/* Welcome message */}
      <h1 className={styles.welcomeMessage}>
        Welcome{user?.email ? `,  ${user.email}` : ""}!
      </h1>{" "}
      {/* Left Column: Meal Plan */}
      <div className={styles.leftColumn}>
        {hasPlan ? (
          <>
            <div className={styles.panelHeader}>
              <h2>Your Meal Plan</h2>
              <p>
                {activePlan.startDate || "Start"} →{" "}
                {activePlan.endDate || "End"}
              </p>
            </div>

            {hasMeals ? (
              <WeeklyMealPlan plan={activePlan} showTodayOnly />
            ) : (
              <div className={styles.panel}>
                <p>No meals added for today.</p>
                <button
                  className={styles.btnPrimary}
                  onClick={() => router.push("/meal-plans")}
                >
                  Edit Meal Plan
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.panel}>
            <p>No meal plan yet. Create one to get started.</p>
            <button
              className={styles.btnPrimary}
              onClick={() => router.push("/meal-plans")}
            >
              Create Meal Plan
            </button>
          </div>
        )}
      </div>
      {/* Right Column: Shopping List */}
      <div className={styles.rightColumn}>
        <ShoppingListPanel />
      </div>
    </div>
  );
}
