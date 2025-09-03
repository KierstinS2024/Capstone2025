// path: src/app/recipes/new/page.tsx
/**
 * Create Recipe Page
 * ------------------
 * Lets the user create a new recipe.
 * Form includes:
 *  - Name, description, cuisine
 *  - Dynamic list of ingredients (ingredientId, quantity, unit)
 *  - Dynamic list of instructions
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewRecipePage() {
  const router = useRouter();

  // Local state for form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Add a new ingredient row
  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { ingredientId: "", quantity: 1, unit: "" },
    ]);
  };

  // Update ingredient fields
  const handleIngredientChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...ingredients];
    (updated[index] as any)[field] = value;
    setIngredients(updated);
  };

  // Remove ingredient row
  const handleRemoveIngredient = (index: number) => {
    const updated = [...ingredients];
    updated.splice(index, 1);
    setIngredients(updated);
  };

  // Add a new instruction
  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  // Update instruction text
  const handleInstructionChange = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  // Remove instruction
  const handleRemoveInstruction = (index: number) => {
    const updated = [...instructions];
    updated.splice(index, 1);
    setInstructions(updated);
  };

  // Save new recipe to backend
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          description,
          cuisine,
          ingredients,
          instructions,
        }),
      });

      if (res.ok) {
        router.push("/recipes");
      } else {
        console.error("Failed to create recipe");
      }
    } catch (err) {
      console.error("Error creating recipe:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Recipe</h1>

      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <div>
        <label>
          Description:
          <textarea
            value={description}
            rows={3}
            cols={40}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Cuisine:
          <input
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
        </label>
      </div>

      <h2>Ingredients</h2>
      {ingredients.map((ing, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Ingredient ID"
            value={ing.ingredientId}
            onChange={(e) =>
              handleIngredientChange(idx, "ingredientId", e.target.value)
            }
          />
          <input
            type="number"
            min="0"
            value={ing.quantity}
            onChange={(e) =>
              handleIngredientChange(
                idx,
                "quantity",
                parseFloat(e.target.value)
              )
            }
          />
          <input
            type="text"
            placeholder="Unit"
            value={ing.unit}
            onChange={(e) =>
              handleIngredientChange(idx, "unit", e.target.value)
            }
          />
          <button
            type="button"
            onClick={() => handleRemoveIngredient(idx)}
            style={{ marginLeft: "10px" }}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddIngredient}>
        + Add Ingredient
      </button>

      <h2>Instructions</h2>
      {instructions.map((instr, idx) => (
        <div key={idx} style={{ marginBottom: "10px" }}>
          <textarea
            rows={2}
            cols={40}
            value={instr}
            onChange={(e) => handleInstructionChange(idx, e.target.value)}
          />
          <button
            type="button"
            onClick={() => handleRemoveInstruction(idx)}
            style={{ marginLeft: "10px" }}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddInstruction}>
        + Add Instruction
      </button>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Recipe"}
        </button>
      </div>
    </div>
  );
}
