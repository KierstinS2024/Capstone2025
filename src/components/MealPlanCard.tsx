/* src/components/MealPlanCard.tsx */

import React from "react";
import styles from "./MealPlanCard.module.css";

// Props for each MealPlanCard
interface MealPlanCardProps {
  id: string; // Meal plan ID
  weekStartDate: string; // Start date of the week
  notes?: string; // Optional notes
  entriesCount?: number; // Number of recipes/entries in the plan
}

export default function MealPlanCard({
  id,
  weekStartDate,
  notes,
  entriesCount,
}: MealPlanCardProps) {
  return (
    <div className={styles.card}>
      {/* Display the week start date */}
      <h3 className={styles.date}>
        Week of {new Date(weekStartDate).toLocaleDateString()}
      </h3>

      {/* Optional notes */}
      {notes && <p className={styles.notes}>{notes}</p>}

      {/* Display number of recipes in the plan */}
      {entriesCount !== undefined && (
        <p className={styles.entries}>Recipes: {entriesCount}</p>
      )}

      {/* TODO: Add buttons for edit/delete if desired */}
    </div>
  );
}
