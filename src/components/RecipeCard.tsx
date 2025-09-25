// ===========================================
// PATH: src/components/RecipeCard.tsx
// Recipe Card Component
// - Displays recipe image, title, source
// - Save (Spoonacular) or Delete (user recipe)
// - Clicking card opens RecipeModal
// - Fully commented for clarity
// ===========================================
"use client";

import React from "react";
import { Recipe } from "@/types/recipe";
import styles from "@/styles/recipeCard.module.css";

interface Props {
  recipe: Recipe; // Recipe object
  currentUserEmail: string | null; // Logged-in user email
  onClick: () => void; // Opens RecipeModal
  onSave?: (id: string) => void; // Save callback for Spoonacular recipes
  onDelete?: (id: string) => void; // Delete callback for user recipes
}

export default function RecipeCard({
  recipe,
  currentUserEmail,
  onClick,
  onSave,
  onDelete,
}: Props) {
  const image = recipe.image || "/placeholder.png"; // Fallback image

  // -----------------------------
  // Determine if recipe belongs to current user
  // -----------------------------
  const isUserRecipe =
    recipe.source !== "spoonacular" && recipe.author === currentUserEmail;

  // -----------------------------
  // Delete click handler
  // -----------------------------
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from opening modal
    if (onDelete) {
      onDelete(recipe.id);
    } else if (isUserRecipe) {
      console.warn("Delete function not provided!");
    }
  };

  // -----------------------------
  // Save click handler
  // -----------------------------
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from opening modal
    if (onSave) onSave(recipe.id);
  };

  return (
    <div className={styles.card} onClick={onClick}>
      {/* Recipe Image */}
      <img src={image} alt={recipe.title} className={styles.image} />

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginTop: "0.5rem",
          justifyContent: "flex-end",
        }}
      >
        {/* Delete button only for saved user recipes */}
        {isUserRecipe && (
          <button onClick={handleDelete} className={styles.actionBtn}>
            Delete
          </button>
        )}

        {/* Save button only for Spoonacular recipes not yet saved */}
        {recipe.source === "spoonacular" && onSave && (
          <button onClick={handleSave} className={styles.actionBtn}>
            Save to Recipes
          </button>
        )}
      </div>

      {/* Recipe Title */}
      <h3 className={styles.title}>{recipe.title}</h3>

      {/* Recipe Source */}
      <p className={styles.source}>{recipe.source}</p>

      {/* Optional "View Full Recipe" button (also opens modal) */}
      <button className={styles.viewBtn}>View Full Recipe</button>
    </div>
  );
}
