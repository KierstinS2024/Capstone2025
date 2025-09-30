// ===========================================
// PATH: src/components/TodayMealPlanPanel.tsx
// ===========================================
"use client";

import React from "react";
import { useMealPlans } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";
import { useRouter } from "next/navigation";
import TodayMealPlanCard from "./TodayMealPlanCard";
import styles from "@/styles/dashboard.module.css";

export default function TodayMealPlanPanel() {
  const { activePlan, loading } = useMealPlans();
  const { recipes } = useRecipes();
  const router = useRouter();

  if (loading || !recipes) return <p className={styles.loading}>Loading...</p>;

  const today = new Date().toISOString().split("T")[0];
  const hasPlan = !!activePlan;

  const handleEdit = () => router.push("/meal-plans");

  return (
    <div className={styles.panel}>
      {hasPlan && activePlan ? (
        <TodayMealPlanCard
          plan={activePlan}
          day={today}
          recipes={recipes}
          onEdit={handleEdit}
        />
      ) : (
        <div className={styles.emptyState}>
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
  );
}
