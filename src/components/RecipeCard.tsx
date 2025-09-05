// src/components/RecipeCard.tsx
"use client";

// --- React import ---
import React from "react";

// --- Recipe type ---
interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  ingredientId?: string;
}

export interface Recipe {
  _id?: string;
  name: string;
  description: string;
  cuisine: string;
  ingredients: Ingredient[];
  instructions: string[];
  source: "user" | "spoonacular"; // internal or external
  externalId?: string; // only for external recipes
}

// --- Props for the component ---
interface RecipeCardProps {
  recipe: Recipe;
  showActions?: boolean; // whether edit/delete buttons are shown
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

      {/* Cuisine type */}
      {recipe.cuisine && (
        <p>
          <strong>Cuisine:</strong> {recipe.cuisine}
        </p>
      )}

      {/* Description */}
      {recipe.description && <p>{recipe.description}</p>}

      {/* Ingredients preview (first 3 for brevity) */}
      {recipe.ingredients?.length > 0 && (
        <p>
          <strong>Ingredients:</strong>{" "}
          {recipe.ingredients
            .slice(0, 3)
            .map((ing) => `${ing.quantity} ${ing.unit} ${ing.name}`)
            .join(", ")}
          {recipe.ingredients.length > 3 && "…"}
        </p>
      )}

      {/* Actions (edit/delete) */}
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
