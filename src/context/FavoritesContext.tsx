// src/context/FavoritesContext.tsx
// React context for managing user's favorite recipes (local + spoonacular read-only)
// Provides: favorites list, loading state, fetchFavorites, toggleFavorite

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { Recipe } from "@/types/recipe";
import { fetchRecipesAPI, toggleFavoriteAPI } from "@/lib/recipeApi";

type FavoritesContextType = {
  favorites: Recipe[];
  loading: boolean;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (recipeId: string) => Promise<void>;
};

export const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

type ProviderProps = { children: ReactNode };

/**
 * FavoritesProvider
 * - Fetches recipes and keeps a filtered list of favorites
 * - toggleFavorite calls backend then refreshes favorites
 *
 * Note: We derive favorites from recipes where `recipe.favorite === true`.
 * This keeps behavior simple and avoids adding extra API endpoints for now.
 */
export const FavoritesProvider = ({ children }: ProviderProps) => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load favorites on mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  /** Fetch all recipes and keep only those marked favorite */
  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const all = await fetchRecipesAPI();
      const favs = all.filter((r) => Boolean((r as Recipe).favorite));
      setFavorites(favs);
    } catch (error) {
      console.error("FavoritesProvider.fetchFavorites error:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle a recipe's favorite status.
   * - Calls the API helper then refreshes favorites.
   * - Keeps things simple by re-fetching the favorites list after toggle.
   */
  const toggleFavorite = async (recipeId: string) => {
    try {
      await toggleFavoriteAPI(recipeId);
      await fetchFavorites();
    } catch (error) {
      console.error("FavoritesProvider.toggleFavorite error:", error);
      throw error;
    }
  };

  const value: FavoritesContextType = {
    favorites,
    loading,
    fetchFavorites,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

/** Hook to consume FavoritesContext safely */
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
};
