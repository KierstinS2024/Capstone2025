// path: src/app/recipes/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRecipes } from "@/context/RecipeContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import "@/styles/recipes.css";

export default function RecipesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { recipes, loading: recipesLoading, search } = useRecipes();

  const [query, setQuery] = useState("");

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  // Handle search form
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await search(query.trim());
  };

  if (authLoading) return <p className="loading">Loading...</p>;
  if (!user) return null;

  return (
    <div className="recipes-page">
      <h1 className="page-title">Discover Recipes</h1>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input"
        />
        <button type="submit" className="button">
          Search
        </button>
      </form>

      {recipesLoading ? (
        <p className="loading">Searching recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="empty-state">No recipes found.</p>
      ) : (
        <div className="recipes-list">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
