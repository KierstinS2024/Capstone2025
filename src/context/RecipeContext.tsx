// Path: src/context/RecipeContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { Recipe } from "@/types/recipe";
import {
  fetchRecipesAPI,
  createRecipeAPI,
  deleteRecipeAPI,
} from "@/lib/recipeApi";

// Context type
interface RecipeContextType {
  recipes: Recipe[];
  loading: boolean;
  createRecipe: (recipe: Omit<Recipe, "_id">) => Promise<void>;
  deleteRecipe: (id: string) => void; // ✅ Added
  toggleFavorite: (id: string) => void; // ✅ Added
}

// Create context
const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

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

  // ✅ Delete recipe
  const deleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r._id !== id));
    // Optional: call API to persist deletion
    deleteRecipeAPI(id).catch((err) => console.error("Delete failed:", err));
  };

  // ✅ Toggle favorite
  const toggleFavorite = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r._id === id ? { ...r, favorite: !r.favorite } : r))
    );
    // Optional: call API to persist favorite
  };

  return (
    <RecipeContext.Provider
      value={{ recipes, loading, createRecipe, deleteRecipe, toggleFavorite }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = (): RecipeContextType => {
  const context = useContext(RecipeContext);
  if (!context)
    throw new Error("useRecipes must be used within RecipeProvider");
  return context;
};
