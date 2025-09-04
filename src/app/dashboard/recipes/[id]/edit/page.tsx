// path: src/app/dashboard/recipes/[id]/edit/page.tsx
/**
 * Edit Recipe Page
 * ----------------
 * Loads an existing recipe by ID and allows the user to update:
 * - Name, Cuisine, Description
 * - Ingredients (add/remove/edit)
 * - Instructions
 * - Servings
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getApiClient } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Ingredient {
  name: string;
  quantity: string;
}

interface Recipe {
  _id: string;
  name: string;
  cuisine?: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string;
  servings: number;
}

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch recipe by ID
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);
        const res = await client.get(`/recipes/${params.id}`);
        setRecipe(res.data.data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [params.id]);

  if (loading) return <p style={{ padding: "20px" }}>Loading recipe...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  const handleIngredientChange = (
    index: number,
    field: "name" | "quantity",
    value: string
  ) => {
    if (!recipe) return;
    const updated = [...recipe.ingredients];
    updated[index][field] = value;
    setRecipe({ ...recipe, ingredients: updated });
  };

  const handleAddIngredient = () => {
    if (!recipe) return;
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: "", quantity: "" }],
    });
  };

  const handleRemoveIngredient = (index: number) => {
    if (!recipe) return;
    const updated = [...recipe.ingredients];
    updated.splice(index, 1);
    setRecipe({ ...recipe, ingredients: updated });
  };

  const handleSubmit = async () => {
    if (!recipe) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.put(`/recipes/${recipe._id}`, recipe);
      router.push("/dashboard/recipes");
    } catch (err) {
      console.error("Error updating recipe:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ padding: "20px" }}>
        <h1>Edit Recipe</h1>
        <div>
          <label>
            Name:
            <input
              value={recipe.name}
              onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Cuisine:
            <input
              value={recipe.cuisine || ""}
              onChange={(e) =>
                setRecipe({ ...recipe, cuisine: e.target.value })
              }
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea
              value={recipe.description || ""}
              onChange={(e) =>
                setRecipe({ ...recipe, description: e.target.value })
              }
              rows={3}
              cols={40}
            />
          </label>
        </div>

        <h2>Ingredients</h2>
        {recipe.ingredients.map((ing, idx) => (
          <div key={idx} style={{ marginBottom: "5px" }}>
            <input
              type="text"
              value={ing.name}
              placeholder="Name"
              onChange={(e) =>
                handleIngredientChange(idx, "name", e.target.value)
              }
            />
            <input
              type="text"
              value={ing.quantity}
              placeholder="Quantity"
              onChange={(e) =>
                handleIngredientChange(idx, "quantity", e.target.value)
              }
              style={{ marginLeft: "5px" }}
            />
            <button
              type="button"
              onClick={() => handleRemoveIngredient(idx)}
              style={{ marginLeft: "5px" }}
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddIngredient}>+ Add Ingredient</button>

        <div>
          <label>
            Instructions:
            <textarea
              value={recipe.instructions}
              onChange={(e) =>
                setRecipe({ ...recipe, instructions: e.target.value })
              }
              rows={5}
              cols={50}
            />
          </label>
        </div>
        <div>
          <label>
            Servings:
            <input
              type="number"
              min={1}
              value={recipe.servings}
              onChange={(e) =>
                setRecipe({ ...recipe, servings: parseInt(e.target.value) })
              }
            />
          </label>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
