// src/app/dashboard/meal-plans/create/page.tsx

"use client";

/**
 * CreateMealPlanPage
 *
 * Provides a form to create a new meal plan.
 * After creation, adds the new plan to MealPlanContext and navigates to its detail page.
 */

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { MealPlanContext } from "@/context/MealPlanContext";
import styles from "./CreateMealPlanPage.module.css";

export default function CreateMealPlanPage() {
  const router = useRouter();
  const { mealPlans, setMealPlans } = useContext(MealPlanContext);

  // Form state
  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Grab JWT token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /**
   * Handle form submission to create a new meal plan
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return router.push("/auth/login");

    if (!weekStartDate) {
      setError("Please select a start date for the week.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call API to create new meal plan
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

      // Add the new plan to global context
      setMealPlans([data.mealPlan, ...mealPlans]);

      // Navigate to the new meal plan detail page
      router.push(`/dashboard/meal-plans/${data.mealPlan._id}`);
    } catch (err: any) {
      setError(err.message || "Error creating meal plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create New Meal Plan</h1>

      {/* Display error if present */}
      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Week start date */}
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

        {/* Notes */}
        <label className={styles.label}>
          Notes (optional)
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={styles.textarea}
            placeholder="Add any notes for this week..."
          />
        </label>

        {/* Submit button */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Meal Plan"}
        </button>
      </form>
    </div>
  );
}
