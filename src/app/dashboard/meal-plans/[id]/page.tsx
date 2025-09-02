// src/app/dashboard/meal-plans/[id]/page.tsx
"use client";

/**
 * MealPlanDetailPage
 *
 * Displays a single meal plan
 * Allows updating notes and deleting the plan
 * Fetches data from /api/meal-plans/:id
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./MealPlanDetailPage.module.css";

interface MealPlanEntry {
  _id: string;
  mealType: string;
  dayOfWeek: string;
  recipeId: string;
}

interface MealPlan {
  _id: string;
  userId: string;
  weekStartDate: string;
  notes: string;
  entries: MealPlanEntry[];
}

interface PageProps {
  params: { id: string };
}

export default function MealPlanDetailPage({ params }: PageProps) {
  const { id } = params;
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function fetchMealPlan() {
      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/meal-plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load meal plan");
        const data = await res.json();
        setMealPlan(data.mealPlan);
        setNotes(data.mealPlan.notes);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching meal plan"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMealPlan();
  }, [id, router, token]);

  const handleUpdate = async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/meal-plans/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error("Failed to update meal plan");
      const data = await res.json();
      setMealPlan(data.mealPlan);
      alert("Meal plan updated!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating meal plan");
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this meal plan?")) return;

    try {
      const res = await fetch(`/api/meal-plans/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete meal plan");
      alert("Meal plan deleted!");
      router.push("/dashboard/meal-plans");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting meal plan");
    }
  };

  if (loading) return <p className={styles.message}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!mealPlan) return <p className={styles.error}>Meal plan not found</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Meal Plan: Week of{" "}
        {new Date(mealPlan.weekStartDate).toLocaleDateString()}
      </h1>

      <div className={styles.section}>
        <label>Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={styles.textarea}
        />
        <button onClick={handleUpdate} className={styles.button}>
          Update Notes
        </button>
      </div>

      <div className={styles.section}>
        <h2>Entries</h2>
        {mealPlan.entries.length === 0 ? (
          <p>No entries yet</p>
        ) : (
          <ul className={styles.list}>
            {mealPlan.entries.map((entry) => (
              <li key={entry._id}>
                {entry.dayOfWeek} - {entry.mealType} - Recipe ID:{" "}
                {entry.recipeId}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={handleDelete} className={styles.deleteButton}>
        Delete Meal Plan
      </button>
    </div>
  );
}
