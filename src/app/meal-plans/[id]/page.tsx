// ===========================================
// PATH: src/app/meal-plans/[id]/page.tsx
//
// MealPlanDetailPage
// - Shows details for a single meal plan
// - Uses MealPlanContext for single-plan-per-user enforcement
// - Renders MealPlanEditor
// - Handles not-found / loading gracefully
// ===========================================

"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useMealPlans } from "@/context/MealPlanContext";
import MealPlanEditor from "@/components/MealPlanEditor";
import Navbar from "@/components/Navbar";
import styles from "@/styles/theme-mealplan.module.css";

export default function MealPlanDetailPage() {
  const { id: planId } = useParams();
  const { activePlan } = useMealPlans();

  // If active plan does not exist or ID mismatch → show error
  if (!activePlan || activePlan.id !== planId) {
    return (
      <div className={styles.pageContainer}>
        <Navbar />
        <p>Meal plan not found.</p>
      </div>
    );
  }

  // Safe render → plan exists and matches route ID
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <h1 className={styles.heading1}>Meal Plan Details</h1>
      <MealPlanEditor plan={activePlan} />
    </div>
  );
}
