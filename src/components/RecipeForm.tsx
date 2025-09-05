// src/components/RecipeForm.tsx
"use client";

// --- React imports ---
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

// --- Ingredient input type ---
export interface IngredientInput {
  ingredientId: string; // links to an ingredient in your DB
  name?: string; // optional, for display purposes
  quantity: number; // amount of ingredient
  unit: string; // measurement unit
}

// --- Props for RecipeForm ---
export interface RecipeFormProps {
  initialData?: {
    _id?: string;
    name?: string;
    description?: string;
    ingredients?: IngredientInput[];
    instructions?: string[];
    cuisine?: string;
  };
  onSave?: () => void; // callback after successfully saving
}

// --- RecipeForm component ---
export default function RecipeForm({ initialData, onSave }: RecipeFormProps) {
  const { token } = useAuth(); // JWT token from context

  // --- Local state ---
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [cuisine, setCuisine] = useState(initialData?.cuisine || "");
  const [ingredients, setIngredients] = useState<IngredientInput[]>(
    initialData?.ingredients || []
  );
  const [instructions, setInstructions] = useState<string[]>(
    initialData?.instructions || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Ingredient handlers ---
  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { ingredientId: "", quantity: 1, unit: "" },
    ]);
  };

  const handleIngredientChange = (index: number, field: string, value: any) => {
    const updated = [...ingredients];
    (updated[index] as any)[field] = value;
    setIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    const updated = [...ingredients];
    updated.splice(index, 1);
    setIngredients(updated);
  };

  // --- Instruction handlers ---
  const handleAddInstruction = () => setInstructions([...instructions, ""]);

  const handleInstructionChange = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleRemoveInstruction = (index: number) => {
    const updated = [...instructions];
    updated.splice(index, 1);
    setInstructions(updated);
  };

  // --- Submit handler (create or update) ---
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Determine URL and HTTP method
      const url = initialData?._id
        ? `/api/recipes/${initialData._id}`
        : "/api/recipes";
      const method = initialData?._id ? "PUT" : "POST";

      // Send request
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          cuisine,
          ingredients,
          instructions,
        }),
      });

      if (!res.ok) throw new Error("Failed to save recipe");

      // Callback after successful save
      if (onSave) onSave();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error saving recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Recipe Name */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>
      </div>

      {/* Description */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Description:
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>
      </div>

      {/* Cuisine */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Cuisine:
          <input
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>
      </div>

      {/* Ingredients */}
      <h2>Ingredients</h2>
      {ingredients.map((ing, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "5px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Ingredient ID"
            value={ing.ingredientId}
            onChange={(e) =>
              handleIngredientChange(idx, "ingredientId", e.target.value)
            }
            style={{ flex: 1 }}
          />
          <input
            type="number"
            min="1"
            placeholder="Qty"
            value={ing.quantity}
            onChange={(e) =>
              handleIngredientChange(
                idx,
                "quantity",
                parseFloat(e.target.value)
              )
            }
            style={{ width: "80px" }}
          />
          <input
            type="text"
            placeholder="Unit"
            value={ing.unit}
            onChange={(e) =>
              handleIngredientChange(idx, "unit", e.target.value)
            }
            style={{ width: "80px" }}
          />
          <button type="button" onClick={() => handleRemoveIngredient(idx)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddIngredient}
        style={{ marginTop: "5px" }}
      >
        + Add Ingredient
      </button>

      {/* Instructions */}
      <h2>Instructions</h2>
      {instructions.map((inst, idx) => (
        <div
          key={idx}
          style={{ marginBottom: "5px", display: "flex", gap: "10px" }}
        >
          <textarea
            rows={2}
            placeholder={`Step ${idx + 1}`}
            value={inst}
            onChange={(e) => handleInstructionChange(idx, e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="button" onClick={() => handleRemoveInstruction(idx)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddInstruction}>
        + Add Instruction
      </button>

      {/* Submit button */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ padding: "10px 20px" }}
        >
          {loading
            ? "Saving..."
            : initialData?._id
            ? "Save Changes"
            : "Create Recipe"}
        </button>
      </div>
    </div>
  );
}
