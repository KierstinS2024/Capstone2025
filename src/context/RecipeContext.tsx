// src/context/RecipeContext.tsx
import { createContext, useState, useEffect, ReactNode } from "react";
import type { Recipe } from "../models/Recipe";
import { fetchRecipes } from "../lib/recipeApi";

type RecipeContextType = {
  recipes: Recipe[];
  refresh: () => Promise<void>;
};

export const RecipeContext = createContext<RecipeContextType | undefined>(
  undefined
);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const refresh = async () => {
    const data = await fetchRecipes();
    setRecipes(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <RecipeContext.Provider value={{ recipes, refresh }}>
      {children}
    </RecipeContext.Provider>
  );
};
