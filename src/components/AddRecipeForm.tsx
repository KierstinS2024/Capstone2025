// ===========================================
// PATH: src/components/AddRecipeForm.tsx
// AddRecipeForm — create new user recipe
// Updated to notify parent page immediately on add
// ===========================================
"use client";

import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import { Recipe } from "@/types/recipe";

interface AddRecipeFormProps {
  onClose: () => void;
  onSuccess?: (newRecipe: Recipe) => void; // NEW: pass newly added recipe
}

export default function AddRecipeForm({
  onClose,
  onSuccess,
}: AddRecipeFormProps) {
  const { addRecipe } = useRecipes();

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<string>(""); // comma-separated
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const ingredientList = ingredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      // Expect addRecipe to return the newly created recipe
      const newRecipe = await addRecipe({
        title,
        instructions,
        ingredients: ingredientList,
        image,
      });

      if (onSuccess) onSuccess(newRecipe); // notify parent page immediately
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "1rem",
        borderRadius: "12px",
        width: "400px",
        maxWidth: "90%",
      }}
    >
      <h2>Add New Recipe</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <input
          required
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            minHeight: "80px",
          }}
        />
        <input
          placeholder="Ingredients (comma-separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <input
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#ccc",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#2ecc71",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
