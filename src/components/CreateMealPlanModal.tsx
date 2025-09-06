"use client";

/**
 * Modal for creating a new meal plan
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMealPlanContext } from "@/context/MealPlanContext";
import styles from "./CreateMealPlanModal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMealPlanModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const { mealPlans, setMealPlans } = useMealPlanContext();

  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return router.push("/auth/login");
    if (!weekStartDate) {
      setError("Please select a week start date.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/meal-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weekStartDate, notes }),
      });

      if (!res.ok) {
        let errMsg = "Failed to create meal plan";
        try {
          const errData = await res.json();
          errMsg = errData.message || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      const data = await res.json();
      if (!data?.mealPlan) throw new Error("Meal plan not returned");

      // Update context
      setMealPlans([data.mealPlan, ...mealPlans]);

      // Navigate to detail page
      router.push(`/dashboard/meal-plans/${data.mealPlan._id}`);

      // Close modal
      onClose();
    } catch (err: any) {
      setError(err.message || "Error creating meal plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.title}>Create New Meal Plan</h2>
        {error && <p className={styles.error}>{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Week Start Date
            <input
              type="date"
              value={weekStartDate}
              onChange={(e) => setWeekStartDate(e.target.value)}
              required
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Notes (optional)
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes for this week..."
              className={styles.textarea}
            />
          </label>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Meal Plan"}
          </button>
        </form>
      </div>
    </div>
  );
}
