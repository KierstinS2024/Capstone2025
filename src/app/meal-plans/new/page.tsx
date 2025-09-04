"use client";
/**
 * NewMealPlanPage
 * ---------------
 * Lets user create a weekly meal plan.
 * Each entry = { day, mealType, recipeId }.
 * Recipes are loaded from /api/recipes.
 */

import { useState, useEffect } from "react";

export default function NewMealPlanPage() {
  // List of recipes fetched from DB
  const [recipes, setRecipes] = useState<any[]>([]);

  // Entries: one for each planned meal
  const [entries, setEntries] = useState([
    { day: "Monday", mealType: "Breakfast", recipeId: "" },
  ]);

  // Fetch saved recipes to populate dropdown
  useEffect(() => {
    fetch("/api/recipes")
      .then((r) => r.json())
      .then((data) => setRecipes(data));
  }, []);

  // Update a meal plan entry
  const handleChange = (i: number, field: string, value: string) => {
    const updated = [...entries];
    updated[i][field as keyof (typeof updated)[0]] = value;
    setEntries(updated);
  };

  // Save plan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/meal-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries }),
    });
    if (res.ok) {
      alert("✅ Meal plan saved!");
    } else {
      alert("❌ Error saving meal plan");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create a Meal Plan</h1>

      {entries.map((entry, i) => (
        <div key={i}>
          {/* Day of the week */}
          <select
            value={entry.day}
            onChange={(e) => handleChange(i, "day", e.target.value)}
          >
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Meal type */}
          <select
            value={entry.mealType}
            onChange={(e) => handleChange(i, "mealType", e.target.value)}
          >
            {["Breakfast", "Lunch", "Dinner", "Snack"].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Recipe */}
          <select
            value={entry.recipeId}
            onChange={(e) => handleChange(i, "recipeId", e.target.value)}
          >
            <option value="">--Pick Recipe--</option>
            {recipes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setEntries([
            ...entries,
            { day: "Monday", mealType: "Breakfast", recipeId: "" },
          ])
        }
      >
        + Add Another Meal
      </button>

      <button type="submit">Save Meal Plan</button>
    </form>
  );
}
