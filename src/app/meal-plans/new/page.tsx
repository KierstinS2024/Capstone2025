// path: src/app/meal-plans/new/page.tsx
/**
 * New Meal Plan Page
 * -----------------
 * Form to create a new weekly meal plan with entries.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";

export default function NewMealPlanPage() {
  const router = useRouter();
  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      { recipeId: "", dayOfWeek: "Monday", mealType: "Breakfast", servings: 1 },
    ]);
  };

  const handleEntryChange = (index: number, field: string, value: any) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

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
      if (res.ok) router.push("/meal-plans");
      else console.error("Failed to create meal plan");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Create Meal Plan</h1>
        <label>Week Start Date:</label>
        <input
          type="date"
          value={weekStartDate}
          onChange={(e) => setWeekStartDate(e.target.value)}
        />
        <label>Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
        <h2>Entries</h2>
        {entries.map((entry, idx) => (
          <div key={idx}>
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
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Meal Plan"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
