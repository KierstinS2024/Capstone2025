// ===========================================
// PATH: src/components/RecipeModal.tsx
// RecipeModal — view full recipe details and edit/delete for user recipes
// Now uses parseInstructions for HTML/line-break rendering
// ===========================================
"use client";

import React, { useState } from "react";
import { Recipe } from "@/types/recipe";
import { useRecipes } from "@/context/RecipeContext";
import { parseInstructions } from "@/utils/parseInstructions";

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>; // parent callback
}

export default function RecipeModal({
  recipe,
  onClose,
  onDelete,
}: RecipeModalProps) {
  const { updateRecipe } = useRecipes(); // delete is delegated to parent

  const currentUserEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

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
  // Delete recipe via parent callback
  // -----------------------------
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await onDelete(recipe.id);
      onClose();
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
      onClick={onClose} // close modal when clicking outside
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "1rem",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()} // prevent modal close on click inside
      >
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
              </div>
            )}
          </>
        )}
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
