// path: src/components/CreateMealPlanModal.tsx
"use client";

/**
 * CreateMealPlanModal
 *
 * Modal to create a new meal plan. Fully type-safe with MealPlanContext.
 */

import React, { useState } from "react";
import { useMealPlanContext, MealPlan } from "@/context/MealPlanContext";
import styles from "./CreateMealPlanModal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMealPlanModal({ isOpen, onClose }: Props) {
  const { setMealPlans } = useMealPlanContext();
  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weekStartDate) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/meal-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weekStartDate, notes }),
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Failed to create meal plan");

      // Prepend the new meal plan
      setMealPlans((prev) => [data.mealPlan as MealPlan, ...prev]);

      onClose();
      setWeekStartDate("");
      setNotes("");
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <form className={styles.modal} onSubmit={handleSubmit}>
        <h2 className={styles.title}>New Meal Plan</h2>

        <label className={styles.label}>Week Start Date</label>
        <input
          type="date"
          value={weekStartDate}
          onChange={(e) => setWeekStartDate(e.target.value)}
          required
          className={styles.input}
        />

        <label className={styles.label}>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={styles.textarea}
        />

        {error && (
          <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            className={`${styles.button} ${styles.cancel}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`${styles.button} ${styles.submit}`}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
