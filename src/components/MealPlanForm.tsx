// path: src/components/MealPlanForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMealPlanContext } from "@/context/MealPlanContext";
import styles from "./MealPlanForm.module.css";

interface MealPlanFormProps {
  onSuccess?: () => void; // optional callback after creating
}

export default function MealPlanForm({ onSuccess }: MealPlanFormProps) {
  const router = useRouter();
  const { mealPlans, setMealPlans } = useMealPlanContext();
  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return router.push("/auth/login");
    if (!weekStartDate) return setError("Please select a start date.");

    try {
      setLoading(true);
      const res = await fetch("/api/meal-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weekStartDate, notes }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok)
        throw new Error(data?.message || "Failed to create meal plan");

      setMealPlans([data.mealPlan, ...mealPlans]);
      if (onSuccess) onSuccess();
      router.push(`/dashboard/meal-plans/${data.mealPlan._id}`);
    } catch (err: any) {
      setError(err.message || "Error creating meal plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}

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
          placeholder="Add any notes for this week..."
          className={styles.textarea}
        />
      </label>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "Creating..." : "Create Meal Plan"}
      </button>
    </form>
  );
}
