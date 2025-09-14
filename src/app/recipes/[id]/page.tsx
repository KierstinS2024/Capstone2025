// path: src/app/recipes/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRecipe } from "@/context/RecipeContext";
import { useAuth } from "@/context/AuthContext";
import { getRecipeById } from "@/lib/spoonacularApi";
import "@/styles/recipe-detail.css";

interface RecipeDetailPageProps {
  id: string;
}

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { recipes } = useRecipe();

  const [recipe, setRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  // Fetch recipe data
  useEffect(() => {
    async function fetchRecipe() {
      try {
        setLoading(true);

        // Check local recipes first
        const localRecipe = recipes.find((r) => r._id === id);
        if (localRecipe) {
          setRecipe(localRecipe);
          return;
        }

        // Otherwise, fetch from Spoonacular
        if (id) {
          const data = await getRecipeById(id);
          setRecipe(data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchRecipe();
  }, [id, recipes, user]);

  if (authLoading || loading)
    return <p className="loading">Loading recipe...</p>;
  if (!user) return null;
  if (error) return <p className="error">{error}</p>;
  if (!recipe) return <p className="empty-state">Recipe not found.</p>;

  return (
    <div className="recipe-detail-page">
      <h1 className="recipe-title">{recipe.title}</h1>
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      )}

      {recipe.extendedIngredients && (
        <>
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.extendedIngredients.map((ing: any) => (
              <li key={ing.id}>{ing.original}</li>
            ))}
          </ul>
        </>
      )}

      {recipe.instructions && (
        <>
          <h2>Instructions</h2>
          <div
            className="instructions"
            dangerouslySetInnerHTML={{ __html: recipe.instructions }}
          />
        </>
      )}
    </div>
  );
}
