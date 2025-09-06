// path: src/app/recipes/saved/[id]/edit/page.tsx
/**
 * EditSavedRecipePage.tsx
 * ----------------------
 * Allows users to edit a saved recipe (internal only).
 * Users can modify name, cuisine, ingredients, and instructions.
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

export default function EditSavedRecipePage() {
  const params = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);
        const res = await client.get(`/saved/${params.id}`);
        const recipe = res.data.data;
        setName(recipe.name);
        setCuisine(recipe.cuisine || "");
        setIngredients(recipe.ingredients.length ? recipe.ingredients : [""]);
        setInstructions(
          recipe.instructions.length ? recipe.instructions : [""]
        );
      } catch (err: any) {
        setError(err.message || "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.put(`/saved/${params.id}`, {
        name,
        cuisine,
        ingredients,
        instructions,
      });
      router.push(`/recipes/saved/${params.id}/view`);
    } catch (err) {
      console.error(err);
      alert("Failed to save recipe");
    } finally {
      setSaving(false);
    }
  };

  const handleChangeArrayItem = (
    setter: (val: string[]) => void,
    index: number,
    value: string,
    array: string[]
  ) => {
    const updated = [...array];
    updated[index] = value;
    setter(updated);
  };

  const addArrayItem = (setter: (val: string[]) => void, array: string[]) =>
    setter([...array, ""]);

  const removeArrayItem = (
    setter: (val: string[]) => void,
    index: number,
    array: string[]
  ) => {
    const updated = array.filter((_, idx) => idx !== index);
    setter(updated.length ? updated : [""]);
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading recipe...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Edit Saved Recipe</h1>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Cuisine:
          <input
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
        </label>

        <h3>Ingredients:</h3>
        {ingredients.map((item, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleChangeArrayItem(
                  setIngredients,
                  idx,
                  e.target.value,
                  ingredients
                )
              }
            />
            <button
              onClick={() => removeArrayItem(setIngredients, idx, ingredients)}
              style={{ color: "red" }}
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={() => addArrayItem(setIngredients, ingredients)}>
          Add Ingredient
        </button>

        <h3>Instructions:</h3>
        {instructions.map((step, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={step}
              onChange={(e) =>
                handleChangeArrayItem(
                  setInstructions,
                  idx,
                  e.target.value,
                  instructions
                )
              }
            />
            <button
              onClick={() =>
                removeArrayItem(setInstructions, idx, instructions)
              }
              style={{ color: "red" }}
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={() => addArrayItem(setInstructions, instructions)}>
          Add Instruction
        </button>

        <div style={{ marginTop: "20px" }}>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() => router.push(`/recipes/saved/${params.id}/view`)}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
