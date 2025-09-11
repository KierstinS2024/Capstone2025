// Path: src/context/FavoritesContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Recipe } from "@/types/recipe";

/**
 * Context type for managing favorite recipes
 */
interface FavoritesContextType {
  favorites: Recipe[];
  loading: boolean;
  toggleFavorite: (recipe: Recipe) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

/** Custom hook to consume FavoritesContext */
export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};

/** Provider for managing favorite recipes */
export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites((prev) =>
      prev.find((fav) => fav._id === recipe._id)
        ? prev.filter((fav) => fav._id !== recipe._id)
        : [...prev, recipe]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, loading, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
