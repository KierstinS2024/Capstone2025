// src/context/FavoritesContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { Recipe } from "@/types/recipe";
import { useRecipes } from "./RecipeContext";
import { toggleFavoriteAPI } from "@/lib/recipeApi";

type FavoritesContextType = {
  favorites: Recipe[];
  loading: boolean;
  toggleFavorite: (recipeId: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

/**
 * Derive favorites from recipes; be defensive if recipes are not yet loaded.
 * Provide optimistic toggle behavior.
 */
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { recipes } = useRecipes();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // be defensive: recipes may be undefined for a short window
    setFavorites(
      Array.isArray(recipes) ? recipes.filter((r) => !!r.favorite) : []
    );
  }, [recipes]);

  const toggleFavorite = async (recipeId: string) => {
    // optimistic update locally
    setFavorites((prev) =>
      prev.map((r) =>
        r._id === recipeId ? { ...r, favorite: !r.favorite } : r
      )
    );

    try {
      await toggleFavoriteAPI(recipeId);
    } catch (err) {
      // revert if API fails: re-sync from recipes
      console.error("toggleFavorite error:", err);
      setFavorites(
        Array.isArray(recipes) ? recipes.filter((r) => !!r.favorite) : []
      );
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, loading, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};
