// ===========================================
// PATH: src/components/RecipeCard.tsx
// RecipeCard — displays a recipe preview with optional actions
// Supports user recipes (edit/delete) and Spoonacular recipes (Save/View buttons)
// Fully clickable card for modal, buttons prevent modal opening
// ===========================================
"use client";

import React, { ReactNode } from "react";
import { Recipe } from "@/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void; // Open modal or details
  onDelete?: (id: string) => Promise<void>; // Parent delete handler
  /** Optional extra buttons/actions to display below title */
  children?: ReactNode;
}

export default function RecipeCard({
  recipe,
  onClick,
  onDelete,
  children,
}: RecipeCardProps) {
  // Determine if the recipe is owned by current user
  const currentUserEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  const isUserOwned = recipe.author === currentUserEmail;

  // Delete handler for user-owned recipes
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
      onClick={onClick} // opens modal when card itself is clicked
    >
      {/* Recipe image */}
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ width: "100%", height: "150px", objectFit: "cover" }}
        />
      )}

      {/* Card content */}
      <div
        style={{
          padding: "0.5rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem 0" }}>{recipe.title}</h3>

        {/* User-owned recipe actions */}
        {isUserOwned && (
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
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
                e.stopPropagation(); // prevent modal open
                handleDelete();
              }}
            >
              Delete
            </button>
          </div>
        )}

        {/* Spoonacular recipes */}
        {!isUserOwned && (
          <>
            <small style={{ color: "#555" }}>
              Spoonacular Recipe (read-only)
            </small>

            {/* Buttons for saving and viewing full recipe */}
            <div
              style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
            >
              {/* Save button is passed as children from parent */}
              {children}

              {/* View Full Recipe button */}
              {onClick && (
                <button
                  style={{
                    flex: 1,
                    padding: "0.25rem",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#3498db",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent double modal triggers
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
