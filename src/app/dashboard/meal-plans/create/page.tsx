// src/app/dashboard/meal-plans/create/page.tsx
"use client";

/**
 * CreateMealPlanPage
 *
 * Allows users to create a new meal plan
 * - Select a week start date
 * - Add optional notes
 * - POSTs to /api/meal-plans
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CreateMealPlanPage.module.css";

export default function CreateMealPlanPage() {
  const router = useRouter();
  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      router.push("/auth/login");
      return;
    }
    if (!weekStartDate) {
      setError("Please select a start date");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/meal-plans", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ weekStartDate, notes, entries: [] }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to create meal plan");

      alert("Meal plan created!");
      router.push(`/dashboard/meal-plans/${data.mealPlan._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating meal plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create New Meal Plan</h1>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Week Start Date:
          <input
            type="date"
            value={weekStartDate}
            onChange={(e) => setWeekStartDate(e.target.value)}
            className={styles.input}
            required
          />
        </label>

        <label>
          Notes (optional):
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={styles.textarea}
          />
        </label>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Create Meal Plan"}
        </button>
      </form>
    </div>
  );
}
