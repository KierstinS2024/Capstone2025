// path: src/app/dashboard/meal-plans/page.tsx
"use client";

import React, { useState } from "react";
import { useMealPlanContext } from "@/context/MealPlanContext";
import MealPlanList from "@/components/MealPlanList";
import CreateMealPlanModal from "@/components/CreateMealPlanModal";
import styles from "./MealPlansListPage.module.css";

export default function MealPlansListPage() {
  const { mealPlans } = useMealPlanContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Meal Plans</h1>

      <button
        className={styles.createButton}
        onClick={() => setIsModalOpen(true)}
      >
        Create New Meal Plan
      </button>

      <MealPlanList mealPlans={mealPlans} />

      <CreateMealPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
