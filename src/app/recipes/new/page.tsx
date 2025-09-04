// path: src/app/recipes/new/page.tsx
/**
 * Create Recipe Page
 * -----------------
 * Allows user to create a new recipe.
 * Features:
 *  - Name, description, cuisine
 *  - Ingredients list (ingredientId, quantity, unit)
 *  - Instructions (ordered list)
 *  - Nutrition info
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewRecipePage() {
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Add blank ingredient row
  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { ingredientId: "", quantity: 1, unit: "unit" },
    ]);
  };

  // Update ingredient
  const handleIngredientChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...ingredients];
    (updated[index] as any)[field] = value;
    setIngredients(updated);
  };

  // Remove ingredient
  const handleRemoveIngredient = (index: number) => {
    const updated = [...ingredients];
    updated.splice(index, 1);
    setIngredients(updated);
  };

  // Add instruction step
  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  // Update instruction
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

  // Submit recipe
  const handleSubmit = async () => {
    setLoading(true);
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
          userSubmitted: true,
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
      setLoading(false);
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
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            cols={40}
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

      {/* Ingredients */}
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
            value={ing.unit}
            onChange={(e) =>
              handleIngredientChange(idx, "unit", e.target.value)
            }
          />
          <button type="button" onClick={() => handleRemoveIngredient(idx)}>
            Remove
          </button>
        </div>
      ))}
      <button onClick={handleAddIngredient}>+ Add Ingredient</button>

      {/* Instructions */}
      <h2>Instructions</h2>
      {instructions.map((step, idx) => (
        <div key={idx} style={{ marginBottom: "10px" }}>
          <textarea
            rows={2}
            cols={40}
            value={step}
            onChange={(e) => handleInstructionChange(idx, e.target.value)}
          />
          <button type="button" onClick={() => handleRemoveInstruction(idx)}>
            Remove
          </button>
        </div>
      ))}
      <button onClick={handleAddInstruction}>+ Add Instruction</button>

      {/* Save button */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Recipe"}
        </button>
      </div>
    </div>
  );
}
