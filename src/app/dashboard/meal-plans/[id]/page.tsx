// path: src/app/dashboard/meal-plans/[id]/page.tsx
"use client";

/**
 * MealPlanDetailPage
 *
 * Shows detailed view of a meal plan with ability to edit notes, date, and entries.
 * Fully typed with TypeScript and uses MealPlanContext.
 */

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useMealPlanContext,
  MealPlan,
  MealPlanEntry,
} from "@/context/MealPlanContext";
import MealPlanEntryForm from "@/components/MealPlanEntryForm";
import EditMealPlanEntryModal from "@/components/EditMealPlanEntryModal";
import styles from "./MealPlanDetailPage.module.css";

export default function MealPlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { mealPlans, setMealPlans } = useMealPlanContext();

  const planId = typeof params.id === "string" ? params.id : "";
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MealPlanEntry | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Redirect to login if no token
  useEffect(() => {
    if (!token) router.push("/auth/login");
  }, [token, router]);

  // Fetch meal plan
  useEffect(() => {
    if (!planId || !token) return;

    const fetchMealPlan = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/meal-plans/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch meal plan");

        setMealPlan(data.mealPlan);
        setWeekStartDate(
          new Date(data.mealPlan.weekStartDate).toISOString().slice(0, 10)
        );
        setNotes(data.mealPlan.notes || "");
      } catch (err: any) {
        setError(err.message || "Error loading meal plan");
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [planId, token]);

  // Update meal plan info
  const handleUpdatePlan = async () => {
    if (!mealPlan || !token) return;

    try {
      const res = await fetch(`/api/meal-plans/${planId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weekStartDate, notes }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to update meal plan");

      setMealPlan(data.mealPlan);
      setMealPlans(
        mealPlans.map((plan) => (plan._id === planId ? data.mealPlan : plan))
      );
      alert("Meal plan updated successfully!");
    } catch (err: any) {
      alert(err.message || "Error updating meal plan");
    }
  };

  // Delete an entry
  const handleDeleteEntry = async (entryId: string) => {
    if (!mealPlan || !token) return;
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(`/api/meal-plans/${planId}/entries/${entryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete entry");

      setMealPlan({
        ...mealPlan,
        entries: mealPlan.entries.filter((e) => e._id !== entryId),
      });
    } catch (err: any) {
      alert(err.message || "Error deleting entry");
    }
  };

  // Add or edit entry callback
  const handleEntrySuccess = (entry: MealPlanEntry) => {
    if (!mealPlan) return;

    const exists = mealPlan.entries.find((e) => e._id === entry._id);
    const updatedEntries = exists
      ? mealPlan.entries.map((e) => (e._id === entry._id ? entry : e))
      : [...mealPlan.entries, entry];

    setMealPlan({ ...mealPlan, entries: updatedEntries });
    setShowAddForm(false);
    setEditingEntry(null);
  };

  if (loading) return <p className={styles.message}>Loading meal plan...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!mealPlan) return <p className={styles.error}>Meal plan not found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Meal Plan Details</h1>

      {/* Meal Plan Info */}
      <div className={styles.formGroup}>
        <label>Week Start Date:</label>
        <input
          type="date"
          value={weekStartDate}
          onChange={(e) => setWeekStartDate(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
        />
      </div>

      <button className={styles.updateButton} onClick={handleUpdatePlan}>
        Update Meal Plan
      </button>

      {/* Entries */}
      <h2 className={styles.subtitle}>Entries</h2>

      {showAddForm ? (
        <MealPlanEntryForm
          mealPlanId={planId}
          token={token!}
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

      {mealPlan.entries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        <ul className={styles.entryList}>
          {mealPlan.entries.map((entry) => (
            <li key={entry._id} className={styles.entryItem}>
              <strong>
                {entry.dayOfWeek} - {entry.mealType}
              </strong>
              <p>Recipe ID: {entry.recipeId}</p>
              <p>Servings: {entry.servings}</p>
              <div className={styles.entryButtons}>
                <button
                  className={styles.editButton}
                  onClick={() => setEditingEntry(entry)}
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
            </li>
          ))}
        </ul>
      )}

      {/* Edit Modal */}
      {editingEntry && (
        <EditMealPlanEntryModal
          isOpen={!!editingEntry}
          onClose={() => setEditingEntry(null)}
          entry={editingEntry}
          mealPlanId={mealPlan._id}
          token={token!}
          onUpdate={handleEntrySuccess}
        />
      )}
    </div>
  );
}
