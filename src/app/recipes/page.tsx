// path: src/app/recipes/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getRecipes } from "@/lib/spoonacularApi"; // your wrapper to fetch recipes
import { Recipe } from "@/types/recipe";
import RecipeCard from "@/components/RecipeCard";
import "@/styles/recipes.css";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (err: any) {
        setError(err.message || "Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  if (loading) return <p className="loading">Loading recipes...</p>;
  if (error) return <p className="error">{error}</p>;
  if (recipes.length === 0)
    return <p className="empty-state">No recipes found.</p>;

  return (
    <div className="recipes-page">
      <h1 className="page-title">Recipes</h1>
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
