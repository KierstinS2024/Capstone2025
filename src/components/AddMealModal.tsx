// src/components/AddMealModal.tsx
"use client";

import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import type { Recipe } from "@/types/recipe";

interface AddMealModalProps {
  mealType: "Breakfast" | "Lunch" | "Dinner";
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

const AddMealModal: React.FC<AddMealModalProps> = ({
  mealType,
  onClose,
  onSelectRecipe,
}) => {
  const { recipes } = useRecipes(); // get recipes from context
  const [selected, setSelected] = useState<string | null>(null);

  const handleAdd = () => {
    if (!selected) return;
    const recipe = recipes.find((r) => r._id === selected);
    if (recipe) onSelectRecipe(recipe);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "24px",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <h2>Add {mealType}</h2>
        <select
          value={selected || ""}
          onChange={(e) => setSelected(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "12px" }}
        >
          <option value="">Select a recipe...</option>
          {recipes.map((r) => (
            <option key={r._id} value={r._id}>
              {r.title}
            </option>
          ))}
        </select>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleAdd}
            style={{
              backgroundColor: "#0070f3",
              color: "#fff",
              padding: "6px 12px",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMealModal;
