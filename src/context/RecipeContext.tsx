// path: src/context/RecipeContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import { Recipe } from "@/types/recipe";
import * as api from "@/lib/spoonacularApi";

type RecipeValue = {
  recipes: Recipe[];
  loading: boolean;
  search: (q: string) => Promise<void>;
  getById: (id: string) => Promise<Recipe | null>;
};

const RecipeContext = createContext<RecipeValue | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (q: string) => {
    setLoading(true);
    try {
      const r = await api.searchRecipes(q);
      setRecipes(r);
    } catch (err) {
      console.error("searchRecipes", err);
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    setLoading(true);
    try {
      const r = await api.getRecipeById(id);
      setLoading(false);
      return r;
    } catch (err) {
      console.error("getRecipeById", err);
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
