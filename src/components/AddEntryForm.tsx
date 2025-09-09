// path: src/components/AddEntryForm.tsx
"use client";

import React, { useState } from "react";

interface AddEntryFormProps {
  day: string;
  availableRecipes: { _id: string; name: string }[];
}

export default function AddEntryForm({
  day,
  availableRecipes,
}: AddEntryFormProps) {
  const [recipeId, setRecipeId] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [servings, setServings] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Add entry:", { day, recipeId, mealType, servings });
    // TODO: call API to add entry
    setRecipeId("");
    setMealType("Breakfast");
    setServings(1);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "0.5rem" }}>
      <select
        value={recipeId}
        onChange={(e) => setRecipeId(e.target.value)}
        required
      >
        <option value="">Select recipe</option>
        {availableRecipes.map((r) => (
          <option key={r._id} value={r._id}>
            {r.name}
          </option>
        ))}
      </select>
      <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
        {["Breakfast", "Lunch", "Dinner", "Snack"].map((meal) => (
          <option key={meal} value={meal}>
            {meal}
          </option>
        ))}
      </select>
      <input
        type="number"
        min={1}
        value={servings}
        onChange={(e) => setServings(Number(e.target.value))}
        style={{ width: "3rem" }}
      />
      <button type="submit">Add</button>
    </form>
  );
}
