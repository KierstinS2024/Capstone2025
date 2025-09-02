// path: src/components/MealPlanCard.tsx
"use client";

/**
 * MealPlanCard
 *
 * Displays a single meal plan summary for dashboard list.
 */

import React from "react";
import { useRouter } from "next/navigation";
import { MealPlan } from "@/context/MealPlanContext";
import styles from "./MealPlanCard.module.css";

interface Props {
  plan: MealPlan;
}

export default function MealPlanCard({ plan }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/meal-plans/${plan._id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <h3 className={styles.title}>
        {new Date(plan.weekStartDate).toLocaleDateString()}
      </h3>
      <p>{plan.notes || "No notes"}</p>
      <p>
        {plan.entries.length} {plan.entries.length === 1 ? "entry" : "entries"}
      </p>
    </div>
  );
}
