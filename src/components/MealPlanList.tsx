// path: src/components/MealPlanList.tsx
"use client";

import React from "react";
import Link from "next/link";
import { MealPlan } from "@/context/MealPlanContext";
import styles from "./MealPlanList.module.css";

interface MealPlanListProps {
  mealPlans: MealPlan[];
}

export default function MealPlanList({ mealPlans }: MealPlanListProps) {
  // If there are no meal plans, show a friendly message
  if (!mealPlans || mealPlans.length === 0) {
    return <p className={styles.empty}>No meal plans found.</p>;
  }

  return (
    <div className={styles.list}>
      {mealPlans.map((plan) => {
        const entryCount = plan.entries.length;

        return (
          // Each card links to the detail page for this meal plan
          <Link
            key={plan._id}
            href={`/dashboard/meal-plans/${plan._id}`}
            className={styles.card}
          >
            <h3 className={styles.week}>
              Week of {new Date(plan.weekStartDate).toLocaleDateString()}
            </h3>

            {/* Show notes if available */}
            {plan.notes && <p className={styles.notes}>{plan.notes}</p>}

            {/* Show number of meals */}
            <p className={styles.entries}>
              {entryCount} {entryCount === 1 ? "meal" : "meals"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
