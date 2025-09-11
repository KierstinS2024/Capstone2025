// Path: src/hooks/useGuestRecipes.ts
"use client";

import { useEffect, useState } from "react";
import type { Recipe } from "@/types/recipe";

/**
 * Hook: Fetch recipes for Guest Mode from Spoonacular API
 * Returns an array of Recipe objects and loading state
 */
export const useGuestRecipes = () => {
  const [guestRecipes, setGuestRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuestRecipes = async () => {
      try {
        setLoading(true);

        // Call Spoonacular API for 5 recipes
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?number=5&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`
        );
        const data = await response.json();

        // Map API response to Recipe type
        const mappedRecipes: Recipe[] = data.results.map((r: any) => ({
          _id: r.id.toString(),
          userId: "guest", // all guest recipes are owned by "guest"
          title: r.title,
          ingredients: [],
          instructions: "",
          source: "spoonacular",
          favorite: false,
          image: r.image,
        }));

        setGuestRecipes(mappedRecipes);
      } catch (err) {
        console.error("Failed to fetch guest recipes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuestRecipes();
  }, []);

  return { guestRecipes, loading };
};
