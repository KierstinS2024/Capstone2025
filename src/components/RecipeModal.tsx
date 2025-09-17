"use client";

import React from "react";
import { Recipe } from "@/context/RecipeContext";

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  if (!recipe) return null;

  const title = recipe.title || "Untitled Recipe";
  const image = recipe.image || "/placeholder.png";
  const instructions = recipe.instructions || "No instructions provided.";
  const ingredients: string[] = recipe.ingredients || [];

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

        <h2>{title}</h2>

        {image && (
          <img
            src={image}
            alt={title}
            style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
          />
        )}

        {ingredients.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h3>Ingredients:</h3>
            <ul>
              {ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3>Instructions:</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{instructions}</p>
        </div>
      </div>
    </div>
  );
}
