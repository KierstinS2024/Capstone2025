// src/components/RecipeCard.tsx
"use client";

import React from "react";

// --- Ingredient type ---
export interface Ingredient {
  ingredientId?: string; // optional, used for internal references
  name: string;
  quantity: number | string; // quantity can be numeric or string for display
  unit: string;
}

// --- Recipe type ---
export interface Recipe {
  _id?: string;
  name: string;
  description: string;
  cuisine?: string;
  ingredients: Ingredient[];
  instructions?: string[];
  source: "user" | "spoonacular"; // internal or external recipe
  externalId?: string; // only for external recipes
}

// --- Props for RecipeCard ---
export interface RecipeCardProps {
  recipe: Recipe;
  showActions?: boolean; // whether to display edit/delete buttons
  onEdit?: () => void; // edit callback
  onDelete?: () => void; // delete callback
}

export default function RecipeCard({
  recipe,
  showActions = false,
  onEdit,
  onDelete,
}: RecipeCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "10px",
      }}
    >
      {/* Recipe title */}
      <h2>{recipe.name}</h2>

      {/* Cuisine */}
      {recipe.cuisine && (
        <p>
          <strong>Cuisine:</strong> {recipe.cuisine}
        </p>
      )}

      {/* Description */}
      {recipe.description && <p>{recipe.description}</p>}

      {/* Ingredients preview (first 3) */}
      {recipe.ingredients.length > 0 && (
        <p>
          <strong>Ingredients:</strong>{" "}
          {recipe.ingredients
            .slice(0, 3)
            .map((ing) => `${ing.quantity} ${ing.unit} ${ing.name}`)
            .join(", ")}
          {recipe.ingredients.length > 3 && "…"}
        </p>
      )}

      {/* Optional Actions (Edit/Delete buttons) */}
      {showActions && (
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          {onEdit && (
            <button style={{ padding: "6px 12px" }} onClick={onEdit}>
              Edit
            </button>
          )}
          {onDelete && (
            <button style={{ padding: "6px 12px" }} onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
