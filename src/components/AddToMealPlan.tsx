// path: src/components/AddToMealPlan.tsx
"use client";

import React, { useState } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import { RecipeDetail } from "@/types/recipe";

interface AddToMealPlanProps {
  recipe: RecipeDetail;
}

export default function AddToMealPlan({ recipe }: AddToMealPlanProps) {
  const { mealPlans, addMealToPlan } = useMealPlan();
  const [selectedDate, setSelectedDate] = useState("");
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState("");

  const handleAdd = async () => {
    if (!selectedDate) return;
    setAdding(true);
    try {
      await addMealToPlan(
        { id: recipe.id.toString(), name: recipe.title, description: "" },
        selectedDate
      );
      setSuccess(`Added "${recipe.title}" to ${selectedDate}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  if (!mealPlans || mealPlans.length === 0) return null;

  return (
    <div style={{ margin: "16px 0", padding: "12px", border: "1px solid #ccc", borderRadius: 6 }}>
      <label style={{ display: "block", marginBottom: 6 }}>
        Add to Meal Plan:
      </label>
      <select
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{ padding: "6px 8px", marginRight: 8, borderRadius: 4 }}
      >
        <option value="">Select a day</option>
        {mealPlans.map((plan) => (
          <option key={plan.date} value={plan.date}>
            {plan.date}
          </option>
        ))}
      </select>
      <button
        onClick={handleAdd}
        disabled={adding || !selectedDate}
        style={{
          padding: "6px 12px",
          borderRadius: 4,
          border: "none",
          backgroundColor: "#0070f3",
          color: "#fff",
          cursor: adding || !selectedDate ? "not-allowed" : "pointer",
        }}
      >
        {adding ? "Adding..." : "Add"}
      </button>
      {success && <p style={{ color: "green", marginTop: 6 }}>{success}</p>}
    </div>
  );
}
