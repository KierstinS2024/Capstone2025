// src/components/FavoritesCard.tsx
import React from "react";
import { useFavorites } from "@/context/FavoritesContext";

export const FavoritesCard: React.FC = () => {
  const { favorites, toggleFavorite, loading } = useFavorites();

  if (loading) return <div>Loading favorites...</div>;
  if (!favorites.length) return <div>No favorites yet.</div>;

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
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {favorites.map((recipe) => (
          <li
            key={recipe._id}
            style={{
              marginBottom: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{recipe.title}</span>
            <button
              onClick={() => toggleFavorite(recipe._id)}
              style={{
                padding: "4px 8px",
                backgroundColor: "orange",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Unfavorite
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
