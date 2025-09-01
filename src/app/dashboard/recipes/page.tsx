/* src/app/dashboard/recipes/page.tsx */
"use client";

import React, { useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import SearchBar from "@/components/SearchBar";
import styles from "./RecipesPage.module.css";

interface Recipe {
  _id?: string; // For MongoDB recipes
  id?: number; // For external API recipes
  name: string;
  description?: string;
  cuisine?: string;
  image?: string;
  userSubmitted?: boolean;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Handle search queries
  const handleSearch = async (query: string) => {
    if (!query) return;

    try {
      const res = await fetch(`/api/external/recipes?query=${query}`);
      const data = await res.json();

      // Map external API results to internal Recipe type
      const mapped = (data.results || []).map((r: any) => ({
        id: r.id,
        name: r.title,
        description: r.summary?.replace(/<[^>]+>/g, ""), // Strip HTML tags
        image: r.image,
        cuisine: r.cuisines?.[0],
        userSubmitted: false,
      }));

      setRecipes(mapped);
    } catch (err) {
      console.error("Failed to fetch recipes", err);
      setRecipes([]);
    }
  };

  return (
    <main className={styles.container}>
      {/* Page title */}
      <h1 className={styles.title}>Find Recipes</h1>

      {/* Search input */}
      <SearchBar onSearch={handleSearch} />

      {/* Recipes grid */}
      {recipes.length > 0 ? (
        <div className={styles.grid}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id || recipe._id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p className={styles.emptyMessage}>
          No recipes yet. Try searching above!
        </p>
      )}
    </main>
  );
}
