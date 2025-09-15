// path: src/app/recipes/page.tsx
"use client";

import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import RecipeCard from "@/components/RecipeCard";
import "@/styles/recipes.css";

export default function RecipesPage() {
  const { recipes, loading, search } = useRecipes();
  const [query, setQuery] = useState("");

  // Handle search form submit
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await search(query);
  };

  return (
    <div className="recipes-page">
      <h2 className="page-title">Discover Recipes</h2>

      {/* Search bar */}
      <form className="recipe-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {/* Results */}
      {loading && <p className="loading">Searching recipes...</p>}
      {!loading && recipes.length === 0 && (
        <p className="empty-state">No recipes yet. Try searching!</p>
      )}
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
