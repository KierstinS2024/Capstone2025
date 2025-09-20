// ===========================================
// PATH: src/context/RecipeContext.tsx
// ===========================================
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Recipe } from "@/types/recipe";
import {
  getSpoonacularRecipe as apiGetSpoonacularRecipe,
  searchSpoonacular as apiSearchSpoonacular,
} from "@/lib/spoonacularApi";

interface RecipeContextType {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  fetchRecipes: () => Promise<void>;
  getRecipe: (id: string) => Recipe | undefined;
  fetchRecipe: (id: string) => Promise<Recipe | undefined>;
  addRecipe: (
    recipe: Partial<Omit<Recipe, "id">> | number,
    temporary?: boolean,
    linkedMealPlanId?: string
  ) => Promise<Recipe>;
  unlinkTemporaryRecipe: (id: string) => Promise<void>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  getSpoonacularRecipe: (id: string) => Promise<Recipe>;
  searchSpoonacular: (query: string) => Promise<Recipe[]>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Normalize API response to Recipe type
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
    temporary: r.temporary,
    linkedMealPlanIds: r.linkedMealPlanIds || [],
  });

  // -----------------------------
  // Fetch all recipes from backend
  // -----------------------------
  async function fetchRecipes() {
    try {
      setLoading(true);
      const res = await fetch("/api/recipes");
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
  // Fetch recipe from local or Spoonacular API
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
  // Add a new recipe
  // - Supports temporary Spoonacular recipes
  // - Optionally link to a meal plan
  // -----------------------------
  async function addRecipe(
    recipeOrId: Partial<Omit<Recipe, "id">> | number,
    temporary = false,
    linkedMealPlanId?: string
  ): Promise<Recipe> {
    try {
      let recipeData: Partial<Omit<Recipe, "id">>;

      if (typeof recipeOrId === "number") {
        // Fetch from Spoonacular API if ID is numeric
        const spoon = await apiGetSpoonacularRecipe(recipeOrId.toString());
        recipeData = {
          title: spoon.title,
          instructions: spoon.instructions || "No instructions provided.",
          ingredients: spoon.ingredients || [],
          image: spoon.image,
          source: "spoonacular",
          temporary,
          linkedMealPlanIds: linkedMealPlanId ? [linkedMealPlanId] : [],
        };
      } else {
        // Otherwise, use provided data
        recipeData = {
          ...recipeOrId,
          temporary,
          linkedMealPlanIds: linkedMealPlanId
            ? [...(recipeOrId.linkedMealPlanIds || []), linkedMealPlanId]
            : recipeOrId.linkedMealPlanIds || [],
        };
      }

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });

      if (!res.ok) throw new Error("Failed to save recipe");

      const newRecipe = normalize(await res.json());
      setRecipes((prev) => [newRecipe, ...prev]);
      return newRecipe;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  // -----------------------------
  // Remove a temporary recipe
  // - Typically called when removing a meal from a plan
  // -----------------------------
  async function unlinkTemporaryRecipe(id: string) {
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove temporary recipe");
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      console.error(err);
    }
  }

  // -----------------------------
  // Update a recipe
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
  // Delete a recipe
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
  // Spoonacular API helpers
  // -----------------------------
  async function getSpoonacularRecipe(id: string) {
    return apiGetSpoonacularRecipe(id);
  }

  async function searchSpoonacular(query: string) {
    return apiSearchSpoonacular(query);
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

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
        unlinkTemporaryRecipe,
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
// Hook to use RecipeContext
// -----------------------------
export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context)
    throw new Error("useRecipes must be used within RecipeProvider");
  return context;
}
