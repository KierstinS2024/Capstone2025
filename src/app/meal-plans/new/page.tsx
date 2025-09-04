// path: src/app/meal-plans/new/page.tsx
/**
 * NewMealPlanPage.tsx
 * -------------------
 * Create a new meal plan.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

export default function NewMealPlanPage() {
  const router = useRouter();
  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      { recipeId: "", dayOfWeek: "Monday", mealType: "Breakfast", servings: 1 },
    ]);
  };

  const handleEntryChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...entries];
    (updated[index] as any)[field] = value;
    setEntries(updated);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.post("/meal-plans", { weekStartDate, notes, entries });
      router.push("/meal-plans");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Create Meal Plan</h1>
        <label>
          Week Start Date:{" "}
          <input
            type="date"
            value={weekStartDate}
            onChange={(e) => setWeekStartDate(e.target.value)}
          />
        </label>
        <label>
          Notes:{" "}
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
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
            <input
              type="text"
              placeholder="Recipe ID"
              value={entry.recipeId}
              onChange={(e) =>
                handleEntryChange(idx, "recipeId", e.target.value)
              }
            />
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
              ].map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>
            <select
              value={entry.mealType}
              onChange={(e) =>
                handleEntryChange(idx, "mealType", e.target.value)
              }
            >
              {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                <option key={meal}>{meal}</option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={entry.servings}
              onChange={(e) =>
                handleEntryChange(idx, "servings", parseInt(e.target.value))
              }
            />
          </div>
        ))}
        <button onClick={handleAddEntry}>+ Add Entry</button>
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Meal Plan"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
