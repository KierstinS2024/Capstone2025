// path: src/app/meal-plans/[id]/page.tsx
/**
 * EditMealPlanPage
 * -----------------
 * Allows the user to edit an existing meal plan.
 * Features:
 *  - Edit week start date and notes
 *  - Add, edit, remove entries
 *  - Validations:
 *      - No empty recipeId
 *      - No duplicate dayOfWeek + mealType
 *      - Servings >= 1
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";

interface MealEntry {
  dayOfWeek: string;
  mealType: string;
  recipeId: string;
  servings: number;
}

export default function EditMealPlanPage() {
  const params = useParams();
  const router = useRouter();

  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load recipes and existing meal plan
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const [recipesRes, planRes] = await Promise.all([
          fetch("/api/recipes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`/api/meal-plans/${params.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!recipesRes.ok) throw new Error("Failed to load recipes");
        if (!planRes.ok) throw new Error("Failed to load meal plan");

        const recipesData = await recipesRes.json();
        setRecipes(recipesData.data || []);

        const planData = await planRes.json();
        setWeekStartDate(planData.data.weekStartDate.split("T")[0]);
        setNotes(planData.data.notes || "");
        setEntries(planData.data.entries || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

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

  // Validate entries before submitting
  const validateEntries = (): string | null => {
    const seen = new Set<string>();
    for (const entry of entries) {
      if (!entry.recipeId) return "All meals must have a recipe selected.";
      if (entry.servings < 1) return "Servings must be at least 1.";
      const key = `${entry.dayOfWeek}-${entry.mealType}`;
      if (seen.has(key))
        return `Duplicate meal for ${entry.dayOfWeek} ${entry.mealType}.`;
      seen.add(key);
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
      const res = await fetch(`/api/meal-plans/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ weekStartDate, notes, entries }),
      });

      if (!res.ok) throw new Error("Failed to save meal plan");
      router.push("/meal-plans");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error saving meal plan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading meal plan...</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Edit Meal Plan</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>
          Week Start Date:
          <input
            type="date"
            value={weekStartDate}
            onChange={(e) => setWeekStartDate(e.target.value)}
          />
        </label>

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
              onChange={(e) =>
                handleEntryChange(idx, "mealType", e.target.value)
              }
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
              onChange={(e) =>
                handleEntryChange(idx, "recipeId", e.target.value)
              }
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
          + Add Entry
        </button>

        <div style={{ marginTop: "20px" }}>
          <button type="button" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
