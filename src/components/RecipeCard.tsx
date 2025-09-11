// src/components/RecipeCard.tsx
import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import MealCard from "./MealCard"; // reuse mini-card style

/**
 * RecipeCard
 * Displays a list of recipes in mini-card style
 * Toggle to show all or only favorites
 */
export const RecipeCard: React.FC = () => {
  const { recipes, toggleFavorite } = useRecipes();
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredRecipes = showFavorites
    ? recipes.filter((r) => r.favorite)
    : recipes;

  if (!filteredRecipes.length) {
    return (
      <div
        style={{
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fafafa",
        }}
      >
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
      {/* Header with toggle button */}
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

      {/* Recipe List using mini-card style */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
        }}
      >
        {filteredRecipes.map((recipe) => (
          <MealCard
            key={recipe._id}
            name={recipe.title}
            // optional: could add recipe.image if available
          />
        ))}
      </div>
    </div>
  );
};
