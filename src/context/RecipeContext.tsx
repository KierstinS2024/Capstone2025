"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Recipe } from "@/types/recipe";
import { fetchRecipesAPI, toggleFavoriteAPI } from "@/lib/recipeApi";
import { useAuth } from "./AuthContext";

type RecipeContextType = {
  recipes: Recipe[];
  favorites: Recipe[];
  loading: boolean;
  refreshRecipes: () => Promise<void>;
  toggleFavorite: (recipeId: string) => Promise<void>;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshRecipes = async () => {
    if (!user) return;
    setLoading(true);
    const data = await fetchRecipesAPI();
    setRecipes(data);
    setLoading(false);
  };

  const toggleFavorite = async (recipeId: string) => {
    await toggleFavoriteAPI(recipeId);
    setRecipes((prev) =>
      prev.map((r) =>
        r._id === recipeId ? { ...r, favorite: !r.favorite } : r
      )
    );
  };

  useEffect(() => {
    refreshRecipes();
  }, [user]);

  const favorites = recipes.filter((r) => r.favorite);

  return (
    <RecipeContext.Provider
      value={{ recipes, favorites, loading, refreshRecipes, toggleFavorite }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error("useRecipes must be used within RecipeProvider");
  return ctx;
};
