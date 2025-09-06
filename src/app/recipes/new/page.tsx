//src/app/recipes/new/page.tsx
/**
 * NewRecipePage
 * -------------
 * Allows user to create a new recipe.
 * Validates inputs:
 *  - Name is required
 *  - Each ingredient must have an ID, quantity > 0, and unit
 *  - Each instruction must not be empty
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Ingredient {
  ingredientId: string;
  quantity: number;
  unit: string;
}

export default function NewRecipePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Ingredient handlers
  const handleAddIngredient = () =>
    setIngredients([
      ...ingredients,
      { ingredientId: "", quantity: 1, unit: "" },
    ]);
  const handleIngredientChange = (index: number, field: string, value: any) => {
    const updated = [...ingredients];
    (updated[index] as any)[field] = value;
    setIngredients(updated);
  };

  // Instruction handlers
  const handleAddInstruction = () => setInstructions([...instructions, ""]);
  const handleInstructionChange = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  // Validation
  const validate = (): boolean => {
    if (!name.trim()) {
      setErrorMessage("Recipe name is required");
      return false;
    }
    for (const ing of ingredients) {
      if (!ing.ingredientId.trim() || ing.quantity <= 0 || !ing.unit.trim()) {
        setErrorMessage(
          "All ingredients must have an ID, quantity > 0, and unit"
        );
        return false;
      }
    }
    for (const step of instructions) {
      if (!step.trim()) {
        setErrorMessage("All instruction steps must be filled in");
        return false;
      }
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

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
      if (res.ok) router.push("/recipes");
      else {
        const data = await res.json();
        setErrorMessage(data.message || "Failed to create recipe");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Recipe</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Name */}
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      {/* Description */}
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
            min={1}
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
      <button type="button" onClick={handleAddIngredient}>
        + Add Ingredient
      </button>

      {/* Instructions */}
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
      <button type="button" onClick={handleAddInstruction}>
        + Add Instruction
      </button>

      {/* Save */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Recipe"}
        </button>
      </div>
    </div>
  );
}
