// ===========================================
// PATH: src/app/recipes/page.tsx
// High-end Recipe Page
// Features:
// - User-specific "Your Recipes"
// - Spoonacular search with daily limit handling
// - Recipe save/delete logic
// - Recipe modal for full details
// - Finite grids (no infinite scroll)
// - Loading and error feedback
// ===========================================
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import RecipeCard from "@/components/RecipeCard";
import RecipeModal from "@/components/RecipeModal";
import AddRecipeForm from "@/components/AddRecipeForm";
import { useRecipes } from "@/context/RecipeContext";
import { Recipe } from "@/types/recipe";

export default function RecipesPage() {
  const { recipes: userRecipes, searchSpoonacular, addRecipe } = useRecipes();

  const [searchQuery, setSearchQuery] = useState(""); // Search bar query
  const [spoonacularResults, setSpoonacularResults] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loadingSpoonacular, setLoadingSpoonacular] = useState(false);
  const [spoonacularError, setSpoonacularError] = useState<string | null>(null);
  const [savingRecipeIds, setSavingRecipeIds] = useState<Set<string>>(
    new Set()
  );
  const [showAddRecipeForm, setShowAddRecipeForm] = useState(false);

  // Current user email for user-specific filtering
  const currentUserEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  // -----------------------------
  // Spoonacular search effect
  // -----------------------------
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSpoonacularResults([]);
      setSpoonacularError(null);
      return;
    }

    const fetchResults = async () => {
      setLoadingSpoonacular(true);
      setSpoonacularError(null);

      try {
        const results = await searchSpoonacular(searchQuery);
        setSpoonacularResults(results);
      } catch (err: any) {
        setSpoonacularError(
          err.message === "quota"
            ? "Daily Spoonacular limit reached. Please try again tomorrow."
            : "Spoonacular search failed. Try again later."
        );
      } finally {
        setLoadingSpoonacular(false);
      }
    };

    fetchResults();
  }, [searchQuery, searchSpoonacular]);

  // -----------------------------
  // Save Spoonacular recipe
  // -----------------------------
  const handleSaveRecipe = async (id: string) => {
    if (savingRecipeIds.has(id)) return; // prevent duplicate saves
    setSavingRecipeIds((prev) => new Set(prev).add(id));

    try {
      await addRecipe(Number(id)); // fetch & save Spoonacular recipe
      alert("Recipe saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save recipe.");
    } finally {
      setSavingRecipeIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // -----------------------------
  // Filter user's saved recipes
  // -----------------------------
  const filteredUserRecipes = userRecipes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <main style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "1rem" }}>Recipes</h1>

        {/* Search input + Add Recipe button */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={() => setShowAddRecipeForm(true)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              backgroundColor: "#3498db",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            + Add Recipe
          </button>
        </div>

        {/* Add Recipe Modal */}
        {showAddRecipeForm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              padding: "1rem",
            }}
            onClick={() => setShowAddRecipeForm(false)}
          >
            <div
              style={{ maxWidth: "500px", width: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <AddRecipeForm />
            </div>
          </div>
        )}

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* ----------------------------- */}
          {/* User Recipes */}
          {/* ----------------------------- */}
          <div>
            <h2>Your Recipes</h2>
            {filteredUserRecipes.length === 0 ? (
              <p>No recipes found.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "1rem",
                }}
              >
                {filteredUserRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    currentUserEmail={currentUserEmail}
                    onClick={() => setSelectedRecipe(recipe)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ----------------------------- */}
          {/* Spoonacular Search Results */}
          {/* ----------------------------- */}
          <div>
            <h2>Spoonacular</h2>
            {spoonacularError && (
              <p style={{ color: "red" }}>{spoonacularError}</p>
            )}
            {!spoonacularError && loadingSpoonacular && <p>Loading...</p>}
            {!loadingSpoonacular &&
              spoonacularResults.length === 0 &&
              searchQuery && <p>No results found.</p>}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              {spoonacularResults.map((result) => (
                <RecipeCard
                  key={result.id}
                  recipe={result}
                  currentUserEmail={currentUserEmail}
                  onClick={() => setSelectedRecipe(result)}
                  onSave={() => handleSaveRecipe(result.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ----------------------------- */}
        {/* Recipe Modal */}
        {/* ----------------------------- */}
        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </main>
    </>
  );
}
