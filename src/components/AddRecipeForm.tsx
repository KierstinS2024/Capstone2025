// src/components/AddRecipeForm.tsx
"use client";

import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import type { RecipeIngredient, CreateRecipePayload } from "@/types/recipe";

const AddRecipeForm: React.FC = () => {
  const { createRecipe } = useRecipes();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [instructions, setInstructions] = useState("");
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState("");
  const [ingredientUnit, setIngredientUnit] = useState("");

  const handleAddIngredient = () => {
    if (!ingredientName || !ingredientQuantity) return;

    const newIngredient: RecipeIngredient = {
      name: ingredientName,
      quantity: ingredientQuantity,
      unit: ingredientUnit || "",
    };

    setIngredients((prev) => [...prev, newIngredient]);

    setIngredientName("");
    setIngredientQuantity("");
    setIngredientUnit("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateRecipePayload = {
      title,
      ingredients,
      instructions,
      source: "local",
    };

    await createRecipe(payload);

    // Reset form
    setTitle("");
    setIngredients([]);
    setInstructions("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg shadow-md bg-white flex flex-col gap-4"
    >
      <h2 className="text-lg font-semibold">Add New Recipe</h2>

      {/* Title */}
      <input
        type="text"
        placeholder="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded px-2 py-1"
        required
      />

      {/* Ingredients */}
      <div>
        <h3 className="font-medium">Ingredients</h3>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Name"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
          />
          <input
            type="text"
            placeholder="Quantity"
            value={ingredientQuantity}
            onChange={(e) => setIngredientQuantity(e.target.value)}
            className="border rounded px-2 py-1 w-24"
          />
          <input
            type="text"
            placeholder="Unit"
            value={ingredientUnit}
            onChange={(e) => setIngredientUnit(e.target.value)}
            className="border rounded px-2 py-1 w-24"
          />
          <button
            type="button"
            onClick={handleAddIngredient}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>

        {/* Current ingredients */}
        <ul className="list-disc list-inside mt-2 text-sm">
          {ingredients.map((ing, idx) => (
            <li key={idx}>
              {ing.quantity} {ing.unit} {ing.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <textarea
        placeholder="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        className="border rounded px-2 py-1 min-h-[100px]"
      />

      {/* Submit */}
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Save Recipe
      </button>
    </form>
  );
};

export default AddRecipeForm;
