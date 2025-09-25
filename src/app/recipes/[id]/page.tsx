// ===========================================
// PATH: src/app/recipes/[id]/page.tsx
// RecipeDetailPage — shows full recipe details
// Now supports fallback fetch if recipe not in context
// ===========================================

"use client";

import { useParams } from "next/navigation";
import { useRecipes } from "@/context/RecipeContext";
import RecipeDetail from "@/components/RecipeDetail";
import React, { useEffect, useState } from "react";
import { Recipe } from "@/types/recipe";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { recipes } = useRecipes();

  // First check in context
  const contextRecipe = recipes.find((r) => r.id === id);

  // Local state for fallback
  const [fetchedRecipe, setFetchedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contextRecipe || !id) return; // already have it

    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) throw new Error("Failed to load recipe");
        const data = await res.json();
        setFetchedRecipe(data);
      } catch (err: any) {
        console.error("Error fetching recipe:", err);
        setError("Recipe not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, contextRecipe]);

  const recipe = contextRecipe || fetchedRecipe;

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return <RecipeDetail recipe={recipe} />;
}
