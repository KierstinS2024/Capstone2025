// path: src/components/GenerateShoppingList.tsx
"use client";

import React, { useState } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";

export default function GenerateShoppingList() {
  const { mealPlans } = useMealPlan();
  const { addItem } = useShoppingList();
  const [selectedDate, setSelectedDate] = useState("");
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState("");

  const handleGenerate = async () => {
    if (!selectedDate) return;
    const plan = mealPlans.find((mp) => mp.date === selectedDate);
    if (!plan) return;

    setGenerating(true);
    try {
      for (const meal of plan.meals) {
        await addItem(meal.name, "other"); // category is "other" for simplicity
      }
      setSuccess(`Shopping list generated from ${selectedDate}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  if (!mealPlans || mealPlans.length === 0) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ marginRight: 8 }}>Generate from Meal Plan:</label>
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
        onClick={handleGenerate}
        disabled={generating || !selectedDate}
        style={{
          padding: "6px 12px",
          borderRadius: 4,
          border: "none",
          backgroundColor: "#0070f3",
          color: "#fff",
          cursor: generating || !selectedDate ? "not-allowed" : "pointer",
        }}
      >
        {generating ? "Generating..." : "Generate"}
      </button>
      {success && <p style={{ color: "green", marginTop: 6 }}>{success}</p>}
    </div>
  );
}
