// PATH: src/components/AddRecipeForm.tsx
"use client";

import React, { useState } from "react";
import styles from "@/styles/addRecipeForm.module.css";
import { useRecipes } from "@/context/RecipeContext";

export default function AddRecipeForm() {
  const { addRecipe } = useRecipes();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleIngredientChange = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredientField = () => setIngredients([...ingredients, ""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!title.trim() || !ingredients.some((ing) => ing.trim())) {
        setError("Title and at least one ingredient are required");
        setLoading(false);
        return;
      }

      // Use RecipeContext to add recipe
      await addRecipe({
        title,
        ingredients: ingredients.filter((i) => i.trim() !== ""),
        instructions,
        source: "user",
      });

      setSuccess(true);
      setTitle("");
      setIngredients([""]);
      setInstructions("");
    } catch (err) {
      console.error("Failed to create recipe", err);
      setError("Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Create Your Recipe</h2>

      <label>Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Ingredients</label>
      {ingredients.map((ing, i) => (
        <input
          key={i}
          type="text"
          value={ing}
          onChange={(e) => handleIngredientChange(i, e.target.value)}
          required
        />
      ))}
      <button type="button" onClick={addIngredientField}>
        + Add Ingredient
      </button>

      <label>Instructions</label>
      <textarea
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Recipe"}
      </button>

      {success && <p className={styles.success}>✅ Recipe created!</p>}
      {error && <p className={styles.error}>❌ {error}</p>}
    </form>
  );
}
