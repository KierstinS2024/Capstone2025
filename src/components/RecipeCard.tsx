//src/components/RecipeCard.tsx
"use client";

import React from "react";
import { Recipe } from "@/types/recipe";
import styles from "@/styles/recipeCard.module.css";

interface Props {
  recipe: Recipe;
  onClick: () => void;
}

export default function RecipeCard({ recipe, onClick }: Props) {
  const image = recipe.image || "/placeholder.png";

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        {image && (
          <img src={image} alt={recipe.title} className={styles.image} />
        )}
      </div>

      <div className={styles.text}>
        <h3 className={styles.title}>{recipe.title}</h3>
        <div className={styles.meta}></div>
      </div>

      <button className={styles.viewBtn}>View Full Recipe</button>
    </div>
  );
}
