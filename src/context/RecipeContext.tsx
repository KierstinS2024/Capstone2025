// ===========================================
// PATH: src/context/RecipeContext.tsx
// RecipeContext — manages recipes (user + saved Spoonacular)
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
  // Normalize backend/Spoonacular response to Recipe type
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
    author: r.author || null,
  });

  // -----------------------------
  // Fetch user-specific recipes
  // -----------------------------
  async function fetchRecipes() {
    try {
      setLoading(true);

      const userEmail =
        typeof window !== "undefined"
          ? localStorage.getItem("userEmail")
          : null;

      // Fetch only recipes created by the current user
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
  // Fetch recipe (local or Spoonacular API)
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
  // Supports temporary Spoonacular recipes
  // -----------------------------
  async function addRecipe(
    recipeOrId: Partial<Omit<Recipe, "id">> | number,
    temporary = false,
    linkedMealPlanId?: string
  ): Promise<Recipe> {
    try {
      const userEmail =
        typeof window !== "undefined"
          ? localStorage.getItem("userEmail")
          : null;
      if (!userEmail) throw new Error("User not logged in");

      let recipeData: Partial<Omit<Recipe, "id">>;

      if (typeof recipeOrId === "number") {
        // Save Spoonacular recipe
        const spoon = await apiGetSpoonacularRecipe(recipeOrId.toString());
        recipeData = {
          title: spoon.title,
          instructions: spoon.instructions || "",
          ingredients: spoon.ingredients || [],
          image: spoon.image,
          source: "spoonacular",
          temporary,
          linkedMealPlanIds: linkedMealPlanId ? [linkedMealPlanId] : [],
          author: userEmail,
        };
      } else {
        // User-created recipe
        recipeData = {
          ...recipeOrId,
          temporary,
          linkedMealPlanIds: linkedMealPlanId
            ? [...(recipeOrId.linkedMealPlanIds || []), linkedMealPlanId]
            : recipeOrId.linkedMealPlanIds || [],
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

      // Optimistically update local state so the UI updates instantly
      setRecipes((prev) => [newRecipe, ...prev]);

      return newRecipe; // <-- return the created recipe for immediate use
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  // -----------------------------
  // Remove temporary recipe (e.g., unlinked from meal plan)
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
  // Update user-owned recipe
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
  // Delete user-owned recipe
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
