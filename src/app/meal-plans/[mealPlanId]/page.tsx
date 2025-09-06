// path: src/app/meal-plans/[mealPlanId]/page.tsx
/**
 * EditMealPlanPage.tsx
 * --------------------
 * Allows editing an existing meal plan, including:
 *  - Week start date
 *  - Notes
 *  - Meal entries (recipe, day, meal type, servings)
 * Features:
 *  - Fetches recipes from /api/recipes for dropdown
 *  - Validation:
 *      - No empty recipeId
 *      - No duplicate day+mealType
 *      - Servings >= 1
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

interface MealEntry {
  recipeId: string;
  dayOfWeek: string;
  mealType: string;
  servings: number;
}

export default function EditMealPlanPage() {
  const { mealPlanId } = useParams();
  const router = useRouter();

  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch recipes and meal plan data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const client = getApiClient(token);

        const [recipesRes, planRes] = await Promise.all([
          client.get("/recipes"),
          client.get(`/meal-plans/${mealPlanId}`),
        ]);

        setRecipes(recipesRes.data || []);

        const planData = planRes.data;
        setWeekStartDate(planData.weekStartDate.split("T")[0]);
        setNotes(planData.notes || "");
        setEntries(
          planData.entries?.map((e: any) => ({
            recipeId: e.recipeId,
            dayOfWeek: e.dayOfWeek,
            mealType: e.mealType,
            servings: e.servings ?? 1,
          })) || []
        );
      } catch (err: any) {
        console.error(err);
        setError("Failed to load meal plan or recipes.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mealPlanId]);

  // Update entry field
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
      { recipeId: "", dayOfWeek: "Monday", mealType: "Breakfast", servings: 1 },
    ]);
  };

  const handleRemoveEntry = (index: number) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };

  // Validate entries before saving
  const validateEntries = (): string | null => {
    const seen = new Set<string>();
    for (const entry of entries) {
      if (!entry.recipeId) return "All entries must have a recipe selected.";
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
      const token = localStorage.getItem("token") || "";
      const client = getApiClient(token);
      await client.put(`/meal-plans/${mealPlanId}`, {
        weekStartDate,
        notes,
        entries,
      });
      router.push("/meal-plans");
    } catch (err: any) {
      console.error(err);
      setError("Failed to save meal plan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading meal plan…</p>;

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
            {/* Recipe Dropdown */}
            <select
              value={entry.recipeId}
              onChange={(e) =>
                handleEntryChange(idx, "recipeId", e.target.value)
              }
            >
              <option value="">--Select Recipe--</option>
              {recipes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.title}
                </option>
              ))}
            </select>

            {/* Day of Week */}
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
                <option key={d}>{d}</option>
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
                <option key={m}>{m}</option>
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
