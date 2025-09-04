// path: src/app/dashboard/recipes/[id]/edit/page.tsx
/**
 * Edit Recipe Page
 * ----------------
 * Allows user to edit an existing recipe.
 * Features:
 *  - Update name, description, cuisine
 *  - Add / remove / edit ingredients
 *  - Submit changes to backend
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

interface IngredientEntry {
  ingredientId: string;
  quantity: number;
  unit: string;
}

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState<IngredientEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/recipes/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setName(data.data.name);
          setDescription(data.data.description || "");
          setCuisine(data.data.cuisine || "");
          setIngredients(data.data.ingredients || []);
        } else console.error("Failed to load recipe");
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [params.id]);

  // Ingredient handlers
  const handleAddIngredient = () =>
    setIngredients([
      ...ingredients,
      { ingredientId: "", quantity: 1, unit: "" },
    ]);
  const handleIngredientChange = (
    idx: number,
    field: string,
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

  // Submit changes
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/recipes/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, cuisine, ingredients }),
      });

      if (res.ok) router.push("/dashboard/recipes");
      else console.error("Failed to update recipe");
    } catch (err) {
      console.error("Error updating recipe:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading recipe...</p>;

  return (
    <ProtectedRoute>
      <div style={{ padding: "20px" }}>
        <h1>Edit Recipe</h1>

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

        <div>
          <label>
            Description:
            <textarea
              value={description}
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
          <div key={idx} style={{ marginBottom: "10px" }}>
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
              value={ing.quantity}
              onChange={(e) =>
                handleIngredientChange(
                  idx,
                  "quantity",
                  parseInt(e.target.value)
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
              onClick={() => handleRemoveIngredient(idx)}
              style={{ marginLeft: "10px" }}
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddIngredient}>+ Add Ingredient</button>

        <div style={{ marginTop: "20px" }}>
          <button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
