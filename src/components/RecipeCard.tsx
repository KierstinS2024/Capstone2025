// src/components/RecipeCard.tsx
import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";

/**
 * RecipeCard
 * Displays a list of recipes from RecipeContext with delete & favorite buttons
 * Includes a toggle to filter by favorites
 */
export const RecipeCard: React.FC = () => {
  const { recipes, deleteRecipe, toggleFavorite } = useRecipes();
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredRecipes = showFavorites
    ? recipes.filter((r) => r.favorite)
    : recipes;

  if (!filteredRecipes.length) {
    return (
      <div>
        {showFavorites
          ? "No favorite recipes yet. ⭐ Mark some to see them here!"
          : "No recipes found. Add some to get started!"}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h2 style={{ fontSize: "20px" }}>Recipes</h2>
        <button
          onClick={() => setShowFavorites((prev) => !prev)}
          style={{
            padding: "6px 12px",
            backgroundColor: showFavorites ? "#ffcc00" : "#ccc",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {showFavorites ? "Show All" : "Show Favorites"}
        </button>
      </div>

      {/* Recipe List */}
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {filteredRecipes.map((recipe) => (
          <li
            key={recipe._id}
            style={{
              marginBottom: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              {recipe.title}{" "}
              {recipe.favorite && <span style={{ color: "gold" }}>⭐</span>}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => toggleFavorite(recipe._id)}
                style={{
                  padding: "4px 8px",
                  backgroundColor: recipe.favorite ? "#ffcc00" : "#ccc",
                  color: "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {recipe.favorite ? "Unfavorite" : "Favorite"}
              </button>
              <button
                onClick={() => deleteRecipe(recipe._id)}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
