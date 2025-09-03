// path: src/app/recipes/[id]/page.tsx
/**
 * Edit Recipe Page
 * -----------------
 * Loads an existing recipe by ID.
 * Lets the user:
 *  - Update name, description, and cuisine
 *  - Edit, add, or remove ingredients
 *  - Edit, add, or remove instructions
 *  - Save changes back to the backend
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditRecipePage() {
  const params = useParams(); // Read dynamic :id param
  const router = useRouter();

  // Local state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState<
    { name: string; quantity: number; unit: string }[]
  >([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch recipe on mount
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (res.ok) {
          const data = await res.json();
          setName(data.data.name || "");
          setDescription(data.data.description || "");
          setCuisine(data.data.cuisine || "");
          setIngredients(data.data.ingredients || []);
          setInstructions(data.data.instructions || []);
        } else {
          console.error("Failed to fetch recipe");
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  // Ingredient handlers
  const handleIngredientChange = (
    index: number,
    field: "name" | "quantity" | "unit",
    value: string | number
  ) => {
    const updated = [...ingredients];
    (updated[index] as any)[field] = value;
    setIngredients(updated);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: 1, unit: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    const updated = [...ingredients];
    updated.splice(index, 1);
    setIngredients(updated);
  };

  // Instruction handlers
  const handleInstructionChange = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleRemoveInstruction = (index: number) => {
    const updated = [...instructions];
    updated.splice(index, 1);
    setInstructions(updated);
  };

  // Submit updated recipe
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

      if (res.ok) {
        router.push("/recipes");
      } else {
        console.error("Failed to update recipe");
      }
    } catch (err) {
      console.error("Error updating recipe:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading recipe...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Recipe</h1>

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

      {/* Save button */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
