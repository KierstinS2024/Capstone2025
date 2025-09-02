// path: src/components/MealPlanCard.tsx
"use client";

import React from "react";
import { MealPlan } from "@/context/MealPlanContext";
import styles from "./MealPlanCard.module.css";

interface Props {
  mealPlan: MealPlan;
  onClick: () => void;
  onDelete?: () => void;
}

export default function MealPlanCard({ mealPlan, onClick, onDelete }: Props) {
  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      aria-label={`Meal plan starting ${new Date(
        mealPlan.weekStartDate
      ).toLocaleDateString()}`}
    >
      <h3 className={styles.date}>
        Week of {new Date(mealPlan.weekStartDate).toLocaleDateString()}
      </h3>
      {mealPlan.notes && <p className={styles.notes}>{mealPlan.notes}</p>}
      <p className={styles.entries}>Recipes: {mealPlan.entries.length}</p>

      {onDelete && (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}
