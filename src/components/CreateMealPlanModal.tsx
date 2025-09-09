// path: src/components/CreateMealPlanModal.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMealPlanContext, MealPlan } from "@/context/MealPlanContext";
import styles from "./CreateMealPlanModal.module.css";

interface CreateMealPlanModalProps {
  isOpen: boolean; // whether the modal is visible
  onClose: () => void; // function to close the modal
}

export default function CreateMealPlanModal({
  isOpen,
  onClose,
}: CreateMealPlanModalProps) {
  const router = useRouter();
  const { mealPlans, setMealPlans } = useMealPlanContext();

  // form state
  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // token from localStorage (only client-side)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // don't render if modal is closed
  if (!isOpen) return null;

  // submit new meal plan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ensure user is logged in
    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (!weekStartDate) {
      setError("Please select a week start date.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // call API to create meal plan
      const res = await fetch("/api/meal-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weekStartDate, notes }),
      });

      // parse error or response
      if (!res.ok) {
        let errMsg = "Failed to create meal plan";
        try {
          const errData = await res.json();
          errMsg = errData.message || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      const data: { mealPlan?: MealPlan } = await res.json();
      if (!data.mealPlan) throw new Error("Meal plan not returned from API");

      // update meal plan context
      setMealPlans([data.mealPlan, ...mealPlans]);

      // navigate to the new meal plan detail page
      router.push(`/dashboard/meal-plans/${data.mealPlan._id}`);

      // close the modal
      onClose();
    } catch (err: any) {
      setError(err.message || "Error creating meal plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    // overlay background, click outside to close
    <div className={styles.overlay} onClick={onClose}>
      {/* modal container, stop propagation so clicking inside doesn't close */}
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* close button */}
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.title}>Create New Meal Plan</h2>

        {/* show any error */}
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
