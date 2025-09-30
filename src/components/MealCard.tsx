// ===========================================
// PATH: src/components/MealCard.tsx
// ===========================================
"use client";

import React from "react";
import { Recipe } from "@/types/recipe";
import styles from "@/styles/mealCard.module.css";

interface Props {
  mealType: "breakfast" | "lunch" | "dinner";
  recipe?: Recipe;
  onClick: () => void; // Open modal or editor
  onRemove?: () => void;
}

/**
 * MealCard
 * - Represents a single meal slot
 * - Shows recipe info if assigned
 * - Shows "+ Add meal" if empty
 */
export default function MealCard({
  mealType,
  recipe,
  onClick,
  onRemove,
}: Props) {
  // Use placeholder if recipe has no image
  const image = recipe?.image || "/placeholder.png";

  return (
    <div className={styles.mealCard} onClick={onClick}>
      {/* Header: meal type + optional remove button */}
      <div className={styles.header}>
        <h3 className={styles.mealType}>{mealType.toUpperCase()}</h3>
        {recipe && onRemove && (
          <button
            className={styles.removeButton}
            onClick={(e) => {
              e.stopPropagation(); // prevent opening modal
              onRemove();
            }}
          >
            &times;
          </button>
        )}
      </div>

      {/* Body: recipe info or "Add meal" */}
      {recipe ? (
        <>
          {image && (
            <img src={image} alt={recipe.title} className={styles.mealImage} />
          )}
          <p className={styles.recipeTitle}>{recipe.title}</p>
        </>
      ) : (
        <p className={styles.addPrompt}>+ Add meal</p>
      )}
    </div>
  );
}
