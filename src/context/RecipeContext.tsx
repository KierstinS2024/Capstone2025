"use client";

import React, { createContext, useContext, useState } from "react";
import type { Recipe, CreateRecipePayload } from "@/types/recipe";

interface RecipeContextType {
  recipes: Recipe[];
  createRecipe: (payload: CreateRecipePayload) => Promise<void>;
  searchRecipes: (query: string) => Promise<Recipe[]>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context)
    throw new Error("useRecipes must be used within RecipeProvider");
  return context;
};

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  /** Create a new recipe */
  const createRecipe = async (payload: CreateRecipePayload) => {
    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to create recipe");

    const created: Recipe = await response.json();
    setRecipes((prev) => [...prev, created]);
  };

  /** Search recipes (Spoonacular + local) */
  const searchRecipes = async (query: string) => {
    const response = await fetch(`/api/recipes/search?query=${query}`);
    if (!response.ok) throw new Error("Search failed");
    const results: Recipe[] = await response.json();
    setRecipes(results);
    return results;
  };

  return (
    <RecipeContext.Provider value={{ recipes, createRecipe, searchRecipes }}>
      {children}
    </RecipeContext.Provider>
  );
};
