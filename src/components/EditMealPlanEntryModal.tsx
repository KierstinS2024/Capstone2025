// path: src/components/EditMealPlanEntryModal.tsx
"use client";

/**
 * EditMealPlanEntryModal
 *
 * Accessible modal wrapper to edit a meal-plan entry in-place.
 * - Reuses MealPlanEntryForm with initialData
 * - Handles ESC key to close
 * - Calls onUpdate on successful save
 */

import React, { useEffect } from "react";
import MealPlanEntryForm, { MealPlanEntryFormProps } from "./MealPlanEntryForm";
import styles from "./EditMealPlanEntryModal.module.css";

type EditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mealPlanId: string;
  token: string;
  entry: Required<NonNullable<MealPlanEntryFormProps["initialData"]>>;
  onUpdate: (updatedEntry: any) => void;
};

export default function EditMealPlanEntryModal({
  isOpen,
  onClose,
  mealPlanId,
  token,
  entry,
  onUpdate,
}: EditModalProps) {
  // Close modal on ESC key
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Edit meal plan entry"
    >
      <div className={styles.modal}>
        {/* Modal header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Entry</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {/* Modal body */}
        <div className={styles.body}>
          <MealPlanEntryForm
            mealPlanId={mealPlanId}
            token={token}
            initialData={entry}
            onSuccess={(updated) => {
              onUpdate(updated);
              onClose();
            }}
            onCancel={onClose} // optional cancel button
          />
        </div>
      </div>
    </div>
  );
}
