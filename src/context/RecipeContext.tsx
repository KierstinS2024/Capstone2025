// PATH: src/context/RecipeContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getSpoonacularRecipe as apiGetSpoonacularRecipe,
  searchSpoonacular as apiSearchSpoonacular,
} from "@/lib/spoonacularApi";

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  createdAt?: string;
  updatedAt?: string;
  source?: "user" | "spoonacular";
  image?: string;
}

interface RecipeContextType {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  fetchRecipes: () => Promise<void>;
  getRecipe: (id: string) => Recipe | undefined;
  fetchRecipe: (id: string) => Promise<Recipe | undefined>;
  addRecipe: (recipe: Omit<Recipe, "id"> | number) => Promise<Recipe>;
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

  const normalize = (r: any): Recipe => ({
    id: r._id,
    title: r.title,
    instructions: r.instructions,
    ingredients: r.ingredients,
    source: r.source || "user",
    image: r.image,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  });

  // Fetch all user recipes from backend
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

  // Get recipe from local state
  function getRecipe(id: string): Recipe | undefined {
    return recipes.find((r) => r.id === id);
  }

  // Fetch recipe (async) - local or Spoonacular
  async function fetchRecipe(id: string): Promise<Recipe | undefined> {
    const local = getRecipe(id);
    if (local) return local;

    try {
      const spoon = await getSpoonacularRecipe(id);
      return spoon;
    } catch (err) {
      console.error("Failed to fetch recipe:", err);
      return undefined;
    }
  }

  // Add recipe - either Spoonacular ID or user-created
  async function addRecipe(
    recipeOrId: Omit<Recipe, "id"> | number
  ): Promise<Recipe> {
    try {
      let recipeData: Omit<Recipe, "id">;

      if (typeof recipeOrId === "number") {
        const spoon = await getSpoonacularRecipe(recipeOrId.toString());
        recipeData = {
          title: spoon.title,
          instructions: spoon.instructions || "No instructions provided.",
          ingredients: spoon.ingredients || [],
          image: spoon.image,
          source: "user",
        };
      } else {
        recipeData = recipeOrId;
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

  async function deleteRecipe(id: string) {
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete recipe");
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function getSpoonacularRecipe(id: string): Promise<Recipe> {
    const data = await apiGetSpoonacularRecipe(id);
    return {
      id: data.id.toString(),
      title: data.title,
      instructions: data.instructions || "",
      ingredients: data.extendedIngredients?.map((i: any) => i.original) || [],
      image: data.image,
      source: "spoonacular",
    };
  }

  async function searchSpoonacular(query: string): Promise<Recipe[]> {
    const data = await apiSearchSpoonacular(query);
    return (data.results || []).map((r: any) => ({
      id: r.id.toString(),
      title: r.title,
      instructions: r.instructions || "",
      ingredients: r.extendedIngredients?.map((i: any) => i.original) || [],
      image: r.image,
      source: "spoonacular",
    }));
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

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context)
    throw new Error("useRecipes must be used within RecipeProvider");
  return context;
}
