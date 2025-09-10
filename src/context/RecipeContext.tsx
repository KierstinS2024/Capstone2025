// src/context/RecipeContext.tsx
// React context for managing recipes

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Recipe } from "@/types/recipe";
import { apiFetch } from "@/lib/api";

type RecipeContextType = {
  recipes: Recipe[];
  loading: boolean;
  fetchRecipes: () => Promise<void>;
  createRecipe: (recipe: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
};

export const RecipeContext = createContext<RecipeContextType | undefined>(
  undefined
);

type ProviderProps = { children: ReactNode };

export const RecipeProvider = ({ children }: ProviderProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  /** Fetch all recipes */
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Recipe[]>("/recipes");
      setRecipes(data);
    } finally {
      setLoading(false);
    }
  };

  /** Create a recipe */
  const createRecipe = async (recipe: Partial<Recipe>) => {
    await apiFetch("/recipes", {
      method: "POST",
      body: JSON.stringify(recipe),
    });
    await fetchRecipes();
  };

  /** Delete a recipe */
  const deleteRecipe = async (id: string) => {
    await apiFetch(`/recipes/${id}`, { method: "DELETE" });
    setRecipes(recipes.filter((r) => r._id !== id));
  };

  const value: RecipeContextType = {
    recipes,
    loading,
    fetchRecipes,
    createRecipe,
    deleteRecipe,
  };

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context)
    throw new Error("useRecipes must be used within a RecipeProvider");
  return context;
};
