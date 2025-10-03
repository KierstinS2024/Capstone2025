//src/components/MealCard.tsx
"use client";

import React from "react";
import { Recipe } from "@/types";
import styles from "@/styles/mealCard.module.css";

interface Props {
  mealType: "breakfast" | "lunch" | "dinner";
  recipe?: Recipe;
  onClick: () => void; // Open recipe modal
  onRemove?: () => void; // Remove recipe from plan
}

/**
 * MealCard
 * - Shows a meal slot (breakfast/lunch/dinner)
 * - Displays recipe image as background
 * - Overlay gradient for readability
 * - Shows recipe title or "+ Add meal"
 * - Small "×" button if removable
 */
export default function MealCard({
  mealType,
  recipe,
  onClick,
  onRemove,
}: Props) {
  return (
    <div
      className={styles.mealCard}
      onClick={onClick}
      style={{
        backgroundImage: recipe?.image ? `url(${recipe.image})` : undefined,
      }}
    >
      {/* Overlay gradient */}
      <div className={styles.overlay} />

      {/* Header: meal type + optional remove */}
      <div className={styles.header}>
        <h3 className={styles.mealType}>{mealType.toUpperCase()}</h3>
        {recipe && onRemove && (
          <button
            className={styles.removeButton}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            &times;
          </button>
        )}
      </div>

      {/* Body: recipe title or add prompt */}
      <div className={styles.body}>
        {recipe ? (
          <p className={styles.recipeTitle}>{recipe.title}</p>
        ) : (
          <p className={styles.addPrompt}>+ Add meal</p>
        )}
      </div>
    </div>
  );
}
