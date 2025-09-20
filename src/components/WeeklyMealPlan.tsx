// ===========================================
// PATH: src/components/WeeklyMealPlan.tsx
// ===========================================
"use client";

import React from "react";
import { MealPlan } from "@/lib/mealPlanApi";
import Link from "next/link";
import styles from "@/styles/mealPlans.module.css";
import { formatDateRange } from "@/lib/helpers";

interface Props {
  plans: MealPlan[]; // Array of all meal plans
}

export default function WeeklyMealPlan({ plans }: Props) {
  if (!plans.length) return <p>No meal plans yet.</p>;

  return (
    <div className={styles.planList}>
      {plans.map((plan) => (
        // Key must be unique per plan
        <Link key={plan.id} href={`/meal-plans/${plan.id}`}>
          <div className={styles.planCard}>
            <h3>{formatDateRange(plan.startDate, plan.endDate)}</h3>
            <p>Click to edit this week’s meals</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
