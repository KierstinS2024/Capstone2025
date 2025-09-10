// src/components/FavoritesCard.tsx
import React, { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import type { Recipe } from "@/models/Recipe";

/**
 * FavoritesCard Component
 * Displays a preview of the user's favorite recipes.
 */
export const FavoritesCard: React.FC = () => {
  const { user } = useContext(UserContext);

  const favorites: Recipe[] = user?.favorites || [];

  if (favorites.length === 0) {
    return (
      <div
        style={{
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fefefe",
        }}
      >
        No favorite recipes yet.
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
      <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>Your Favorites</h2>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {favorites.slice(0, 5).map((recipe, idx) => (
          <li key={idx} style={{ marginBottom: "8px" }}>
            {recipe.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
