// path: src/components/RecipeCard.tsx
import React from "react";
import styles from "./RecipeCard.module.css";

export interface RecipeCardProps {
  recipe: {
    _id: string;
    name: string;
    description: string;
    cuisine?: string;
    ingredients?: { name: string; quantity: string }[];
  };
  onClick?: () => void;
}

/**
 * RecipeCard
 * Small card UI for displaying recipe summary inside the recipe list.
 */
export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <h3 className={styles.name}>{recipe.name}</h3>
        {recipe.cuisine && (
          <span className={styles.cuisine}>{recipe.cuisine}</span>
        )}
      </div>

      <p className={styles.description}>
        {recipe.description?.length > 100
          ? recipe.description.slice(0, 100) + "..."
          : recipe.description}
      </p>

      <div className={styles.footer}>
        <span className={styles.ingredientCount}>
          {recipe.ingredients?.length || 0} ingredients
        </span>
      </div>
    </div>
  );
}
