// src/context/RecipeContext.tsx
// React context for managing recipes
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Recipe } from "@/types/recipe";
import {
  fetchRecipesAPI,
  createRecipeAPI,
  deleteRecipeAPI,
  updateRecipeAPI,
  toggleFavoriteAPI,
} from "@/lib/recipeApi";

// --------------------
// Types
// --------------------
type RecipeContextType = {
  recipes: Recipe[];
  loading: boolean;
  fetchRecipes: () => Promise<void>;
  createRecipe: (recipe: Partial<Recipe>) => Promise<void>;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
};

// --------------------
// Context creation
// --------------------
export const RecipeContext = createContext<RecipeContextType | undefined>(
  undefined
);

type ProviderProps = { children: ReactNode };

// --------------------
// Provider component
// --------------------
export const RecipeProvider = ({ children }: ProviderProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes on mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  // --------------------
  // Context actions
  // --------------------

  /** Fetch all recipes and update state */
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await fetchRecipesAPI();
      setRecipes(data);
    } finally {
      setLoading(false);
    }
  };

  /** Create a new recipe and refresh list */
  const createRecipe = async (recipe: Partial<Recipe>) => {
    await createRecipeAPI(recipe);
    await fetchRecipes();
  };

  /** Update a recipe */
  const updateRecipe = async (id: string, recipe: Partial<Recipe>) => {
    await updateRecipeAPI(id, recipe);
    await fetchRecipes();
  };

  /** Delete a recipe by ID */
  const deleteRecipe = async (id: string) => {
    await deleteRecipeAPI(id);
    setRecipes((prev) => prev.filter((r) => r._id !== id));
  };

  /** Toggle favorite status */
  const toggleFavorite = async (id: string) => {
    await toggleFavoriteAPI(id);
    setRecipes((prev) =>
      prev.map((r) => (r._id === id ? { ...r, favorite: !r.favorite } : r))
    );
  };

  // --------------------
  // Context value
  // --------------------
  const value: RecipeContextType = {
    recipes,
    loading,
    fetchRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
  };

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
};

// --------------------
// Hook for consuming RecipeContext safely
// --------------------
export const useRecipes = (): RecipeContextType => {
  const context = useContext(RecipeContext);
  if (!context)
    throw new Error("useRecipes must be used within a RecipeProvider");
  return context;
};
