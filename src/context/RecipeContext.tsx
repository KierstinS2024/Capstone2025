"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Recipe } from "@/types/recipe";
import * as api from "@/lib/spoonacularApi";

type RecipeContextValue = {
  recipes: Recipe[];
  loading: boolean;
  search: (query: string) => Promise<void>;
  getById: (id: string) => Promise<Recipe | null>;
};

const RecipeContext = createContext<RecipeContextValue | undefined>(undefined);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (query: string) => {
    setLoading(true);
    try {
      const results = await api.searchRecipes(query);
      setRecipes(results);
    } catch (err) {
      console.error("searchRecipes failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    setLoading(true);
    try {
      const recipe = await api.getRecipeById(id);
      setLoading(false);
      return recipe;
    } catch (err) {
      console.error("getRecipeById failed:", err);
      setLoading(false);
      return null;
    }
  };

  return (
    <RecipeContext.Provider value={{ recipes, loading, search, getById }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error("useRecipes must be used within RecipeProvider");
  return ctx;
}
