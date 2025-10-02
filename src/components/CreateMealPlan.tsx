// src/components/CreateMealPlan.tsx
"use client";

import React, { useState } from "react";
import { useMealPlans } from "@/context/MealPlanContext";
import styles from "@/styles/createMealPlan.module.css";

export default function CreateMealPlan() {
  const { createMealPlan, saving } = useMealPlans();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!startDate) {
      setError("Please select a start date.");
      return;
    }

    try {
      // Default to a 7-day plan if no endDate chosen
      const finalEndDate =
        endDate ||
        new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 6))
          .toISOString()
          .split("T")[0];

      // Safety: check ordering
      if (new Date(finalEndDate) < new Date(startDate)) {
        setError("End date cannot be before start date.");
        return;
      }

      await createMealPlan(startDate, finalEndDate);
    } catch (err: any) {
      setError(err.message || "Failed to create meal plan.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Create a Meal Plan</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>

        <label>
          End Date (optional)
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Creating..." : "Create Plan"}
        </button>
      </form>
    </div>
  );
}
