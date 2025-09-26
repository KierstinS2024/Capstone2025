// ===========================================
// PATH: src/components/RecipeCard.tsx
// RecipeCard — displays a single recipe preview
// - Supports user-owned recipes (delete)
// - Supports Spoonacular recipes (read-only)
// - Clickable card; buttons stop propagation to prevent opening modal
// ===========================================

"use client";

import React, { ReactNode } from "react";
import { Recipe } from "@/types/recipe";
import styles from "@/styles/theme-mealplan.module.css";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void; // Opens modal or detailed view
  onDelete?: (id: string) => Promise<void>; // Delete handler
  children?: ReactNode; // Optional extra buttons
}

export default function RecipeCard({
  recipe,
  onClick,
  onDelete,
  children,
}: RecipeCardProps) {
  // Check if recipe belongs to current user
  const currentUserEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
  const isUserOwned = recipe.author === currentUserEmail;

  // Delete handler
  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await onDelete(recipe.id);
    } catch (err) {
      console.error("Failed to delete recipe", err);
    }
  };

  return (
    <div className={styles.recipeCard} onClick={onClick}>
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className={styles.cardImage || ""}
        />
      )}

      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{recipe.title}</h3>

        {/* User-owned recipes: delete button */}
        {isUserOwned && (
          <div className={styles.actions}>
            <button
              className={`${styles.button} ${styles.buttonDanger}`}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              Delete
            </button>
          </div>
        )}

        {/* Spoonacular recipes: read-only */}
        {!isUserOwned && (
          <>
            <small className={styles.spoonacularLabel}>
              Spoonacular Recipe (read-only)
            </small>
            <div className={styles.actions}>
              {children}
              {onClick && (
                <button
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                >
                  View Full Recipe
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
