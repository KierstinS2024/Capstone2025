// ===========================================
// PATH: src/components/RecipeModal.tsx
// RecipeModal component — displays full recipe
// Fully responsive and polished for mobile + desktop
// ===========================================
"use client";

import React from "react";
import { Recipe } from "@/types/recipe";
import { useAuth } from "@/context/AuthContext"; // get current user
import { parseInstructions } from "@/utils/parseInstructions";
import styles from "@/styles/recipeModal.module.css";

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: Props) {
  const { user } = useAuth(); // logged-in user

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {/* --------------------
            Header with title + close
        -------------------- */}
        <div className={styles.modalHeader}>
          <h2>{recipe.title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        {/* --------------------
            Recipe Image
        -------------------- */}
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className={styles.recipeImage}
          />
        )}

        {/* --------------------
            Ingredients Section
        -------------------- */}
        <div className={styles.section}>
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* --------------------
            Instructions Section
        -------------------- */}
        <div className={styles.section}>
          <h3>Instructions</h3>
          <div>{parseInstructions(recipe.instructions)}</div>
        </div>

        {/* --------------------
            Footer Actions
        -------------------- */}
        <div className={styles.modalFooter}>

        </div>
      </div>
    </div>
  );
}
