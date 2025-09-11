// src/components/AddRecipeForm.tsx
"use client";

import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import type { RecipeIngredient } from "@/types/recipe";

interface AddRecipeFormProps {
  onClose: () => void;
}

export const AddRecipeForm: React.FC<AddRecipeFormProps> = ({ onClose }) => {
  const { createRecipe } = useRecipes();

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { name: "", quantity: "", unit: "" },
  ]);

  const handleIngredientChange = (
    index: number,
    field: keyof RecipeIngredient,
    value: string
  ) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", quantity: "", unit: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !instructions || ingredients.length === 0) {
      alert("Please fill out all required fields.");
      return;
    }

    await createRecipe({ title, instructions, ingredients });
    onClose();
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: 24,
        borderRadius: 8,
        minWidth: 400,
      }}
    >
      <h2 className="text-xl font-bold mb-4">Add New Recipe</h2>

      <div className="mb-2">
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div className="mb-2">
        <label>Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div className="mb-2">
        <h3>Ingredients</h3>
        {ingredients.map((ing, idx) => (
          <div key={idx} className="flex gap-2 mb-1">
            <input
              placeholder="Name"
              value={ing.name}
              onChange={(e) =>
                handleIngredientChange(idx, "name", e.target.value)
              }
              className="border px-2 py-1 rounded flex-1"
            />
            <input
              placeholder="Qty"
              value={ing.quantity}
              onChange={(e) =>
                handleIngredientChange(idx, "quantity", e.target.value)
              }
              className="border px-2 py-1 rounded w-20"
            />
            <input
              placeholder="Unit"
              value={ing.unit}
              onChange={(e) =>
                handleIngredientChange(idx, "unit", e.target.value)
              }
              className="border px-2 py-1 rounded w-20"
            />
            <button
              onClick={() => removeIngredient(idx)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              X
            </button>
          </div>
        ))}
        <button
          onClick={addIngredient}
          className="mt-1 px-3 py-1 bg-green-500 text-white rounded"
        >
          Add Ingredient
        </button>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};
