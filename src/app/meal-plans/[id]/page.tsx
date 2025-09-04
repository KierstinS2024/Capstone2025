// path: src/app/meal-plans/[id]/page.tsx
/**
 * Edit Meal Plan Page
 * -------------------
 * Edit existing meal plans.
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";

export default function EditMealPlanPage() {
  const params = useParams();
  const router = useRouter();
  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const res = await fetch(`/api/meal-plans/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setWeekStartDate(data.data.weekStartDate.split("T")[0]);
          setNotes(data.data.notes || "");
          setEntries(data.data.entries || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMealPlan();
  }, [params.id]);

  const handleEntryChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...entries];
    (updated[index] as any)[field] = value;
    setEntries(updated);
  };

  const handleAddEntry = () =>
    setEntries([
      ...entries,
      { recipeId: "", dayOfWeek: "Monday", mealType: "Breakfast", servings: 1 },
    ]);
  const handleRemoveEntry = (index: number) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };

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
      if (res.ok) router.push("/meal-plans");
    } catch (err) {
      console.error(err);
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
        <label>
          Week Start Date:{" "}
          <input
            type="date"
            value={weekStartDate}
            onChange={(e) => setWeekStartDate(e.target.value)}
          />
        </label>
        <div>
          <label>
            Notes:{" "}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              cols={40}
            />
          </label>
        </div>

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
              ].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              value={entry.mealType}
              onChange={(e) =>
                handleEntryChange(idx, "mealType", e.target.value)
              }
            >
              {["Breakfast", "Lunch", "Dinner"].map((m) => (
                <option key={m}>{m}</option>
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
            <button
              onClick={() => handleRemoveEntry(idx)}
              style={{ marginLeft: "10px" }}
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddEntry}>+ Add Entry</button>
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
