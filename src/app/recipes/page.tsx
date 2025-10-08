// ===========================================
// PATH: src/app/recipes/page.tsx
// Recipes Page — mobile-first, polished, with Add Recipe modal
// ===========================================
"use client";

import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import RecipeCard from "@/components/RecipeCard";
import AddRecipeForm from "@/components/AddRecipeForm";
import { Recipe } from "@/types/recipe";
import styles from "@/styles/recipePage.module.css"; // Dedicated CSS for recipes page

export default function RecipesPage() {
  const {
    recipes, // Saved recipes from DB
    loading, // Loading state for Spoonacular search
    searchResults, // Spoonacular search results
    searchRecipes, // Function to query Spoonacular
    saveRecipeFromSearch,
    deleteRecipe, // Delete recipe from DB
  } = useRecipes();

  // Local state for search input
  const [query, setQuery] = useState("");

  // Local state to control Add Recipe modal visibility
  const [addModalOpen, setAddModalOpen] = useState(false);

  // -----------------------------
  // Handle Spoonacular search submit
  // -----------------------------
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await searchRecipes(query.trim());
  };

  return (
    <div className={styles.recipesPage}>
      {/* ---------- PAGE TITLE ---------- */}
      <h1 className={styles.recipesTitle}>Recipes</h1>

      {/* ---------- SEARCH BAR ---------- */}
      <form className={styles.recipesSearchForm} onSubmit={handleSearch}>
        <input
          type="text"
          className={styles.recipesSearchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
        />
        <button type="submit" className={styles.recipesSearchButton}>
          Search
        </button>
      </form>

      {/* ---------- MAIN LAYOUT ---------- */}
      <div className={styles.recipesLayout}>
        {/* ---------- LEFT COLUMN: SAVED RECIPES ---------- */}
        <div className={styles.recipesSaved}>
          <div className={styles.recipesSavedHeader}>
            <h2 className={styles.recipesSubtitle}>My Recipes</h2>

            {/* Add Recipe button triggers modal */}
            <button
              className={styles.addButton}
              onClick={() => setAddModalOpen(true)}
            >
              + Add
            </button>
          </div>

          {/* Empty state */}
          {recipes.length === 0 && (
            <p className={styles.recipesEmpty}>No recipes saved yet.</p>
          )}

          {/* Saved recipes list */}
          <div className={styles.recipesSavedList}>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={deleteRecipe}
              />
            ))}
          </div>
        </div>

        {/* ---------- RIGHT COLUMN: SEARCH RESULTS ---------- */}
        <div className={styles.recipesSearchResults}>
          <h2 className={styles.recipesSubtitle}>Search Results</h2>

          {loading && <p className={styles.recipesLoading}>Loading...</p>}

          {!loading && searchResults.length === 0 && (
            <p className={styles.recipesEmpty}>
              Search above to find new recipes.
            </p>
          )}

          <div className={styles.recipesResultsList}>
            {searchResults.map((recipe: Recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                // Save button inside RecipeCard handles saving
              />
            ))}
          </div>
        </div>
      </div>

      {/* ---------- ADD RECIPE MODAL ---------- */}
      {addModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            {/* Modal header */}
            <div className={styles.modalHeader}>
              <h2>Add Recipe</h2>
              <button
                className={styles.closeButton}
                onClick={() => setAddModalOpen(false)}
              >
                &times;
              </button>
            </div>

            {/* AddRecipeForm accepts onClose to close modal */}
            <AddRecipeForm onClose={() => setAddModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
