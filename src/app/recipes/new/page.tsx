// path: src/app/recipes/new/page.tsx
/**
 * Create Recipe Page
 * ------------------
 * Allows the user to add a new recipe.
 * User can:
 *  - Enter recipe name and description
 *  - Add ingredients with quantity and unit
 *  - Add instructions
 *  - Save recipe to the backend
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewRecipePage() {
  const router = useRouter();

  // Local form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<
    { ingredientId: string; quantity: number; unit: string }[]
  >([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Add new empty ingredient
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

  // Add new instruction step
  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  // Update a specific instruction
  const handleInstructionChange = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  // Save new recipe to backend
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, description, ingredients, instructions }),
      });

      if (res.ok) {
        router.push("/recipes"); // Go back to recipes list
      } else {
        console.error("Failed to create recipe");
      }
    } catch (err) {
      console.error("Error creating recipe:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Recipe</h1>

      {/* Recipe Name */}
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      {/* Recipe Description */}
      <div>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            cols={40}
          />
        </label>
      </div>

      {/* Ingredients List */}
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
            min="1"
            placeholder="Quantity"
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
        </div>
      ))}
      <button onClick={handleAddIngredient}>+ Add Ingredient</button>

      {/* Instructions List */}
      <h2>Instructions</h2>
      {instructions.map((inst, idx) => (
        <div key={idx}>
          <textarea
            value={inst}
            onChange={(e) => handleInstructionChange(idx, e.target.value)}
            rows={2}
            cols={50}
            placeholder={`Step ${idx + 1}`}
          />
        </div>
      ))}
      <button onClick={handleAddInstruction}>+ Add Instruction</button>

      {/* Save Recipe */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Recipe"}
        </button>
      </div>
    </div>
  );
}
