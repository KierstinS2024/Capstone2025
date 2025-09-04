// path: src/components/RecipeCard.tsx
"use client";

/**
 * RecipeCard
 * -----------------
 * Displays a single recipe in card format.
 * - Shows Edit/Delete buttons only if the recipe is user-submitted
 * - Works with user-submitted and Spoonacular recipes
 */

import React from "react";

interface RecipeForCard {
  _id?: string;
  name: string;
  description?: string;
  cuisine?: string;
  source: "user" | "spoonacular"; // controls edit/delete
  externalId?: string;
}

interface RecipeCardProps {
  recipe: RecipeForCard;
  onEdit?: () => void; // Only applicable for user-submitted recipes
  onDelete?: () => void; // Only applicable for user-submitted recipes
}

export default function RecipeCard({
  recipe,
  onEdit,
  onDelete,
}: RecipeCardProps) {
  const isUserRecipe = recipe.source === "user";

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h2>{recipe.name}</h2>
        {recipe.cuisine && <p>Cuisine: {recipe.cuisine}</p>}
        {recipe.description && <p>{recipe.description}</p>}
        {!isUserRecipe && (
          <p style={{ fontStyle: "italic" }}>Imported from Spoonacular</p>
        )}
      </div>

      {isUserRecipe && (onEdit || onDelete) && (
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          {onEdit && (
            <button
              onClick={onEdit}
              style={{ flex: 1, padding: "0.5rem", cursor: "pointer" }}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              style={{
                flex: 1,
                padding: "0.5rem",
                cursor: "pointer",
                backgroundColor: "#ffdddd",
              }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
