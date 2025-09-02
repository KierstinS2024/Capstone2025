// path: src/components/EditMealPlanEntryModal.tsx
"use client";

/**
 * EditMealPlanEntryModal
 *
 * Simple accessible modal wrapper to edit a meal-plan entry in-place.
 * Reuses MealPlanEntryForm with initialData.
 */

import React, { useEffect } from "react";
import MealPlanEntryForm, { MealPlanEntryFormProps } from "./MealPlanEntryForm";
import styles from "./EditMealPlanEntryModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  entry: Required<NonNullable<MealPlanEntryFormProps["initialData"]>>; // enforce _id exists
  mealPlanId: string;
  token: string;
  onUpdate: (entry: any) => void;
};

export default function EditMealPlanEntryModal({
  isOpen,
  onClose,
  entry,
  mealPlanId,
  token,
  onUpdate,
}: Props) {
  // ESC to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Edit entry"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Edit Entry</h3>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <MealPlanEntryForm
          mealPlanId={mealPlanId}
          token={token}
          initialData={entry}
          onSuccess={(updated) => {
            onUpdate(updated);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
