// path: src/app/recipes/[id]/page.tsx
/**
 * Edit Recipe Page
 * ----------------
 * Loads an existing recipe by ID and lets the user:
 *  - Edit name, description, cuisine
 *  - Add/edit/remove ingredients
 *  - Add/edit/remove instructions
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);

  // Load recipe from backend
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          const recipe = data.data;
          setName(recipe.name);
          setDescription(recipe.description || "");
          setCuisine(recipe.cuisine || "");
          setIngredients(recipe.ingredients || []);
          setInstructions(recipe.instructions || []);
        } else {
          console.error("Failed to load recipe");
        }
      } catch (err) {
        console.error("Error loading recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  // Ingredient and instruction handlers (same as create)
  const handleIngredientChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...ingredients];
    (updated[index] as any)[field] = value;
    setIngredients(updated);
  };
  const handleAddIngredient = () =>
    setIngredients([
      ...ingredients,
      { ingredientId: "", quantity: 1, unit: "unit" },
    ]);
  const handleRemoveIngredient = (index: number) => {
    const updated = [...ingredients];
    updated.splice(index, 1);
    setIngredients(updated);
  };

  const handleInstructionChange = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };
  const handleAddInstruction = () => setInstructions([...instructions, ""]);
  const handleRemoveInstruction = (index: number) => {
    const updated = [...instructions];
    updated.splice(index, 1);
    setInstructions(updated);
  };

  // Save updated recipe
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/recipes/${params.id}`, {
        method: "PUT",
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

      if (res.ok) router.push("/recipes");
      else console.error("Failed to update recipe");
    } catch (err) {
      console.error("Error updating recipe:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading recipe...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Recipe</h1>

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
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
