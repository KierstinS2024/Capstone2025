// src/app/dashboard/meal-plans/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./MealPlanDetailPage.module.css";

interface MealPlanEntry {
  _id?: string;
  recipeId: string;
  mealType: string;
  dayOfWeek: string;
  servings: number;
}

interface MealPlan {
  _id: string;
  userId: string;
  weekStartDate: string;
  notes: string;
  entries: MealPlanEntry[];
}

// Options for dropdowns
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function MealPlanDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [newEntry, setNewEntry] = useState<MealPlanEntry>({
    recipeId: "",
    mealType: "Breakfast",
    dayOfWeek: "Monday",
    servings: 1,
  });
  const [actionLoading, setActionLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function fetchMealPlan() {
      if (!token) return router.push("/auth/login");
      try {
        setLoading(true);
        const res = await fetch(`/api/meal-plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to load meal plan");
        setMealPlan(data.mealPlan);
        setNotes(data.mealPlan.notes || "");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error loading meal plan"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchMealPlan();
  }, [id, router, token]);

  const handleUpdateNotes = async () => {
    if (!token || !mealPlan) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/meal-plans/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update notes");
      setMealPlan(data.mealPlan);
      alert("Notes updated!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating notes");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!token || !mealPlan) return;
    const { recipeId, mealType, dayOfWeek, servings } = newEntry;
    if (!recipeId) return alert("Recipe ID is required");
    try {
      setActionLoading(true);
      const res = await fetch(`/api/meal-plans/${id}/entries`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add entry");
      setMealPlan((prev) =>
        prev ? { ...prev, entries: [...prev.entries, data.entry] } : prev
      );
      setNewEntry({
        recipeId: "",
        mealType: "Breakfast",
        dayOfWeek: "Monday",
        servings: 1,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error adding entry");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateEntry = async (entry: MealPlanEntry) => {
    if (!token || !mealPlan || !entry._id) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/meal-plans/${id}/entries/${entry._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update entry");
      setMealPlan((prev) =>
        prev
          ? {
              ...prev,
              entries: prev.entries.map((e) =>
                e._id === entry._id ? data.entry : e
              ),
            }
          : prev
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating entry");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!token || !mealPlan) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/meal-plans/${id}/entries/${entryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete entry");
      setMealPlan((prev) =>
        prev
          ? { ...prev, entries: prev.entries.filter((e) => e._id !== entryId) }
          : prev
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting entry");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className={styles.message}>Loading meal plan...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!mealPlan) return <p className={styles.message}>Meal plan not found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Meal Plan - Week of{" "}
        {new Date(mealPlan.weekStartDate).toLocaleDateString()}
      </h1>

      <div className={styles.notesSection}>
        <label>
          Notes:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={styles.textarea}
          />
        </label>
        <button
          disabled={actionLoading}
          onClick={handleUpdateNotes}
          className={styles.button}
        >
          {actionLoading ? "Updating..." : "Update Notes"}
        </button>
      </div>

      <h2 className={styles.sectionTitle}>Entries</h2>
      {mealPlan.entries.length === 0 ? (
        <p className={styles.emptyMessage}>No entries yet</p>
      ) : (
        <ul className={styles.entryList}>
          {mealPlan.entries.map((entry) => (
            <li key={entry._id} className={styles.entryItem}>
              <input
                type="text"
                value={entry.recipeId}
                onChange={(e) =>
                  setMealPlan((prev) =>
                    prev
                      ? {
                          ...prev,
                          entries: prev.entries.map((en) =>
                            en._id === entry._id
                              ? { ...en, recipeId: e.target.value }
                              : en
                          ),
                        }
                      : prev
                  )
                }
              />
              <select
                value={entry.mealType}
                onChange={(e) =>
                  setMealPlan((prev) =>
                    prev
                      ? {
                          ...prev,
                          entries: prev.entries.map((en) =>
                            en._id === entry._id
                              ? { ...en, mealType: e.target.value }
                              : en
                          ),
                        }
                      : prev
                  )
                }
              >
                {mealTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                value={entry.dayOfWeek}
                onChange={(e) =>
                  setMealPlan((prev) =>
                    prev
                      ? {
                          ...prev,
                          entries: prev.entries.map((en) =>
                            en._id === entry._id
                              ? { ...en, dayOfWeek: e.target.value }
                              : en
                          ),
                        }
                      : prev
                  )
                }
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={entry.servings}
                onChange={(e) =>
                  setMealPlan((prev) =>
                    prev
                      ? {
                          ...prev,
                          entries: prev.entries.map((en) =>
                            en._id === entry._id
                              ? { ...en, servings: Number(e.target.value) }
                              : en
                          ),
                        }
                      : prev
                  )
                }
              />
              <button
                disabled={actionLoading}
                onClick={() => handleUpdateEntry(entry)}
              >
                Update
              </button>
              <button
                disabled={actionLoading}
                onClick={() => handleDeleteEntry(entry._id!)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3 className={styles.sectionTitle}>Add New Entry</h3>
      <div className={styles.newEntryForm}>
        <input
          type="text"
          placeholder="Recipe ID"
          value={newEntry.recipeId}
          onChange={(e) =>
            setNewEntry({ ...newEntry, recipeId: e.target.value })
          }
        />
        <select
          value={newEntry.mealType}
          onChange={(e) =>
            setNewEntry({ ...newEntry, mealType: e.target.value })
          }
        >
          {mealTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={newEntry.dayOfWeek}
          onChange={(e) =>
            setNewEntry({ ...newEntry, dayOfWeek: e.target.value })
          }
        >
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          value={newEntry.servings}
          onChange={(e) =>
            setNewEntry({ ...newEntry, servings: Number(e.target.value) })
          }
        />
        <button disabled={actionLoading} onClick={handleAddEntry}>
          {actionLoading ? "Adding..." : "Add Entry"}
        </button>
      </div>
    </div>
  );
}
