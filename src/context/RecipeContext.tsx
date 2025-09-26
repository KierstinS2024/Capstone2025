// ===========================================
// PATH: src/context/RecipeContext.tsx
// RecipeContext — manages user and Spoonacular recipes
// - Provides functions to fetch, add, update, delete, and search recipes
// - Single source of truth for recipe data
// ===========================================
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Recipe } from "@/types/recipe";
import {
  getSpoonacularRecipe as apiGetSpoonacularRecipe,
  searchSpoonacular as apiSearchSpoonacular,
} from "@/lib/spoonacularApi";

// -----------------------------
// Context type definition
// -----------------------------
interface RecipeContextType {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  fetchRecipes: () => Promise<void>;
  getRecipe: (id: string) => Recipe | undefined;
  fetchRecipe: (id: string) => Promise<Recipe | undefined>;
  addRecipe: (recipe: Partial<Omit<Recipe, "id">> | number) => Promise<Recipe>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  getSpoonacularRecipe: (id: string) => Promise<Recipe>;
  searchSpoonacular: (query: string) => Promise<Recipe[]>;
}

// -----------------------------
// Create context
// -----------------------------
const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// -----------------------------
// RecipeProvider — wraps app and provides recipe state & functions
// -----------------------------
export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Normalize backend/Spoonacular recipe to app Recipe type
  // -----------------------------
  const normalize = (r: any): Recipe => ({
    id: r._id || r.id,
    title: r.title,
    instructions: r.instructions,
    ingredients: r.ingredients,
    source: r.source || "user",
    image: r.image,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    author: r.author || null,
  });

  // -----------------------------
  // Fetch all recipes for the current user
  // -----------------------------
  async function fetchRecipes() {
    try {
      setLoading(true);

      const userEmail =
        typeof window !== "undefined"
          ? localStorage.getItem("userEmail")
          : null;

      const res = await fetch(`/api/recipes?author=${userEmail}`);
      if (!res.ok) throw new Error("Failed to fetch recipes");

      const data = await res.json();
      setRecipes(data.map(normalize));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // Get recipe from local state
  // -----------------------------
  function getRecipe(id: string) {
    return recipes.find((r) => r.id === id);
  }

  // -----------------------------
  // Fetch recipe from local state or Spoonacular API
  // -----------------------------
  async function fetchRecipe(id: string): Promise<Recipe | undefined> {
    const local = getRecipe(id);
    if (local) return local;

    try {
      const spoon = await apiGetSpoonacularRecipe(id);
      return spoon;
    } catch (err) {
      console.error("Failed to fetch recipe:", err);
      return undefined;
    }
  }

  // -----------------------------
  // Add a recipe (user or Spoonacular)
  // -----------------------------
  async function addRecipe(
    recipeOrId: Partial<Omit<Recipe, "id">> | number
  ): Promise<Recipe> {
    try {
      const userEmail =
        typeof window !== "undefined"
          ? localStorage.getItem("userEmail")
          : null;
      if (!userEmail) throw new Error("User not logged in");

      let recipeData: Partial<Omit<Recipe, "id">>;

      if (typeof recipeOrId === "number") {
        // Saving a Spoonacular recipe
        const spoon = await apiGetSpoonacularRecipe(recipeOrId.toString());
        recipeData = {
          title: spoon.title,
          instructions: spoon.instructions || "",
          ingredients: spoon.ingredients || [],
          image: spoon.image,
          source: "spoonacular",
          author: userEmail,
        };
      } else {
        // User-created recipe
        recipeData = {
          ...recipeOrId,
          author: userEmail,
        };
      }

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });

      if (!res.ok) throw new Error("Failed to save recipe");

      const newRecipe = normalize(await res.json());
      setRecipes((prev) => [newRecipe, ...prev]); // Update local state optimistically

      return newRecipe;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  // -----------------------------
  // Update a user-owned recipe
  // -----------------------------
  async function updateRecipe(id: string, updates: Partial<Recipe>) {
    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update recipe");

      const updated = normalize(await res.json());
      setRecipes((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err: any) {
      setError(err.message);
    }
  }

  // -----------------------------
  // Delete a user-owned recipe
  // -----------------------------
  async function deleteRecipe(id: string) {
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete recipe");

      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  // -----------------------------
  // Spoonacular helpers
  // -----------------------------
  async function getSpoonacularRecipe(id: string) {
    return apiGetSpoonacularRecipe(id);
  }

  async function searchSpoonacular(query: string) {
    return apiSearchSpoonacular(query);
  }

  // -----------------------------
  // Initial fetch on mount
  // -----------------------------
  useEffect(() => {
    fetchRecipes();
  }, []);

  // -----------------------------
  // Provide context values
  // -----------------------------
  return (
    <RecipeContext.Provider
      value={{
        recipes,
        loading,
        error,
        fetchRecipes,
        getRecipe,
        fetchRecipe,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        getSpoonacularRecipe,
        searchSpoonacular,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

// -----------------------------
// Hook for using RecipeContext
// -----------------------------
export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context)
    throw new Error("useRecipes must be used within RecipeProvider");
  return context;
}
