// path: src/components/MealPlanCard.tsx
"use client";

/**
 * MealPlanCard
 *
 * Displays a single meal plan in list/grid view.
 * Props:
 * - weekStartDate, notes, entriesCount
 * - onClick: navigate to detail page
 * - onDelete: optional delete handler
 */

import React from "react";
import styles from "./MealPlanCard.module.css";

interface Props {
  id: string;
  weekStartDate: string;
  notes?: string;
  entriesCount?: number;
  onClick: () => void;
  onDelete?: () => void;
}

export default function MealPlanCard({
  id,
  weekStartDate,
  notes,
  entriesCount = 0,
  onClick,
  onDelete,
}: Props) {
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
        weekStartDate
      ).toLocaleDateString()}`}
    >
      <h3 className={styles.date}>
        Week of {new Date(weekStartDate).toLocaleDateString()}
      </h3>
      {notes && <p className={styles.notes}>{notes}</p>}
      <p className={styles.entries}>Recipes: {entriesCount}</p>

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
