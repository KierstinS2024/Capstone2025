// File: src/app/dashboard/recipes/new/page.tsx
"use client";

/**
 * NewRecipePage
 * -------------
 * Allows a logged-in user to create and save a new recipe.
 * Includes:
 * - Title
 * - Description
 * - Dynamic ingredients (name -> ingredientId placeholder)
 * - Instructions
 * - Cuisine dropdown
 */

import { useState } from "react";
import NavBar from "@/components/NavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function NewRecipePage() {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // Required by model
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);
  const [instructions, setInstructions] = useState([""]);
  const [cuisine, setCuisine] = useState("");

  const handleIngredientChange = (i: number, field: string, value: string) => {
    const updated = [...ingredients];
    updated[i][field as keyof (typeof updated)[0]] = value;
    setIngredients(updated);
  };

  const handleInstructionChange = (i: number, value: string) => {
    const updated = [...instructions];
    updated[i] = value;
    setInstructions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return alert("Title is required");
    if (!description.trim()) return alert("Description is required");
    if (!ingredients.every((ing) => ing.name && ing.quantity && ing.unit))
      return alert("All ingredient fields are required");
    if (!instructions.every((step) => step.trim()))
      return alert("All steps are required");

    if (!token) return alert("❌ You must be logged in to save a recipe");

    // Map ingredients to match Recipe model
    const mappedIngredients = ingredients.map((ing) => ({
      ingredientId: null, // TODO: Replace null with actual ObjectId from Ingredient collection
      quantity: Number(ing.quantity),
      unit: ing.unit,
    }));

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: title,
          description,
          instructions,
          cuisine,
          userSubmitted: true,
          ingredients: mappedIngredients,
        }),
      });

      if (res.ok) {
        alert("✅ Recipe saved!");
        setTitle("");
        setDescription("");
        setIngredients([{ name: "", quantity: "", unit: "" }]);
        setInstructions([""]);
        setCuisine("");
      } else {
        const data = await res.json();
        alert(`❌ Error saving recipe: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      alert(`❌ Network error: ${err}`);
    }
  };

  return (
    <ProtectedRoute>
      <NavBar />
      <main style={{ padding: "1rem" }}>
        <h1>Add a New Recipe</h1>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxWidth: "600px",
          }}
        >
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <h3>Ingredients</h3>
          {ingredients.map((ing, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                placeholder="Name"
                value={ing.name}
                onChange={(e) =>
                  handleIngredientChange(i, "name", e.target.value)
                }
              />
              <input
                placeholder="Quantity"
                value={ing.quantity}
                onChange={(e) =>
                  handleIngredientChange(i, "quantity", e.target.value)
                }
              />
              <input
                placeholder="Unit"
                value={ing.unit}
                onChange={(e) =>
                  handleIngredientChange(i, "unit", e.target.value)
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setIngredients([
                ...ingredients,
                { name: "", quantity: "", unit: "" },
              ])
            }
          >
            + Add Ingredient
          </button>

          <h3>Instructions</h3>
          {instructions.map((step, i) => (
            <input
              key={i}
              placeholder={`Step ${i + 1}`}
              value={step}
              onChange={(e) => handleInstructionChange(i, e.target.value)}
            />
          ))}
          <button
            type="button"
            onClick={() => setInstructions([...instructions, ""])}
          >
            + Add Step
          </button>

          <h3>Cuisine</h3>
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            <option value="">--Choose Cuisine--</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Indian">Indian</option>
            <option value="American">American</option>
          </select>

          <button type="submit">Save Recipe</button>
        </form>
      </main>
    </ProtectedRoute>
  );
}
