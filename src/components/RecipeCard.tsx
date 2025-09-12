// Path: src/components/RecipeCard.tsx
// Displays a single recipe card (full or partial)

"use client";

import React from "react";
import type { Recipe } from "@/types/recipe";

interface RecipeCardProps {
  recipe: Partial<Recipe>; // Accept partial for guest entries
  isGuest?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isGuest = false }) => {
  const title = recipe.title ?? "Untitled Recipe";
  const image = recipe.image ?? "/placeholder-image.png";
  const ingredients = recipe.ingredients ?? [];

  return (
    <div
      style={{
        border: "1px solid #d8cfc4",
        borderRadius: "10px",
        overflow: "hidden",
        cursor: isGuest ? "default" : "pointer",
        backgroundColor: "#f9f6f2",
      }}
    >
      {/* Recipe image */}
      {image && (
        <img
          src={image}
          alt={title}
          style={{ width: "100%", height: "150px", objectFit: "cover" }}
        />
      )}

      {/* Recipe title */}
      <div style={{ padding: "12px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#6b4c3b" }}>
          {title}
        </h2>
      </div>

      {/* Ingredients list */}
      {ingredients.length > 0 && (
        <ul style={{ paddingLeft: "16px", marginBottom: "12px" }}>
          {ingredients.map((ing, idx) => (
            <li key={idx}>
              {ing.quantity} {ing.unit ?? ""} {ing.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipeCard;
