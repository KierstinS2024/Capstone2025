// path: src/app/dashboard/meal-plans/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MealPlanEntryForm, {
  MealPlanEntryFormProps,
} from "@/components/MealPlanEntryForm";
import styles from "./MealPlanDetailPage.module.css";

interface MealPlanEntry {
  _id: string;
  recipeId: string;
  dayOfWeek: string;
  mealType: string;
  servings: number;
}

interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes?: string;
  entries: MealPlanEntry[];
}

export default function MealPlanDetailPage() {
  const router = useRouter();
  const { id: mealPlanId } = useParams<{ id: string }>();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Fetch meal plan on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return router.push("/auth/login");
    setToken(storedToken);

    const fetchMealPlan = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/meal-plans/${mealPlanId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!res.ok) throw new Error("Failed to load meal plan");
        const data = await res.json();
        setMealPlan(data.mealPlan);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error loading meal plan");
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [mealPlanId, router]);

  // Handle entry add/update
  const handleEntrySuccess = (entry: MealPlanEntry) => {
    setMealPlan((prev) => {
      if (!prev) return prev;
      const exists = prev.entries.find((e) => e._id === entry._id);
      if (exists) {
        // Update existing entry
        const updatedEntries = prev.entries.map((e) =>
          e._id === entry._id ? entry : e
        );
        return { ...prev, entries: updatedEntries };
      } else {
        // Add new entry
        return { ...prev, entries: [...prev.entries, entry] };
      }
    });
  };

  // Handle entry deletion
  const handleDeleteEntry = async (entryId: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(
        `/api/meal-plans/${mealPlanId}/entries/${entryId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete entry");
      setMealPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          entries: prev.entries.filter((e) => e._id !== entryId),
        };
      });
    } catch (err: any) {
      alert(err.message || "Error deleting entry");
    }
  };

  if (loading) return <p className={styles.message}>Loading meal plan...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!mealPlan) return <p className={styles.error}>Meal plan not found</p>;

  return (
    <main className={styles.container}>
      <h1>
        Meal Plan - Week of{" "}
        {new Date(mealPlan.weekStartDate).toLocaleDateString()}
      </h1>

      {mealPlan.notes && <p className={styles.notes}>{mealPlan.notes}</p>}

      <section className={styles.entriesSection}>
        <h2>Entries</h2>
        {mealPlan.entries.length === 0 ? (
          <p>No entries yet. Add one below!</p>
        ) : (
          <ul className={styles.entryList}>
            {mealPlan.entries.map((entry) => (
              <li key={entry._id} className={styles.entryItem}>
                <span>
                  {entry.dayOfWeek} - {entry.mealType} (Servings:{" "}
                  {entry.servings})
                </span>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteEntry(entry._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.formSection}>
        <h2>Add New Entry</h2>
        {token && (
          <MealPlanEntryForm
            mealPlanId={mealPlan._id}
            token={token}
            onSuccess={handleEntrySuccess}
          />
        )}
      </section>
    </main>
  );
}
