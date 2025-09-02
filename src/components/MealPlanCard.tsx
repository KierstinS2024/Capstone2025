/* src/components/MealPlanCard.tsx */
"use client";

/**
 * MealPlanCard
 *
 * Displays a single meal plan as a card.
 * Supports click to navigate and optional delete button.
 */

import React from "react";
import styles from "./MealPlanCard.module.css";

// Props for MealPlanCard
export interface MealPlanCardProps {
  mealPlan: {
    _id: string;
    weekStartDate: string;
    notes?: string;
    entries?: any[]; // optional entries array for count
  };
  onClick?: () => void; // optional click handler (navigate to detail)
  onDelete?: () => void; // optional delete button handler
}

export default function MealPlanCard({ mealPlan, onClick, onDelete }: MealPlanCardProps) {
  return (
    <div
      className={styles.card}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {/* Display the week start date */}
      <h3 className={styles.date}>
        Week of {new Date(mealPlan.weekStartDate).toLocaleDateString()}
      </h3>

      {/* Optional notes */}
      {mealPlan.notes && <p className={styles.notes}>{mealPlan.notes}</p>}

      {/* Optional entries count */}
      {mealPlan.entries && (
        <p className={styles.entries}>Recipes: {mealPlan.entries.length}</p>
      )}

      {/* Optional delete button */}
      {onDelete && (
        <button
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation(); // prevent card click navigation
            onDelete();
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}
