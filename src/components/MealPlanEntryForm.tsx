// path: src/components/MealPlanEntryForm.tsx
"use client";

/**
 * MealPlanEntryForm
 *
 * Reusable form to add a new meal plan entry (recipe).
 * Can be used inline or inside a modal.
 */

import React, { useState } from "react";
import styles from "./MealPlanEntryForm.module.css";

export interface MealPlanEntryFormData {
  recipeId: string;
  mealType: string;
  dayOfWeek: string;
  servings: number;
}

interface Props {
  mealPlanId: string;
  token: string;
  initialData?: MealPlanEntryFormData & { _id?: string };
  onSuccess: (entry: MealPlanEntryFormData & { _id: string }) => void;
  onCancel?: () => void;
}

export default function MealPlanEntryForm({
  mealPlanId,
  token,
  initialData,
  onSuccess,
  onCancel,
}: Props) {
  const [recipeId, setRecipeId] = useState(initialData?.recipeId || "");
  const [mealType, setMealType] = useState(
    initialData?.mealType || "Breakfast"
  );
  const [dayOfWeek, setDayOfWeek] = useState(
    initialData?.dayOfWeek || "Monday"
  );
  const [servings, setServings] = useState(initialData?.servings || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData?._id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeId) {
      setError("Recipe ID is required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const method = isEditing ? "PATCH" : "POST";
      const url = isEditing
        ? `/api/meal-plans/${mealPlanId}/entries/${initialData?._id}`
        : `/api/meal-plans/${mealPlanId}/entries`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId, mealType, dayOfWeek, servings }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save entry");

      onSuccess(data.entry);

      if (!isEditing) {
        setRecipeId("");
        setMealType("Breakfast");
        setDayOfWeek("Monday");
        setServings(1);
      }
    } catch (err: any) {
      setError(err.message || "Error saving entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}

      <label className={styles.label}>
        Recipe ID:
        <input
          type="text"
          value={recipeId}
          onChange={(e) => setRecipeId(e.target.value)}
          placeholder="Enter recipe ID"
          required
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Meal Type:
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className={styles.select}
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
        </select>
      </label>

      <label className={styles.label}>
        Day of Week:
        <select
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
          className={styles.select}
        >
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <option key={day}>{day}</option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Servings:
        <input
          type="number"
          value={servings}
          min={1}
          onChange={(e) => setServings(Number(e.target.value))}
          required
          className={styles.input}
        />
      </label>

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading
            ? isEditing
              ? "Updating..."
              : "Adding..."
            : isEditing
            ? "Update Entry"
            : "Add Entry"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
