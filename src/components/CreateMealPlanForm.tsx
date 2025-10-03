// ===========================================
// PATH: src/components/CreateMealPlanForm.tsx
// Form for creating a new meal plan
// - Passes plain strings to context
// - Context handles date normalization
// ===========================================
"use client";

import React, { useState } from "react";
import { useMealPlans } from "@/context/MealPlanContext";
import styles from "@/styles/createMealPlanForm.module.css";

export default function CreateMealPlanForm() {
  const { createMealPlan, saving } = useMealPlans();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startDate) {
      setError("Please select a start date.");
      return;
    }

    if (endDate && endDate < startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      await createMealPlan(startDate, endDate);
    } catch (err: any) {
      setError(err.message || "Failed to create meal plan.");
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h3>Create a New Meal Plan</h3>

      {error && <p className={styles.error}>{error}</p>}

      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </label>

      <label>
        End Date (optional):
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate}
        />
      </label>

      <button type="submit" disabled={saving}>
        {saving ? "Creating..." : "Create Meal Plan"}
      </button>
    </form>
  );
}
