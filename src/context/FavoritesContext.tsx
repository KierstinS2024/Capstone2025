// src/context/FavoritesContext.tsx
// React context for managing favorite recipes
"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import type { Recipe } from "@/types/recipe";
import { useRecipes } from "./RecipeContext";

// --------------------
// Types
// --------------------
interface FavoritesContextType {
  favorites: Recipe[];
  toggleFavorite: (id: string) => Promise<void>;
  loading: boolean;
}

// --------------------
// Context creation
// --------------------
export const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

type ProviderProps = { children: ReactNode };

// --------------------
// Provider component
// --------------------
export const FavoritesProvider = ({ children }: ProviderProps) => {
  const {
    recipes,
    createRecipe,
    deleteRecipe,
    loading: recipesLoading,
  } = useRecipes();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync favorites from recipes
  useEffect(() => {
    const favs = recipes.filter((r) => r.favorite);
    setFavorites(favs);
    setLoading(recipesLoading);
  }, [recipes, recipesLoading]);

  // --------------------
  // Actions
  // --------------------
  const toggleFavorite = async (id: string) => {
    const recipe = recipes.find((r) => r._id === id);
    if (!recipe) return;

    // Clone recipe and toggle favorite
    const updatedRecipe = { ...recipe, favorite: !recipe.favorite };

    // Delete then recreate pattern to match backend (or update if implemented)
    await deleteRecipe(id);
    await createRecipe(updatedRecipe);
  };

  // --------------------
  // Context value
  // --------------------
  const value: FavoritesContextType = {
    favorites,
    toggleFavorite,
    loading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// --------------------
// Hook for consuming FavoritesContext safely
// --------------------
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
};
