// path: src/components/MealPlanList.tsx

"use client";

import React from "react";
import Link from "next/link";
import styles from "./MealPlanList.module.css";
import { MealPlan } from "@/context/MealPlanContext";

interface Props {
  mealPlans: MealPlan[];
}

export default function MealPlanList({ mealPlans }: Props) {
  return (
    <div className={styles.list}>
      {mealPlans.map((plan) => (
        <Link
          key={plan._id}
          href={`/dashboard/meal-plans/${plan._id}`}
          className={styles.card}
        >
          <h3 className={styles.week}>
            Week of {new Date(plan.weekStartDate).toLocaleDateString()}
          </h3>
          {plan.notes && <p className={styles.notes}>{plan.notes}</p>}
          <p className={styles.entries}>
            {plan.entries.length} {plan.entries.length === 1 ? "meal" : "meals"}
          </p>
        </Link>
      ))}
    </div>
  );
}
