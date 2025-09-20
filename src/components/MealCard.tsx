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
  onClick: () => void;
  onRemove?: () => void;
}

export default function MealCard({
  mealType,
  recipe,
  onClick,
  onRemove,
}: Props) {
  const image = recipe?.image || "/placeholder.png";

  return (
    <div className={styles.mealCard} onClick={onClick}>
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
