"use client";

import React from "react";
import { Recipe } from "@/context/RecipeContext";
import styles from "@/styles/recipeCard.module.css";

interface Props {
  recipe: Recipe;
  onClick: () => void;
}

export default function RecipeCard({ recipe, onClick }: Props) {
  const image = recipe.image || "/placeholder.png"; // fallback image

  return (
    <div className={styles.card} onClick={onClick}>
      {image && <img src={image} alt={recipe.title} className={styles.image} />}
      <h3 className={styles.title}>{recipe.title}</h3>
      <p className={styles.summary}>
        {recipe.instructions?.slice(0, 100) || "No instructions yet..."}
        {recipe.instructions && recipe.instructions.length > 100 ? "..." : ""}
      </p>
      <button className={styles.viewBtn}>View Full Recipe</button>
    </div>
  );
}
