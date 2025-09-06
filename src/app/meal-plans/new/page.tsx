// path: src/app/meal-plans/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MealPlanEntryForm, {
  MealPlanEntry,
  RecipeLite,
} from "@/components/MealPlanEntryForm";

export default function NewMealPlanPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<MealPlanEntry[]>([]);
  const [notes, setNotes] = useState("");
  const [recipes, setRecipes] = useState<RecipeLite[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  // Fetch all recipes for dropdown
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("/api/recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load recipes");
        const data = await res.json();
        setRecipes(data.data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching recipes");
      }
    };
    if (token) fetchRecipes();
  }, [token]);

  // Add new empty entry
  const handleAddEntry = () => {
    setEntries((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        dayOfWeek: "Monday",
        mealType: "Breakfast",
        recipeId: "",
        servings: 1,
      },
    ]);
  };

  // Update entry (called by MealPlanEntryForm)
  const handleUpdateEntry = (updated: MealPlanEntry) => {
    setEntries((prev) =>
      prev.map((e) => (e._id === updated._id ? updated : e))
    );
  };

  // Remove entry
  const handleRemoveEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e._id !== id));
  };

  // Validate entries before submit
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
          Authorization: `Bearer ${token}`,
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
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h1>Create Meal Plan</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>
        Notes:
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Optional notes for the week"
          style={{ width: "100%" }}
        />
      </label>

      <h2>Entries</h2>
      {entries.map((entry) => (
        <div
          key={entry._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "6px",
            position: "relative",
          }}
        >
          <MealPlanEntryForm
            token={token}
            initialData={entry}
            mealPlanId="new"
            onSuccess={handleUpdateEntry}
            onCancel={() => handleRemoveEntry(entry._id)}
          />
          <button
            type="button"
            onClick={() => handleRemoveEntry(entry._id)}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "red",
              color: "white",
              border: "none",
              padding: "2px 6px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddEntry}
        style={{ marginTop: "8px" }}
      >
        + Add Another Meal
      </button>

      <button
        type="submit"
        disabled={saving}
        style={{ marginTop: "20px", padding: "8px 16px" }}
      >
        {saving ? "Saving..." : "Save Meal Plan"}
      </button>
    </form>
  );
}
