// ===========================================
// PATH: src/components/RecipeModal.tsx
// RecipeModal — view full recipe details with optional edit/delete
// - Uses parseInstructions for formatting instructions
// - Delete button only shows if user owns recipe AND parent provides onDelete
// ===========================================

"use client";

import React, { useState } from "react";
import { Recipe } from "@/types/recipe";
import { useRecipes } from "@/context/RecipeContext";
import { parseInstructions } from "@/utils/parseInstructions";
import "@/styles/recipeModal.module.css";

// -----------------------------
// Props
// -----------------------------
interface RecipeModalProps {
  recipe: Recipe; // recipe being displayed
  onClose: () => void; // close modal
  onDelete?: (id: string) => Promise<void>; // optional parent callback for deletion
}

export default function RecipeModal({
  recipe,
  onClose,
  onDelete,
}: RecipeModalProps) {
  const { updateRecipe } = useRecipes(); // edit/update handled via context

  // Get current logged-in user
  const currentUserEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  // Recipe is owned if created by the logged-in user
  const isUserOwned = recipe.author === currentUserEmail;

  // -----------------------------
  // Local state for editing
  // -----------------------------
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(recipe.title);
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [ingredients, setIngredients] = useState(recipe.ingredients.join(", "));
  const [image, setImage] = useState(recipe.image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Save edited recipe
  // -----------------------------
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateRecipe(recipe.id, {
        title,
        instructions,
        ingredients: ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
        image,
      });
      setEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update recipe");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Delete recipe (only if onDelete provided)
  // -----------------------------
  const handleDelete = async () => {
    if (!onDelete) return; // guard: parent didn’t provide delete
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await onDelete(recipe.id);
      onClose(); // close modal after delete
    } catch (err) {
      console.error("Failed to delete recipe", err);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
      onClick={onClose} // close modal if user clicks background
    >
      <div
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: "12px",
          padding: "1rem",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside modal
      >
        {/* -----------------------------
            Edit Mode
        ----------------------------- */}
        {editing ? (
          <>
            <h2>Edit Recipe</h2>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "0.5rem",
              }}
            />
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "0.5rem",
                minHeight: "80px",
              }}
            />
            <input
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "0.5rem",
              }}
            />
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "0.5rem",
              }}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() => setEditing(false)}
                style={{ padding: "0.5rem 1rem" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#2ecc71",
                  color: "#fff",
                }}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* -----------------------------
                View Mode
            ----------------------------- */}
            <h2>{recipe.title}</h2>

            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.title}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginBottom: "0.5rem",
                }}
              />
            )}

            <h3>Ingredients:</h3>
            <ul>
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>

            <h3>Instructions:</h3>
            <div>{parseInstructions(recipe.instructions)}</div>

            {/* -----------------------------
                Action buttons (only if user owns recipe)
                - Edit always available for owner
                - Delete only if parent provided onDelete
            ----------------------------- */}
            {isUserOwned && (
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}
              >
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#3498db",
                    color: "#fff",
                  }}
                >
                  Edit
                </button>
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#e74c3c",
                      color: "#fff",
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* -----------------------------
            Close button (always present)
        ----------------------------- */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
      </div>
    </div>
  );
}
