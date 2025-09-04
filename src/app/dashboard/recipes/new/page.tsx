// src/app/dashboard/recipes/new/page.tsx
"use client";
/**
 * NewRecipePage
 * -------------
 * Allows user to create and save their own recipe.
 * Fields: Title, Ingredients (dynamic), Instructions (dynamic), Cuisine dropdown.
 * Sends data to /api/recipes.
 */

import { useState } from "react";

export default function NewRecipePage() {
  // Recipe title
  const [title, setTitle] = useState("");

  // List of ingredients (each with name, quantity, unit)
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);

  // Cooking instructions (step-by-step text)
  const [instructions, setInstructions] = useState([""]);

  // Cuisine type
  const [cuisine, setCuisine] = useState("");

  // Update a single ingredient field
  const handleIngredientChange = (i: number, field: string, value: string) => {
    const updated = [...ingredients];
    updated[i][field as keyof (typeof updated)[0]] = value;
    setIngredients(updated);
  };

  // Update a single step of the instructions
  const handleInstructionChange = (i: number, value: string) => {
    const updated = [...instructions];
    updated[i] = value;
    setInstructions(updated);
  };

  // Save recipe to API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, ingredients, instructions, cuisine }),
    });

    if (res.ok) {
      alert("✅ Recipe saved!");
    } else {
      alert("❌ Error saving recipe");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add a New Recipe</h1>

      {/* Recipe Title */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Recipe Title"
      />

      {/* Ingredients Section */}
      <h3>Ingredients</h3>
      {ingredients.map((ing, i) => (
        <div key={i}>
          <input
            placeholder="Ingredient name"
            value={ing.name}
            onChange={(e) => handleIngredientChange(i, "name", e.target.value)}
          />
          <input
            placeholder="Quantity (e.g., 2)"
            value={ing.quantity}
            onChange={(e) =>
              handleIngredientChange(i, "quantity", e.target.value)
            }
          />
          <input
            placeholder="Unit (e.g., cups, tbsp)"
            value={ing.unit}
            onChange={(e) => handleIngredientChange(i, "unit", e.target.value)}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setIngredients([...ingredients, { name: "", quantity: "", unit: "" }])
        }
      >
        + Add Ingredient
      </button>

      {/* Instructions Section */}
      <h3>Instructions</h3>
      {instructions.map((step, i) => (
        <input
          key={i}
          placeholder={`Step ${i + 1}`}
          value={step}
          onChange={(e) => handleInstructionChange(i, e.target.value)}
        />
      ))}
      <button
        type="button"
        onClick={() => setInstructions([...instructions, ""])}
      >
        + Add Step
      </button>

      {/* Cuisine Dropdown */}
      <h3>Cuisine</h3>
      <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
        <option value="">--Choose Cuisine--</option>
        <option value="Italian">Italian</option>
        <option value="Mexican">Mexican</option>
        <option value="Indian">Indian</option>
        <option value="American">American</option>
      </select>

      {/* Submit */}
      <button type="submit">Save Recipe</button>
    </form>
  );
}
