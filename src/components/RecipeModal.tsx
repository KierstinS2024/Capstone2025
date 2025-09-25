// ===========================================
// PATH: src/components/RecipeModal.tsx
// Recipe Modal Component
// - Displays full recipe details
// - Supports saving Spoonacular recipes
// - Supports deleting user-created recipes
// - Handles loading, error messages, and user-specific actions
// ===========================================
"use client";

import React, { useState, useEffect } from "react";
import { Recipe } from "@/types/recipe";
import { parseInstructions } from "@/utils/parseInstructions";
import { useRecipes } from "@/context/RecipeContext";

interface RecipeModalProps {
  recipe: Recipe; // Recipe to display
  onClose: () => void; // Close modal callback
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const { addRecipe, deleteRecipe, getSpoonacularRecipe } = useRecipes();

  // -----------------------------
  // State
  // -----------------------------
  const [fullRecipe, setFullRecipe] = useState<Recipe>(recipe);
  const [loading, setLoading] = useState(false); // Spoonacular fetch loading
  const [saving, setSaving] = useState(false); // Save button loading
  const [error, setError] = useState(""); // Error message
  const [recipeSaved, setRecipeSaved] = useState(false); // Track if already saved

  // Get logged-in user email
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  // -----------------------------
  // Fetch full Spoonacular recipe if not already loaded
  // -----------------------------
  useEffect(() => {
    const fetchFullRecipe = async () => {
      if (recipe.source === "spoonacular" && !recipe.instructions) {
        setLoading(true);
        setError("");
        try {
          const data = await getSpoonacularRecipe(recipe.id);
          setFullRecipe(data);
        } catch (err: any) {
          setError(
            err.message === "quota"
              ? "Spoonacular daily limit reached. Try again tomorrow."
              : "Failed to fetch recipe details."
          );
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFullRecipe();
  }, [recipe, getSpoonacularRecipe]);

  // -----------------------------
  // Determine if this is a user-created recipe
  // -----------------------------
  const isUserRecipe =
    recipe.source !== "spoonacular" && recipe.author === userEmail;

  // -----------------------------
  // Save Spoonacular recipe
  // -----------------------------
  const handleSave = async () => {
    if (!userEmail) return;
    setSaving(true);
    setError("");

    try {
      await addRecipe({ ...fullRecipe, author: userEmail });
      setRecipeSaved(true);
    } catch (err) {
      console.error(err);
      setError("Failed to save recipe.");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // Delete user recipe
  // -----------------------------
  const handleDelete = async () => {
    if (!fullRecipe.id) return;
    try {
      await deleteRecipe(fullRecipe.id);
      onClose(); // Close modal after deletion
    } catch (err) {
      console.error(err);
      setError("Failed to delete recipe.");
    }
  };

  // -----------------------------
  // Render modal
  // -----------------------------
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        overflowY: "auto",
        padding: "1rem",
      }}
      onClick={onClose} // click outside closes modal
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "100%",
          padding: "1.5rem",
          position: "relative",
          boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            fontSize: "1.5rem",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        {/* Save / Delete Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {isUserRecipe ? (
            <button
              onClick={handleDelete}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving || recipeSaved}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#2ecc71",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: saving || recipeSaved ? "not-allowed" : "pointer",
              }}
            >
              {recipeSaved
                ? "Saved!"
                : saving
                ? "Saving..."
                : "Save to Recipes"}
            </button>
          )}
        </div>

        {/* Recipe Title */}
        <h2 style={{ marginBottom: "1rem" }}>{fullRecipe.title}</h2>

        {/* Recipe Image */}
        {fullRecipe.image && (
          <img
            src={fullRecipe.image}
            alt={fullRecipe.title}
            style={{
              width: "100%",
              borderRadius: "8px",
              marginBottom: "1rem",
              objectFit: "cover",
            }}
          />
        )}

        {/* Loading & Error */}
        {loading && <p>Loading recipe details…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Ingredients */}
        {fullRecipe.ingredients?.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h3>Ingredients</h3>
            <ul style={{ paddingLeft: "1.2rem" }}>
              {fullRecipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructions */}
        <div>
          <h3>Instructions</h3>
          {parseInstructions(fullRecipe.instructions)}
        </div>
      </div>
    </div>
  );
}
