"use client";
/**
 * NewFoodIntakePage
 * -----------------
 * Logs what user eats in a given day.
 * Each entry = { recipeId, mealType, portionSize }.
 * Date is auto-added (current day).
 * Sends to /api/food-intake.
 */

import { useState, useEffect } from "react";

export default function NewFoodIntakePage() {
  // Recipes for dropdown
  const [recipes, setRecipes] = useState<any[]>([]);

  // Intake entries
  const [entries, setEntries] = useState([
    { recipeId: "", mealType: "Breakfast", portionSize: 1 },
  ]);

  useEffect(() => {
    fetch("/api/recipes")
      .then((r) => r.json())
      .then((data) => setRecipes(data));
  }, []);

  // Update entry
  const handleChange = (i: number, field: string, value: string | number) => {
    const updated = [...entries];
    updated[i][field as keyof (typeof updated)[0]] = value as never;
    setEntries(updated);
  };

  // Save intake
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/food-intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: new Date().toISOString(), entries }),
    });
    if (res.ok) {
      alert("✅ Food intake saved!");
    } else {
      alert("❌ Error saving intake");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Log Today’s Food Intake</h1>

      {entries.map((entry, i) => (
        <div key={i}>
          {/* Choose recipe */}
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

          {/* Portion size */}
          <input
            type="number"
            min="1"
            value={entry.portionSize}
            onChange={(e) =>
              handleChange(i, "portionSize", Number(e.target.value))
            }
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setEntries([
            ...entries,
            { recipeId: "", mealType: "Breakfast", portionSize: 1 },
          ])
        }
      >
        + Add Another Meal
      </button>

      <button type="submit">Save Intake</button>
    </form>
  );
}
