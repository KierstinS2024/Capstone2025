// path: src/app/recipes/[id]/page.tsx
/**
 * EditRecipePage.tsx
 * ------------------
 * Allows editing an existing recipe.
 * Features:
 *  - Edit name and description
 *  - Add/edit/remove ingredients and instructions
 *  - Validations:
 *      - Name required
 *      - Ingredients must have ID, quantity > 0, and unit
 *      - Instructions must not be empty
 *  - Saves changes to backend
 *  - Loading and error handling
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Ingredient {
  ingredientId: string;
  quantity: number;
  unit: string;
}

export default function EditRecipePage() {
  const { id } = useParams(); // revert to "id"
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to load recipe");
        const data = await res.json();
        setName(data.data.name);
        setDescription(data.data.description || "");
        setIngredients(data.data.ingredients || []);
        setInstructions(data.data.instructions || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching recipe");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  // Ingredient handlers
  const handleAddIngredient = () =>
    setIngredients([
      ...ingredients,
      { ingredientId: "", quantity: 1, unit: "" },
    ]);
  const handleIngredientChange = (
    idx: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
    const updated = [...ingredients];
    (updated[idx] as any)[field] = value;
    setIngredients(updated);
  };
  const handleRemoveIngredient = (idx: number) => {
    const updated = [...ingredients];
    updated.splice(idx, 1);
    setIngredients(updated);
  };

  // Instruction handlers
  const handleAddInstruction = () => setInstructions([...instructions, ""]);
  const handleInstructionChange = (idx: number, value: string) => {
    const updated = [...instructions];
    updated[idx] = value;
    setInstructions(updated);
  };
  const handleRemoveInstruction = (idx: number) => {
    const updated = [...instructions];
    updated.splice(idx, 1);
    setInstructions(updated);
  };

  // Validation
  const validate = (): string | null => {
    if (!name.trim()) return "Recipe name is required";
    for (const ing of ingredients) {
      if (!ing.ingredientId.trim() || ing.quantity <= 0 || !ing.unit.trim()) {
        return "All ingredients must have an ID, quantity > 0, and unit";
      }
    }
    for (const step of instructions) {
      if (!step.trim()) return "All instruction steps must be filled in";
    }
    return null;
  };

  // Submit handler
  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, description, ingredients, instructions }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update recipe");
      }
      router.push("/recipes");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update recipe");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading recipe…</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Recipe</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

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
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          cols={50}
        />
      </label>

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
            placeholder="Unit"
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
          <button type="button" onClick={() => handleRemoveInstruction(idx)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddInstruction}>
        + Add Instruction
      </button>

      {/* Save */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
