// path: src/app/dashboard/recipes/new/page.tsx
/**
 * Create Recipe Page
 * ------------------
 * Lets the user manually create a new recipe or prefill from Spoonacular.
 * Fields:
 *  - Name
 *  - Cuisine
 *  - Description
 *  - Ingredients
 *  - Instructions
 *  - Servings
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getApiClient } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Ingredient {
  name: string;
  quantity: string;
}

export default function NewRecipePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState("");
  const [servings, setServings] = useState(1);
  const [saving, setSaving] = useState(false);

  // Add a blank ingredient row
  const handleAddIngredient = () =>
    setIngredients([...ingredients, { name: "", quantity: "" }]);

  const handleIngredientChange = (
    index: number,
    field: "name" | "quantity",
    value: string
  ) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.post("/recipes", {
        name,
        cuisine,
        description,
        ingredients,
        instructions,
        servings,
      });
      router.push("/dashboard/recipes");
    } catch (err) {
      console.error("Error creating recipe:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ padding: "20px" }}>
        <h1>Create New Recipe</h1>
        <div>
          <label>
            Name:
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Cuisine:
            <input
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            />
          </label>
        </div>
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

        <h2>Ingredients</h2>
        {ingredients.map((ing, idx) => (
          <div key={idx} style={{ marginBottom: "5px" }}>
            <input
              type="text"
              placeholder="Name"
              value={ing.name}
              onChange={(e) =>
                handleIngredientChange(idx, "name", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Quantity"
              value={ing.quantity}
              onChange={(e) =>
                handleIngredientChange(idx, "quantity", e.target.value)
              }
              style={{ marginLeft: "5px" }}
            />
          </div>
        ))}
        <button onClick={handleAddIngredient}>+ Add Ingredient</button>

        <div>
          <label>
            Instructions:
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
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
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value))}
            />
          </label>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Recipe"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
