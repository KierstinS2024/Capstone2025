// ===========================================
// PATH: src/components/MealCard.tsx
// Single meal slot card for breakfast, lunch, or dinner
// - Shows recipe info if assigned
// - Allows removing recipe
// - Shows "+ Add meal" if slot is empty
// ===========================================

"use client";

import React from "react";
import { Recipe } from "@/types/recipe";
import styles from "@/styles/mealCard.module.css";

interface Props {
  mealType: "breakfast" | "lunch" | "dinner"; // Type of meal slot
  recipe?: Recipe; // Assigned recipe (optional)
  onClick: () => void; // Click handler (view or add)
  onRemove?: () => void; // Remove handler (optional)
}

export default function MealCard({
  mealType,
  recipe,
  onClick,
  onRemove,
}: Props) {
  // Fallback image if recipe has none
  const image = recipe?.image || "/placeholder.png";

  return (
    // Main container for the meal slot
    <div className={styles.mealCard} onClick={onClick}>
      {/* -------------------------------
          Header: meal type and optional remove button
      ------------------------------- */}
      <div className={styles.header}>
        <h3 className={styles.mealType}>{mealType.toUpperCase()}</h3>

        {/* Show remove button if a recipe exists and onRemove is provided */}
        {recipe && onRemove && (
          <button
            className={styles.removeButton}
            onClick={(e) => {
              // Prevent the click from propagating to parent (which would open view/add modal)
              e.stopPropagation();
              onRemove(); // Call remove handler
            }}
          >
            &times; {/* Cross symbol */}
          </button>
        )}
      </div>

      {/* -------------------------------
          Body: Recipe image + title or "Add meal" prompt
      ------------------------------- */}
      {recipe ? (
        <>
          {/* Show recipe image if available */}
          {image && (
            <img src={image} alt={recipe.title} className={styles.mealImage} />
          )}

          {/* Recipe title */}
          <p className={styles.recipeTitle}>{recipe.title}</p>
        </>
      ) : (
        // Empty slot prompt
        <p className={styles.addPrompt}>+ Add meal</p>
      )}
    </div>
  );
}
