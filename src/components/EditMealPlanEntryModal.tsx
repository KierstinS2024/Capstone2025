// path: src/components/EditMealPlanEntryModal.tsx
"use client";

import React from "react";
import MealPlanEntryForm, { MealPlanEntryFormProps } from "./MealPlanEntryForm";
import styles from "./EditMealPlanEntryModal.module.css";
import { MealPlanEntry } from "@/context/MealPlanContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entry: MealPlanEntry; // The entry being edited
  mealPlanId: string;
  token: string;
  onUpdate: (entry: MealPlanEntry) => void; // Callback after successful update
}

export default function EditMealPlanEntryModal({
  isOpen,
  onClose,
  entry,
  mealPlanId,
  token,
  onUpdate,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>Edit Meal Plan Entry</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </header>

        <div className={styles.body}>
          <MealPlanEntryForm
            mealPlanId={mealPlanId}
            token={token}
            initialData={entry} // pass the entry to pre-fill the form
            onSuccess={(updatedEntry) => {
              onUpdate(updatedEntry);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
