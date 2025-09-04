// Path: src/components/RecipeCard.tsx
"use client";

/**
 * RecipeCard
 * --------------------
 * Displays a single recipe in card format.
 * - Shows image, title, cuisine, source badge.
 * - User recipes can optionally show Edit/Delete buttons.
 * - Hover effects for interactivity.
 */

import styles from "./RecipeCard.module.css";

interface RecipeCardProps {
  recipe: {
    _id?: string;
    externalId?: string;
    name: string;
    description: string;
    cuisine: string;
    source: "user" | "spoonacular";
    image?: string;
  };
  showActions?: boolean; // Show Edit/Delete buttons (for user recipes)
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function RecipeCard({
  recipe,
  showActions = false,
  onEdit,
  onDelete,
}: RecipeCardProps) {
  return (
    <div className={styles.card}>
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.name}
          className={styles.cardImage}
        />
      )}

      <div className={styles.cardContent}>
        {/* Header: Title + Badge */}
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{recipe.name}</h3>
          <span
            className={`${styles.sourceBadge} ${
              recipe.source === "user" ? styles.user : styles.spoonacular
            }`}
          >
            {recipe.source === "user" ? "User" : "Spoonacular"}
          </span>
        </div>

        {/* Subtitle / Cuisine */}
        {recipe.cuisine && (
          <p className={styles.cardSubtitle}>Cuisine: {recipe.cuisine}</p>
        )}
      </div>

      {/* Actions for user recipes */}
      {showActions && (
        <div className={styles.actions}>
          {onEdit && (
            <button className={styles.editButton} onClick={onEdit}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className={styles.deleteButton} onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
