// Path: src/context/RecipeContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Recipe, RecipeIngredient, RecipeSource } from "@/types/recipe";
import { searchRecipes as spoonacularSearch } from "@/lib/spoonacularApi";
import { useMealPlan } from "./MealPlanContext";
import { useGuest } from "./GuestContext";

interface RecipeContextType {
  recipes: Recipe[];
  spoonacularResults: Recipe[];
  loading: boolean;
  createRecipe: (recipe: Omit<Recipe, "_id">) => Promise<void>;
  searchSpoonacularRecipes: (query: string) => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [spoonacularResults, setSpoonacularResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const { addMeal } = useMealPlan();
  const { addMealToGuestPlan } = useGuest();

  // Add a new local recipe
  const createRecipe = async (recipe: Omit<Recipe, "_id">) => {
    setLoading(true);
    try {
      const newRecipe: Recipe = {
        ...recipe,
        _id: crypto.randomUUID(),
        favorite: false,
      };
      setRecipes((prev) => [...prev, newRecipe]);
    } catch (error) {
      console.error("Error creating recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search Spoonacular
  const searchSpoonacularRecipes = async (query: string) => {
    setLoading(true);
    try {
      const results = await spoonacularSearch(query);
      // Map SpoonacularRecipe to Recipe type
      const mapped: Recipe[] = results.map((r) => ({
        _id: `spoonacular-${r.id}`,
        userId: "spoonacular",
        title: r.title,
        ingredients: r.ingredients.map((i) => ({
          name: i.name,
          quantity: i.quantity || "",
          unit: "", // Spoonacular quantity already in string
        })),
        instructions: r.instructions || "",
        source: "spoonacular",
        favorite: false,
        image: r.image,
      }));
      setSpoonacularResults(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        spoonacularResults,
        loading,
        createRecipe,
        searchSpoonacularRecipes,
      }}
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
