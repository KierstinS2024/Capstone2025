// src/app/dashboard/meal-plans/[id]/page.tsx
"use client";

/**
 * MealPlanDetailPage
 *
 * Displays a single meal plan in detail.
 * Allows editing the plan's notes and weekStartDate.
 * Lists entries with add/edit/delete capabilities using MealPlanEntryForm.
 * Implements best practices for TypeScript and App Router.
 */

import { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { MealPlanContext } from "@/context/MealPlanContext";
import MealPlanEntryForm from "@/components/MealPlanEntryForm";
import styles from "./MealPlanDetailPage.module.css";

interface MealPlanEntry {
  _id: string;
  recipeId: string;
  mealType: string;
  dayOfWeek: string;
  servings: number;
}

interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes: string;
  entries: MealPlanEntry[];
}

export default function MealPlanDetailPage() {
  const params = useParams();
  const { mealPlans, setMealPlans } = useContext(MealPlanContext);

  // Narrow planId to string safely
  const rawPlanId = params.id;
  const planId = typeof rawPlanId === "string" ? rawPlanId : undefined;

  if (!planId) {
    return <p className={styles.error}>Invalid meal plan ID.</p>;
  }

  // Token from localStorage (client-side only)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) {
    return (
      <p className={styles.error}>You must be logged in to view this page.</p>
    );
  }

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [notes, setNotes] = useState("");
  const [weekStartDate, setWeekStartDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // Fetch meal plan details
  useEffect(() => {
    async function fetchMealPlan() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/meal-plans/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.message || "Failed to fetch meal plan");

        setMealPlan(data.mealPlan);
        setNotes(data.mealPlan.notes || "");
        setWeekStartDate(
          new Date(data.mealPlan.weekStartDate).toISOString().slice(0, 10)
        );
      } catch (err: any) {
        setError(err.message || "Error loading meal plan");
      } finally {
        setLoading(false);
      }
    }

    fetchMealPlan();
  }, [planId, token]);

  // Update meal plan notes and weekStartDate
  const handleUpdatePlan = async () => {
    if (!mealPlan) return;

    try {
      const res = await fetch(`/api/meal-plans/${planId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes, weekStartDate }),
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Failed to update meal plan");

      setMealPlan(data.mealPlan);

      // Sync with global context
      setMealPlans(
        mealPlans.map((plan) => (plan._id === planId ? data.mealPlan : plan))
      );

      alert("Meal plan updated successfully!");
    } catch (err: any) {
      alert(err.message || "Error updating meal plan");
    }
  };

  // Delete a meal plan entry
  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(`/api/meal-plans/${planId}/entries/${entryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete entry");

      setMealPlan({
        ...mealPlan!,
        entries: mealPlan!.entries.filter((entry) => entry._id !== entryId),
      });
    } catch (err: any) {
      alert(err.message || "Error deleting entry");
    }
  };

  // Handle successful add/edit of an entry
  const handleEntrySuccess = (entry: MealPlanEntry) => {
    if (!mealPlan) return;

    const exists = mealPlan.entries.find((e) => e._id === entry._id);
    if (exists) {
      setMealPlan({
        ...mealPlan,
        entries: mealPlan.entries.map((e) => (e._id === entry._id ? entry : e)),
      });
    } else {
      setMealPlan({ ...mealPlan, entries: [...mealPlan.entries, entry] });
    }

    setShowAddForm(false);
    setEditingEntryId(null);
  };

  // Loading/Error UI
  if (loading) return <p className={styles.message}>Loading meal plan...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!mealPlan) return <p className={styles.error}>Meal plan not found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Meal Plan Details</h1>

      {/* Editable meal plan info */}
      <div className={styles.formGroup}>
        <label>
          Week Start Date:
          <input
            type="date"
            value={weekStartDate}
            onChange={(e) => setWeekStartDate(e.target.value)}
          />
        </label>
      </div>

      <div className={styles.formGroup}>
        <label>
          Notes:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes for this week..."
          />
        </label>
      </div>

      <button className={styles.updateButton} onClick={handleUpdatePlan}>
        Update Meal Plan
      </button>

      <h2 className={styles.subtitle}>Entries</h2>

      {/* Add new entry */}
      {showAddForm ? (
        <MealPlanEntryForm
          mealPlanId={planId} // guaranteed string
          token={token}
          onSuccess={handleEntrySuccess}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <button
          className={styles.addButton}
          onClick={() => setShowAddForm(true)}
        >
          + Add New Entry
        </button>
      )}

      {/* Entries list */}
      {mealPlan.entries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        <ul className={styles.entryList}>
          {mealPlan.entries.map((entry) => (
            <li key={entry._id} className={styles.entryItem}>
              <strong>
                {entry.dayOfWeek} - {entry.mealType}
              </strong>
              <p>Servings: {entry.servings}</p>

              <div className={styles.entryButtons}>
                <button
                  className={styles.editButton}
                  onClick={() => setEditingEntryId(entry._id)}
                >
                  Edit
                </button>

                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteEntry(entry._id)}
                >
                  Delete
                </button>
              </div>

              {/* Inline edit form */}
              {editingEntryId === entry._id && (
                <MealPlanEntryForm
                  mealPlanId={planId}
                  token={token}
                  initialData={entry}
                  onSuccess={handleEntrySuccess}
                  onCancel={() => setEditingEntryId(null)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
