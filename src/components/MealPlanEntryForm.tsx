// path: src/components/MealPlanEntryForm.tsx
"use client";

/**
 * MealPlanEntryForm
 *
 * Used for both:
 * - Creating a new entry (POST /api/meal-plans/:id/entries)
 * - Editing an existing entry (PATCH /api/meal-plans/:id/entries/:entryId)
 *
 * Also fetches recipes for a helpful dropdown (can still paste an ID manually).
 */

import React, { useEffect, useMemo, useState } from "react";
import styles from "./MealPlanEntryForm.module.css";

type RecipeLite = { _id: string; title: string };

export interface MealPlanEntryFormProps {
  mealPlanId: string;
  token: string;
  initialData?: {
    _id?: string;
    recipeId: string;
    mealType: string;
    dayOfWeek: string;
    servings: number;
  };
  onSuccess: (entry: any) => void;
  onCancel?: () => void;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

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
  const [recipes, setRecipes] = useState<RecipeLite[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialData?._id);

  // Optional recipe list for nicer UX
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (active) setRecipes(Array.isArray(data.recipes) ? data.recipes : []);
      } catch {
        // Ignore recipe list errors; text entry still works
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

  const sortedRecipes = useMemo(
    () => [...recipes].sort((a, b) => a.title.localeCompare(b.title)),
    [recipes]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeId) {
      setError("Please select or enter a recipe.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const endpoint = isEditing
        ? `/api/meal-plans/${mealPlanId}/entries/${initialData!._id}`
        : `/api/meal-plans/${mealPlanId}/entries`;

      const method = isEditing ? "PATCH" : "POST";

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
      onSuccess(data.entry);

      if (!isEditing) {
        // reset for add flow
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

      {/* Recipe picker (dropdown + free text ID) */}
      <label className={styles.label}>
        Recipe
        <div className={styles.recipeRow}>
          <select
            className={styles.select}
            value={recipeId}
            onChange={(e) => setRecipeId(e.target.value)}
          >
            <option value="">— Select a recipe —</option>
            {sortedRecipes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            className={styles.input}
            placeholder="…or paste Recipe ID"
            value={recipeId}
            onChange={(e) => setRecipeId(e.target.value)}
          />
        </div>
      </label>

      <label className={styles.label}>
        Day of Week
        <select
          className={styles.select}
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Meal Type
        <select
          className={styles.select}
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
        >
          {MEAL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Servings
        <input
          type="number"
          min={1}
          className={styles.input}
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
        />
      </label>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading
            ? isEditing
              ? "Updating…"
              : "Adding…"
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
