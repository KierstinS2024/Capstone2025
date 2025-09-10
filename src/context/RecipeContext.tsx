// src/context/RecipeContext.tsx
// React Context for recipes with API integration

"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Recipe } from "../models/Recipe";
import { fetchRecipes, createRecipe, deleteRecipe } from "../lib/recipeApi";

type RecipeContextType = {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => Promise<void>;
  removeRecipe: (id: string) => Promise<void>;
  refreshRecipes: () => Promise<void>;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    refreshRecipes();
  }, []);

  async function refreshRecipes() {
    const data = await fetchRecipes();
    setRecipes(data);
  }

  async function addRecipe(recipe: Recipe) {
    const newRecipe = await createRecipe(recipe);
    setRecipes((prev) => [...prev, newRecipe]);
  }

  async function removeRecipe(id: string) {
    await deleteRecipe(id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <RecipeContext.Provider
      value={{ recipes, addRecipe, removeRecipe, refreshRecipes }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error("useRecipes must be used inside RecipeProvider");
  return ctx;
}
