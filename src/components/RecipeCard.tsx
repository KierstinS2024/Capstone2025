// ===========================================
// PATH: src/components/RecipeCard.tsx
// RecipeCard — displays a recipe preview with edit/delete for user recipes
// Updated to use onDelete prop from parent page for immediate grid update
// ===========================================
"use client";

import React from "react";
import { Recipe } from "@/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void; // Open modal or details
  onDelete?: (id: string) => Promise<void>; // Parent delete handler
}

export default function RecipeCard({ recipe, onClick, onDelete }: RecipeCardProps) {
  const currentUserEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  const isUserOwned = recipe.author === currentUserEmail;

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
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={onClick}
    >
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ width: "100%", height: "150px", objectFit: "cover" }}
        />
      )}
      <div
        style={{
          padding: "0.5rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem 0" }}>{recipe.title}</h3>
        {isUserOwned && (
          <div style={{ marginTop: "auto", display: "flex", gap: "0.5rem" }}>
            <button
              style={{
                flex: 1,
                padding: "0.25rem",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#e74c3c",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal open
                handleDelete();
              }}
            >
              Delete
            </button>
          </div>
        )}
        {!isUserOwned && (
          <small style={{ color: "#555" }}>
            Spoonacular Recipe (read-only)
          </small>
        )}
      </div>
    </div>
  );
}
