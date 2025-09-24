// ===========================================
// PATH: src/components/RecipeCard.tsx
// ===========================================
"use client";

import React from "react";
import { Recipe } from "@/types/recipe";
import styles from "@/styles/recipeCard.module.css";
import { useRecipes } from "@/context/RecipeContext";

interface Props {
  recipe: Recipe;
  onClick: () => void;
  currentUserEmail: string | null; // for user-specific actions
  onSave?: (id: string) => void; // optional save callback for Spoonacular
  onDelete?: (id: string) => void; // optional delete callback
}

export default function RecipeCard({
  recipe,
  onClick,
  currentUserEmail,
  onSave,
  onDelete,
}: Props) {
  const { deleteRecipe } = useRecipes();
  const image = recipe.image || "/placeholder.png";

  // Check if recipe is saved by the current user
  const isUserRecipe =
    recipe.source !== "spoonacular" && recipe.author === currentUserEmail;

  const handleDelete = async () => {
    if (!onDelete && isUserRecipe) {
      // default delete if no callback
      await deleteRecipe(recipe.id);
    } else if (onDelete) {
      onDelete(recipe.id);
    }
  };

  const handleSave = () => {
    if (onSave) onSave(recipe.id);
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        {image && (
          <img src={image} alt={recipe.title} className={styles.image} />
        )}
        <div
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            display: "flex",
            gap: "0.25rem",
          }}
        >
          {/* Conditionally show buttons */}
          {isUserRecipe && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className={styles.icon}
              title="Delete Recipe"
            >
              🗑
            </button>
          )}
          {recipe.source === "spoonacular" && onSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className={styles.icon}
              title="Save Recipe"
            >
              💾
            </button>
          )}
        </div>
      </div>

      <div className={styles.text}>
        <h3 className={styles.title}>{recipe.title}</h3>
        <div className={styles.meta}>
          <span>{recipe.source}</span>
        </div>
      </div>

      <button className={styles.viewBtn}>View Full Recipe</button>
    </div>
  );
}
