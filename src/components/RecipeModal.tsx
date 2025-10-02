// ===========================================
// PATH: src/components/RecipeModal.tsx
// RecipeModal component — displays full recipe details
// Fully responsive for mobile and desktop
// ===========================================

"use client";

import React from "react";
import { Recipe } from "@/types";
import { useAuth } from "@/context/AuthContext"; // Get current user
import { parseInstructions } from "@/utils/parseInstructions"; // Converts instructions HTML to React nodes
import styles from "@/styles/recipeModal.module.css";

// Props interface
interface Props {
  recipe: Recipe; // Recipe to display
  onClose: () => void; // Callback to close modal
}

/**
 * RecipeModal
 * - Shows recipe image, ingredients, instructions
 * - Optionally allows saving recipe if logged in
 */
export default function RecipeModal({ recipe, onClose }: Props) {
  const { user } = useAuth();

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {/* Header with title and close button */}
        <div className={styles.modalHeader}>
          <h2>{recipe.title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Recipe image */}
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className={styles.recipeImage}
          />
        )}

        {/* Ingredients list */}
        <div className={styles.section}>
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className={styles.section}>
          <h3>Instructions</h3>
          <div>{parseInstructions(recipe.instructions)}</div>
        </div>

        {/* Footer: save button if applicable */}
        <div className={styles.modalFooter}>
          {/* {user && recipe.source !== "user" && (
            <button
              className={styles.saveButton}
              onClick={() => alert("Saved to your recipes!")}
            >
              Save Recipe
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
}
