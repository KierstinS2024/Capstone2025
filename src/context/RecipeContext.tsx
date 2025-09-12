// Path: src/context/RecipeContext.tsx
// Manages recipes globally: fetch, create, and loading state

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { Recipe, RecipeIngredient } from "@/types/recipe";
import { fetchRecipesAPI, createRecipeAPI } from "@/lib/recipeApi"; // adjust paths

// Context type
interface RecipeContextType {
  recipes: Recipe[]; // all recipes
  loading: boolean; // loading state for API calls
  createRecipe: (recipe: Omit<Recipe, "_id">) => Promise<void>; // create a new recipe
}

// Create context
const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// Provider
export const RecipeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]); // all recipes state
  const [loading, setLoading] = useState<boolean>(true); // loading state

  // Fetch recipes from API on mount
  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        const fetchedRecipes = await fetchRecipesAPI();
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, []);

  // Add a new recipe
  const createRecipe = async (recipe: Omit<Recipe, "_id">) => {
    setLoading(true);
    try {
      const newRecipe = await createRecipeAPI(recipe);
      setRecipes((prev) => [...prev, newRecipe]);
    } catch (error) {
      console.error("Error creating recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecipeContext.Provider value={{ recipes, loading, createRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};

// Hook for easy access
export const useRecipes = (): RecipeContextType => {
  const context = useContext(RecipeContext);
  if (!context)
    throw new Error("useRecipes must be used within RecipeProvider");
  return context;
};
