// path: src/app/recipes/new/page.tsx
/**
 * Create Recipe Page
 * ------------------
 * Lets the user create a new recipe.
 * Features:
 *  - Add recipe name, description, and cuisine
 *  - Dynamically add/remove ingredients with quantity and unit
 *  - Dynamically add/remove instructions
 *  - Submit recipe to backend
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewRecipePage() {
  const router = useRouter();

  // Local state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState<
    { name: string; quantity: number; unit: string }[]
  >([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Add blank ingredient
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: 1, unit: "" }]);
  };

  // Update ingredient field
  const handleIngredientChange = (
    index: number,
    field: "name" | "quantity" | "unit",
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

  // Add blank instruction
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

  // Submit recipe to backend
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
        }),
      });

      if (res.ok) {
        router.push("/recipes"); // Go back to list
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

      {/* Recipe name */}
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>

      {/* Recipe description */}
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

      {/* Cuisine */}
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
      {ingredients.map((ingredient, idx) => (
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
            placeholder="Name"
            value={ingredient.name}
            onChange={(e) =>
              handleIngredientChange(idx, "name", e.target.value)
            }
          />
          <input
            type="number"
            min="0"
            placeholder="Quantity"
            value={ingredient.quantity}
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
            value={ingredient.unit}
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
      <button onClick={handleAddIngredient}>+ Add Ingredient</button>

      {/* Instructions */}
      <h2>Instructions</h2>
      {instructions.map((inst, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <textarea
            value={inst}
            rows={2}
            cols={50}
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
      <button onClick={handleAddInstruction}>+ Add Instruction</button>

      {/* Submit */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Recipe"}
        </button>
      </div>
    </div>
  );
}
