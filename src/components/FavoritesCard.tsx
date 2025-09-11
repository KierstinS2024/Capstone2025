// Path: src/components/FavoritesCard.tsx
"use client";

import React from "react";
import { useFavorites } from "@/context/FavoritesContext";
import MealCard from "./MealCard";

/**
 * FavoritesCard
 * Displays all favorite recipes in a compact, mini-card grid.
 * Users can see favorites even in guest mode (read-only).
 */
const FavoritesCard: React.FC = () => {
  const { favorites, loading } = useFavorites();

  // Loading placeholder
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

  // No favorites state
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
          <MealCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesCard;
