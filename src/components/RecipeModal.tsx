// ===========================================
// PATH: src/components/RecipeModal.tsx
// ===========================================
"use client";

import React, { useState, useEffect } from "react";
import { Recipe } from "@/types/recipe";
import { getSpoonacularRecipe } from "@/lib/spoonacularApi";
import { parseInstructions } from "@/utils/parseInstructions";

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const [fullRecipe, setFullRecipe] = useState<Recipe>(recipe);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFullRecipe = async () => {
      if (recipe.source === "spoonacular" && !recipe.instructions) {
        setLoading(true);
        try {
          const data = await getSpoonacularRecipe(recipe.id);
          setFullRecipe(data);
        } catch (err) {
          console.error("Failed to fetch Spoonacular recipe", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFullRecipe();
  }, [recipe]);

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
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "1rem",
          borderRadius: "8px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            fontSize: "1.2rem",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <h2>{fullRecipe.title}</h2>

        {fullRecipe.image && (
          <img
            src={fullRecipe.image}
            alt={fullRecipe.title}
            style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
          />
        )}

        {loading && <p>Loading full details…</p>}

        {fullRecipe.ingredients?.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h3>Ingredients:</h3>
            <ul>
              {fullRecipe.ingredients.map((ing) => (
                <li key={ing}>{ing}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3>Instructions:</h3>
          {parseInstructions(fullRecipe.instructions)}
        </div>
      </div>
    </div>
  );
}