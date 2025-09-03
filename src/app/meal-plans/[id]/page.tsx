// path: src/app/meal-plans/[id]/page.tsx
/**
 * Edit Meal Plan Page
 * --------------------
 * Loads an existing meal plan from the backend by ID.
 * Lets the user:
 *  - Update week start date
 *  - Edit notes
 *  - Add / edit / remove entries (recipe, day, meal type, servings)
 *  - Save changes back to the backend
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditMealPlanPage() {
  const params = useParams(); // read the dynamic :id param from URL
  const router = useRouter();

  // Local state for meal plan fields
  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing meal plan on mount
  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const res = await fetch(`/api/meal-plans/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (res.ok) {
          const data = await res.json();
          setWeekStartDate(
            data.data.weekStartDate ? data.data.weekStartDate.split("T")[0] : ""
          ); // trim time safely
          setNotes(data.data.notes || "");
          setEntries(data.data.entries || []);
        } else {
          console.error("Failed to load meal plan");
        }
      } catch (err) {
        console.error("Error fetching meal plan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [params.id]);

  // Update a field in an entry
  const handleEntryChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...entries];
    (updated[index] as any)[field] = value;
    setEntries(updated);
  };

  // Add a new blank entry row
  const handleAddEntry = () => {
    setEntries([
      ...entries,
      { recipeId: "", dayOfWeek: "Monday", mealType: "Breakfast", servings: 1 },
    ]);
  };

  // Remove an entry row
  const handleRemoveEntry = (index: number) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };

  // Save updated meal plan to backend
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/meal-plans/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ weekStartDate, notes, entries }),
      });

      if (res.ok) {
        router.push("/meal-plans"); // go back to list page
      } else {
        console.error("Failed to update meal plan");
      }
    } catch (err) {
      console.error("Error updating meal plan:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading meal plan...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Meal Plan</h1>

      {/* Week start date input */}
      <label>
        Week Start Date:
        <input
          type="date"
          value={weekStartDate}
          onChange={(e) => setWeekStartDate(e.target.value)}
        />
      </label>

      {/* Notes field */}
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

      {/* Entries list */}
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
          <button
            type="button"
            onClick={() => handleRemoveEntry(idx)}
            style={{ marginLeft: "10px" }}
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add entry button */}
      <button onClick={handleAddEntry}>+ Add Entry</button>

      {/* Save button */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
