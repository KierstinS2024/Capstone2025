// path: src/components/EditMealPlanEntryModal.tsx
"use client";

/**
 * EditMealPlanEntryModal
 *
 * Modal to edit an existing meal plan entry.
 * Uses MealPlanEntryForm internally.
 */

import React from "react";
import MealPlanEntryForm, { MealPlanEntryFormData } from "./MealPlanEntryForm";
import styles from "./EditMealPlanEntryModal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mealPlanId: string;
  token: string;
  entry: MealPlanEntryFormData & { _id: string };
  onUpdate: (entry: MealPlanEntryFormData & { _id: string }) => void;
}

export default function EditMealPlanEntryModal({
  isOpen,
  onClose,
  mealPlanId,
  token,
  entry,
  onUpdate,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Edit Meal Plan Entry</h2>
        <MealPlanEntryForm
          mealPlanId={mealPlanId}
          token={token}
          initialData={entry}
          onSuccess={onUpdate}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
