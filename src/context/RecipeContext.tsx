// src/context/RecipeContext.tsx
// React Context for managing recipes

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Recipe } from "../types/recipe";
import {
  fetchRecipes,
  fetchRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleFavorite,
} from "../lib/recipeApi";

// ---- Types ----
type RecipeContextType = {
  recipes: Recipe[];
  loading: boolean;
  refreshRecipes: () => Promise<void>;
  getRecipe: (id: string) => Promise<Recipe | undefined>;
  addRecipe: (data: Partial<Recipe>) => Promise<void>;
  editRecipe: (id: string, data: Partial<Recipe>) => Promise<void>;
  removeRecipe: (id: string) => Promise<void>;
  toggleRecipeFavorite: (id: string) => Promise<void>;
};

// Default context (for safety)
const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// ---- Provider ----
export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshRecipes();
  }, []);

  const refreshRecipes = async () => {
    setLoading(true);
    try {
      const data = await fetchRecipes();
      setRecipes(data);
    } finally {
      setLoading(false);
    }
  };

  const getRecipe = async (id: string) => {
    try {
      return await fetchRecipeById(id);
    } catch (err) {
      console.error("Failed to fetch recipe:", err);
      return undefined;
    }
  };

  const addRecipe = async (data: Partial<Recipe>) => {
    try {
      const newRecipe = await createRecipe(data);
      setRecipes((prev) => [...prev, newRecipe]);
    } catch (err) {
      console.error("Failed to add recipe:", err);
    }
  };

  const editRecipe = async (id: string, data: Partial<Recipe>) => {
    try {
      const updated = await updateRecipe(id, data);
      setRecipes((prev) => prev.map((r) => (r._id === id ? updated : r)));
    } catch (err) {
      console.error("Failed to update recipe:", err);
    }
  };

  const removeRecipe = async (id: string) => {
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete recipe:", err);
    }
  };

  const toggleRecipeFavorite = async (id: string) => {
    try {
      const updated = await toggleFavorite(id);
      setRecipes((prev) => prev.map((r) => (r._id === id ? updated : r)));
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        loading,
        refreshRecipes,
        getRecipe,
        addRecipe,
        editRecipe,
        removeRecipe,
        toggleRecipeFavorite,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

// ---- Hook ----
export function useRecipes() {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error("useRecipes must be used inside RecipeProvider");
  return ctx;
}
