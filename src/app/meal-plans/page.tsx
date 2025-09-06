// path: src/app/meal-plans/new/page.tsx
/**
 * NewMealPlanPage
 * -----------------
 * Allows the user to create a new weekly meal plan.
 * Each entry = { dayOfWeek, mealType, recipeId, servings }.
 * Validations:
 *  - No empty recipe selection
 *  - No duplicate day + mealType combinations
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface MealEntry {
  dayOfWeek: string;
  mealType: string;
  recipeId: string;
  servings: number;
}

export default function NewMealPlanPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [entries, setEntries] = useState<MealEntry[]>([
    { dayOfWeek: "Monday", mealType: "Breakfast", recipeId: "", servings: 1 },
  ]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load recipes for dropdown
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("/api/recipes", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to load recipes");

        const data = await res.json();
        setRecipes(data.data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching recipes");
      }
    };
    fetchRecipes();
  }, []);

  const handleEntryChange = (
    index: number,
    field: keyof MealEntry,
    value: string | number
  ) => {
    const updated = [...entries];
    (updated[index] as any)[field] = value;
    setEntries(updated);
  };

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      { dayOfWeek: "Monday", mealType: "Breakfast", recipeId: "", servings: 1 },
    ]);
  };

  const handleRemoveEntry = (index: number) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };

  // Validate entries before submission
  const validateEntries = (): string | null => {
    const seen = new Set<string>();
    for (const entry of entries) {
      if (!entry.recipeId) return "All meals must have a recipe selected.";
      const key = `${entry.dayOfWeek}-${entry.mealType}`;
      if (seen.has(key))
        return `Duplicate meal for ${entry.dayOfWeek} ${entry.mealType}.`;
      seen.add(key);
      if (entry.servings < 1) return "Servings must be at least 1.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEntries();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/meal-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ notes, entries }),
      });
      if (!res.ok) throw new Error("Failed to save meal plan");
      router.push("/meal-plans");
    } catch (err: any) {
      setError(err.message || "Error saving meal plan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
      <h1>Create Meal Plan</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>
        Notes:
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          cols={50}
          placeholder="Optional notes for the week"
        />
      </label>

      <h2>Entries</h2>
      {entries.map((entry, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {/* Day */}
          <select
            value={entry.dayOfWeek}
            onChange={(e) =>
              handleEntryChange(idx, "dayOfWeek", e.target.value)
            }
          >
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Meal Type */}
          <select
            value={entry.mealType}
            onChange={(e) => handleEntryChange(idx, "mealType", e.target.value)}
          >
            {["Breakfast", "Lunch", "Dinner", "Snack"].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Recipe */}
          <select
            value={entry.recipeId}
            onChange={(e) => handleEntryChange(idx, "recipeId", e.target.value)}
          >
            <option value="">--Pick Recipe--</option>
            {recipes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.title}
              </option>
            ))}
          </select>

          {/* Servings */}
          <input
            type="number"
            min={1}
            value={entry.servings}
            onChange={(e) =>
              handleEntryChange(idx, "servings", parseInt(e.target.value))
            }
          />

          <button
            type="button"
            onClick={() => handleRemoveEntry(idx)}
            style={{ marginLeft: "10px" }}
          >
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddEntry}>
        + Add Another Meal
      </button>
      <div style={{ marginTop: "20px" }}>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Meal Plan"}
        </button>
      </div>
    </form>
  );
}
