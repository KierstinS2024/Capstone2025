// PATH: src/components/WeeklyMealPlan.tsx
"use client";

import React from "react";
import { MealPlan } from "../lib/mealPlanApi";
import Link from "next/link";
import styles from "../styles/mealPlans.module.css";
import { formatDateRange } from "../lib/helpers";

interface Props {
  plans: MealPlan[];
}

export default function WeeklyMealPlan({ plans }: Props) {
  if (!plans.length) return <p>No meal plans yet.</p>;

  return (
    <div className={styles.planList}>
      {plans.map((plan) => (
        <Link key={plan._id} href={`/meal-plans/${plan._id}`}>
          <div className={styles.planCard}>
            <h3>{formatDateRange(plan.startDate, plan.endDate)}</h3>
            <p>Click to edit this week’s meals</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
