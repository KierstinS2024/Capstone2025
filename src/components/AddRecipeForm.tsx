// ===========================================
// PATH: src/components/AddRecipeForm.tsx
// AddRecipeForm Component — accepts optional onClose prop
// ===========================================
"use client";

import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/addRecipeForm.module.css";

// -----------------------------
// Props type: onClose optional
// -----------------------------
interface AddRecipeFormProps {
  onClose?: () => void; // Called when form/modal should close
}

export default function AddRecipeForm({ onClose }: AddRecipeFormProps) {
  const { user } = useAuth(); // current logged-in user
  const { addRecipe } = useRecipes(); // function to add recipe to DB

  // -----------------------------
  // Local form state
  // -----------------------------
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Form submit handler
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      setError("You must be logged in to add a recipe.");
      return;
    }

    if (!title.trim() || !ingredients.trim() || !instructions.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addRecipe({
        title: title.trim(),
        ingredients: ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
        instructions: instructions.trim(),
        image: image.trim() || undefined,
        author: user.email,
        source: "user",
      });

      // Reset form
      setTitle("");
      setIngredients("");
      setInstructions("");
      setImage("");

      alert("Recipe added successfully!");

      // Close modal if onClose prop is passed
      if (onClose) onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to add recipe");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Render form
  // -----------------------------
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Add New Recipe</h2>

      {error && <p className={styles.error}>{error}</p>}

      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Recipe title"
          required
        />
      </label>

      <label>
        Ingredients (comma separated)
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g., eggs, milk, flour"
          required
        />
      </label>

      <label>
        Instructions
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Step-by-step instructions"
          required
        />
      </label>

      <label>
        Image URL (optional)
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Recipe"}
      </button>
    </form>
  );
}
