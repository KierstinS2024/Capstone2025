"use client";

import React from "react";
import { Recipe } from "@/context/RecipeContext";
import styles from "@/styles/mealCard.module.css";

interface Props {
  mealType: "breakfast" | "lunch" | "dinner";
  recipe?: Recipe;
  onClick: () => void;
}

export default function MealCard({ mealType, recipe, onClick }: Props) {
  const image = recipe?.image || "/placeholder.png"; // fallback image

  return (
    <div className={styles.mealCard} onClick={onClick}>
      <h3 className={styles.mealType}>{mealType.toUpperCase()}</h3>

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
