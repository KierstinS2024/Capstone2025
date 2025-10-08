// ===========================================
// PATH: src/context/RecipeContext.tsx
// ===========================================
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Recipe } from "@/types/recipe";
import * as recipeApi from "@/lib/recipeApi";
import * as spoonacularApi from "@/lib/spoonacularApi"; // updated import
import { useAuth } from "./AuthContext";

// Context type
interface RecipeContextType {
  recipes: Recipe[]; // saved recipes (DB)
  loading: boolean;
  searchResults: Recipe[]; // Spoonacular full results
  searchRecipes: (query: string) => Promise<void>;
  saveRecipeFromSearch: (recipe: Recipe) => Promise<void>;
  addRecipe: (
    recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">
  ) => Promise<Recipe>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  refreshRecipes: () => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // -----------------------------
  // Fetch saved recipes from DB
  // -----------------------------
  const refreshRecipes = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const fetched = await recipeApi.getRecipes(user.email);
      setRecipes(fetched);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.email) refreshRecipes();
    else setRecipes([]);
  }, [user, authLoading]);

  // -----------------------------
  // Add manually created recipe
  // -----------------------------
  const addRecipe = async (
    recipeData: Omit<Recipe, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user?.email) throw new Error("User not logged in");
    setLoading(true);
    try {
      const newRecipe = await recipeApi.addRecipe(recipeData, user.email);
      setRecipes((prev) => [...prev, newRecipe]);
      return newRecipe;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Update recipe
  // -----------------------------
  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    if (!user?.email) throw new Error("User not logged in");
    setLoading(true);
    try {
      await recipeApi.updateRecipe(id, updates, user.email);
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Delete recipe
  // -----------------------------
  const deleteRecipe = async (id: string) => {
    if (!user?.email) throw new Error("User not logged in");
    setLoading(true);
    try {
      await recipeApi.deleteRecipe(id, user.email);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Spoonacular Search (FULL recipe details)
  // -----------------------------
  const searchRecipes = async (query: string) => {
    if (!query) return;
    setLoading(true);
    try {
      // Step 1: search for recipe IDs
      const partialResults = await spoonacularApi.searchSpoonacular(query);

      // Step 2: fetch full recipe details for each
      const fullResults = await Promise.all(
        partialResults.map(async (r) => {
          try {
            return await spoonacularApi.getSpoonacularRecipe(r.id);
          } catch (err) {
            console.error(`Failed to fetch recipe ${r.id}`, err);
            return r; // fallback to partial
          }
        })
      );

      setSearchResults(fullResults);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Save Spoonacular Recipe → DB
  // -----------------------------
  const saveRecipeFromSearch = async (recipe: Recipe) => {
    if (!user?.email) throw new Error("User not logged in");

    const recipeToSave: Omit<Recipe, "id" | "createdAt" | "updatedAt"> = {
      author: user.email,
      title: recipe.title,
      image: recipe.image,
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || "",
      source: "spoonacular",
    };

    const saved = await recipeApi.addRecipe(recipeToSave, user.email);
    setRecipes((prev) => [...prev, saved]);
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        loading,
        searchResults,
        searchRecipes,
        saveRecipeFromSearch,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        refreshRecipes,
      }}
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
