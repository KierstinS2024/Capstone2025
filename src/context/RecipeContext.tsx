// src/context/RecipeContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Recipe } from "@/types/recipe";
import * as api from "@/lib/spoonacularApi"; // actual exports: fetchRecipes, fetchRecipeById

type RecipeContextValue = {
  recipes: Recipe[];
  searchRecipes: (query: string) => Promise<Recipe[]>;
  getRecipeById: (id: number) => Promise<Recipe | null>;
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
};

const RecipeContext = createContext<RecipeContextValue | undefined>(undefined);

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) throw new Error("useRecipe must be used within RecipeProvider");
  return context;
};

type Props = {
  children: ReactNode;
};

export const RecipeProvider = ({ children }: Props) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Map context methods to actual API functions
  const searchRecipes = async (query: string) => {
    try {
      const results = await api.fetchRecipes(query); // <-- fetchRecipes is the real API export
      setRecipes(results);
      return results;
    } catch (error) {
      console.error("Error searching recipes:", error);
      return [];
    }
  };

  const getRecipeById = async (id: number) => {
    try {
      const recipe = await api.fetchRecipeById(id.toString()); // convert number → string
      return recipe;
    } catch (error) {
      console.error("Error fetching recipe by ID:", error);
      return null;
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        setRecipes,
        searchRecipes,
        getRecipeById,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
