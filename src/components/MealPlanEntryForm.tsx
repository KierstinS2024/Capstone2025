// src/components/MealPlanEntryForm.tsx
"use client";

/**
 * MealPlanEntryForm
 *
 * Reusable form for adding or editing a meal plan entry (recipe).
 * Can be used in modal or inline on the detail page.
 */

import { useState } from "react";
import styles from "./MealPlanEntryForm.module.css";

interface MealPlanEntryFormProps {
  mealPlanId: string; // ID of the parent meal plan
  token: string; // JWT token for protected API calls
  initialData?: {
    _id?: string;
    recipeId: string;
    mealType: string;
    dayOfWeek: string;
    servings: number;
  };
  onSuccess: (entry: any) => void; // Callback to update parent state
  onCancel?: () => void; // Optional cancel handler
}

export default function MealPlanEntryForm({
  mealPlanId,
  token,
  initialData,
  onSuccess,
  onCancel,
}: MealPlanEntryFormProps) {
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
    if (!token) {
      setError("No authentication token found.");
      return;
    }

    if (!recipeId) {
      setError("Please select a recipe.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const method = isEditing ? "PATCH" : "POST";
      const endpoint = isEditing
        ? `/api/meal-plans/${mealPlanId}/entries/${initialData?._id}`
        : `/api/meal-plans/${mealPlanId}/entries`;

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId, mealType, dayOfWeek, servings }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save entry");

      // Call parent callback to update state
      onSuccess(data.entry);

      // Reset form if adding new entry
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
          className={styles.submitButton}
          disabled={loading}
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
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
