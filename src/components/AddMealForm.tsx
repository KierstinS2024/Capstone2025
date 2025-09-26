// src/components/AddMealForm.tsx
"use client";

import { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import "@/styles/addMealForm.module.css";

export default function AddMealForm({
  onAdd,
}: {
  onAdd: (id: string) => void;
}) {
  const { recipes } = useRecipes();
  const [selected, setSelected] = useState("");

  return (
    <div className="add-meal-form">
      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">Select recipe</option>
        {recipes.map((r) => (
          <option key={r.id} value={r.id}>
            {r.title}
          </option>
        ))}
      </select>
      <button onClick={() => selected && onAdd(selected)}>Add Meal</button>
    </div>
  );
}