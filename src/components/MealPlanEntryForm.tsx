// path: src/components/MealPlanEntryForm.tsx
"use client";

/**
 * MealPlanEntryForm
 *
 * Reusable form for adding a new entry to a meal plan.
 */

import React, { useState } from "react";
import { MealPlanEntry } from "@/context/MealPlanContext";
import styles from "./MealPlanEntryForm.module.css";

interface Props {
  mealPlanId: string;
  token: string;
  onSuccess: (entry: MealPlanEntry) => void;
  onCancel?: () => void;
}

export default function MealPlanEntryForm({
  mealPlanId,
  token,
  onSuccess,
  onCancel,
}: Props) {
  const [recipeId, setRecipeId] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [servings, setServings] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeId) {
      setError("Recipe ID is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/meal-plans/${mealPlanId}/entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId, mealType, dayOfWeek, servings }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add entry");

      onSuccess(data.entry);

      // Reset form
      setRecipeId("");
      setMealType("Breakfast");
      setDayOfWeek("Monday");
      setServings(1);
    } catch (err: any) {
      setError(err.message || "Network error");
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
          min={1}
          value={servings}
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
          {loading ? "Adding..." : "Add Entry"}
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
