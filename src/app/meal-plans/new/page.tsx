// path: src/app/meal-plans/new/page.tsx
/**
 * Create Meal Plan Page
 * ----------------------
 * Lets the user build a new weekly meal plan.
 * They can add entries (recipe + day + meal type + servings),
 * and submit to save the plan in the backend.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewMealPlanPage() {
  const router = useRouter();

  // Local state for the form
  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Add an empty entry row to the plan
  const handleAddEntry = () => {
    setEntries([
      ...entries,
      { recipeId: "", dayOfWeek: "Monday", mealType: "Breakfast", servings: 1 },
    ]);
  };

  // Update a specific entry by index
  const handleEntryChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...entries];
    (updated[index] as any)[field] = value;
    setEntries(updated);
  };

  // Save new meal plan to backend
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/meal-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ weekStartDate, notes, entries }),
      });

      if (res.ok) {
        router.push("/meal-plans"); // Go back to meal plan list
      } else {
        console.error("Failed to create meal plan");
      }
    } catch (err) {
      console.error("Error creating meal plan:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Meal Plan</h1>

      {/* Week start date input */}
      <label>
        Week Start Date:
        <input
          type="date"
          value={weekStartDate}
          onChange={(e) => setWeekStartDate(e.target.value)}
        />
      </label>

      {/* Notes textarea */}
      <div>
        <label>
          Notes:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            cols={40}
          />
        </label>
      </div>

      {/* Dynamic list of entries */}
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
            onChange={(e) => handleEntryChange(idx, "recipeId", e.target.value)}
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
            onChange={(e) => handleEntryChange(idx, "mealType", e.target.value)}
          >
            {["Breakfast", "Lunch", "Dinner"].map((meal) => (
              <option key={meal}>{meal}</option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={entry.servings}
            onChange={(e) =>
              handleEntryChange(idx, "servings", parseInt(e.target.value))
            }
          />
        </div>
      ))}
      <button onClick={handleAddEntry}>+ Add Entry</button>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Meal Plan"}
        </button>
      </div>
    </div>
  );
}
