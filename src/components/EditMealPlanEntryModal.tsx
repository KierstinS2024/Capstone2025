// path: src/components/EditMealPlanEntryModal.tsx
"use client";

/**
 * EditMealPlanEntryModal
 *
 * Modal to edit an existing meal plan entry.
 */

import React, { useState } from "react";
import { MealPlanEntry } from "@/context/MealPlanContext";
import MealPlanEntryForm from "./MealPlanEntryForm";
import styles from "./EditMealPlanEntryModal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entry: MealPlanEntry;
  mealPlanId: string;
  token: string;
  onUpdate: (entry: MealPlanEntry) => void;
}

export default function EditMealPlanEntryModal({
  isOpen,
  onClose,
  entry,
  mealPlanId,
  token,
  onUpdate,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpdate = async (updatedEntry: MealPlanEntry) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/meal-plans/${mealPlanId}/entries/${entry._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipeId: updatedEntry.recipeId,
            mealType: updatedEntry.mealType,
            dayOfWeek: updatedEntry.dayOfWeek,
            servings: updatedEntry.servings,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update entry");

      onUpdate(data.entry);
      onClose();
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Edit Entry</h2>
        {error && <p className={styles.error}>{error}</p>}

        <MealPlanEntryForm
          mealPlanId={mealPlanId}
          token={token}
          onSuccess={handleUpdate}
          onCancel={onClose}
          // Pre-fill form with current entry values
          initialData={{
            _id: entry._id,
            recipeId: entry.recipeId,
            mealType: entry.mealType,
            dayOfWeek: entry.dayOfWeek,
            servings: entry.servings,
          }}
        />
      </div>
    </div>
  );
}
