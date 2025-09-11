// src/components/FavoritesCard.tsx
import React from "react";
import { useFavorites } from "@/context/FavoritesContext";
import MealCard from "./MealCard";

/**
 * FavoritesCard
 * Shows all favorite recipes in mini-card style
 */
export const FavoritesCard: React.FC = () => {
  const { favorites, toggleFavorite, loading } = useFavorites();

  if (loading) {
    return (
      <div
        style={{
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fafafa",
        }}
      >
        Loading favorites...
      </div>
    );
  }

  if (!favorites.length) {
    return (
      <div
        style={{
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fafafa",
        }}
      >
        No favorites yet. ⭐ Add some to see them here!
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
      <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>Favorites</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
        }}
      >
        {favorites.map((recipe) => (
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
