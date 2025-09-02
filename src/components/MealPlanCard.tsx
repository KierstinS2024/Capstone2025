// src/components/MealPlanCard.tsx
"use client";

import React from "react";
import styles from "./MealPlanCard.module.css";

// Props for each MealPlanCard
interface MealPlanCardProps {
  id: string; // Meal plan ID
  weekStartDate: string;
  notes?: string;
  entriesCount?: number;
  onClick?: () => void; // Optional click handler
}

export default function MealPlanCard({
  id,
  weekStartDate,
  notes,
  entriesCount,
  onClick,
}: MealPlanCardProps) {
  // Handle Enter / Space keys for keyboard activation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0} // make focusable
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Meal plan starting ${new Date(
        weekStartDate
      ).toLocaleDateString()}`}
    >
      <h3 className={styles.date}>
        Week of {new Date(weekStartDate).toLocaleDateString()}
      </h3>

      {notes && <p className={styles.notes}>{notes}</p>}

      {entriesCount !== undefined && (
        <p className={styles.entries}>Recipes: {entriesCount}</p>
      )}
    </div>
  );
}
