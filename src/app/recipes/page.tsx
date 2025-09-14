// path: src/app/recipes/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRecipe } from "@/context/RecipeContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getRecipesFromSpoonacular } from "@/lib/spoonacularApi";
import RecipeCard from "@/components/RecipeCard";
import "@/styles/recipes.css";

export default function RecipesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const { recipes, fetchRecipes } = useRecipe();
  const [spoonacularRecipes, setSpoonacularRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  // Fetch local and Spoonacular recipes
  useEffect(() => {
    async function loadRecipes() {
      try {
        setLoading(true);
        await fetchRecipes(); // local recipes from context
        const spoonData = await getRecipesFromSpoonacular();
        setSpoonacularRecipes(spoonData);
      } catch (err: any) {
        setError(err.message || "Failed to load recipes");
      } finally {
        setLoading(false);
      }
    }

    if (user) loadRecipes();
  }, [user, fetchRecipes]);

  if (authLoading || loading)
    return <p className="loading">Loading recipes...</p>;
  if (!user) return null;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="recipes-page">
      <h1 className="page-title">Recipes</h1>

      <h2 className="section-title">Your Recipes</h2>
      {recipes.length === 0 ? (
        <p className="empty-state">You have no saved recipes yet.</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}

      <h2 className="section-title">Discover Recipes (Spoonacular)</h2>
      {spoonacularRecipes.length === 0 ? (
        <p className="empty-state">No recipes found from Spoonacular.</p>
      ) : (
        <div className="recipe-grid">
          {spoonacularRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={{
                id: recipe.id.toString(),
                title: recipe.title,
                image: recipe.image,
                source: "spoonacular",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
