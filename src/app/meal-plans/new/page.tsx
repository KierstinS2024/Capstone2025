// path: src/app/meal-plans/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MealPlanEntryForm, {
  MealPlanEntryFormProps,
} from "@/components/MealPlanEntryForm";

// --- Type for new entries (no _id yet) ---
interface NewMealEntry {
  dayOfWeek: string;
  mealType: string;
  recipeId: string;
  servings: number;
}

export default function NewMealPlanPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<NewMealEntry[]>([
    { dayOfWeek: "Monday", mealType: "Breakfast", recipeId: "", servings: 1 },
  ]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleEntryChange = (
    index: number,
    updatedEntry: Partial<NewMealEntry>
  ) => {
    setEntries((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updatedEntry };
      return copy;
    });
  };

  const handleAddEntry = () => {
    setEntries((prev) => [
      ...prev,
      { dayOfWeek: "Monday", mealType: "Breakfast", recipeId: "", servings: 1 },
    ]);
  };

  const handleRemoveEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

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

  const handleSubmit = async () => {
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
    <div style={{ padding: "20px" }}>
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
          <MealPlanEntryForm
            mealPlanId="" // not needed for new meal plan
            token={localStorage.getItem("token") || ""}
            initialData={undefined} // new entry, no _id
            onSuccess={(savedEntry) => handleEntryChange(idx, savedEntry)}
            onCancel={() => handleRemoveEntry(idx)}
          />

          <button
            type="button"
            onClick={() => handleRemoveEntry(idx)}
            style={{ marginTop: "10px" }}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddEntry}
        style={{ marginTop: "10px" }}
      >
        + Add Another Meal
      </button>

      <div style={{ marginTop: "20px" }}>
        <button type="button" onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Meal Plan"}
        </button>
      </div>
    </div>
  );
}
