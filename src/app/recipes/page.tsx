// ===========================================
// PATH: src/app/recipes/page.tsx
// RecipesPage — displays user recipes + Spoonacular search
// Fully integrated add/delete handling for card & modal
// Includes debounce for search and unified RecipeCard usage
// ===========================================
"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import RecipeCard from "@/components/RecipeCard";
import RecipeModal from "@/components/RecipeModal";
import AddRecipeForm from "@/components/AddRecipeForm";
import { useRecipes } from "@/context/RecipeContext";
import { Recipe } from "@/types/recipe";

export default function RecipesPage() {
  const { recipes, searchSpoonacular, addRecipe, deleteRecipe } = useRecipes();

  // -----------------------------
  // Component state
  // -----------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [spoonacularResults, setSpoonacularResults] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loadingSpoonacular, setLoadingSpoonacular] = useState(false);
  const [spoonacularError, setSpoonacularError] = useState<string | null>(null);
  const [savingRecipeIds, setSavingRecipeIds] = useState<Set<string>>(
    new Set()
  );
  const [showAddRecipeForm, setShowAddRecipeForm] = useState(false);

  // -----------------------------
  // Debounce timer for Spoonacular search
  // -----------------------------
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      // Reset results if query is empty
      setSpoonacularResults([]);
      setSpoonacularError(null);
      return;
    }

    // Clear previous debounce timer
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    // Set new debounce timer
    searchTimeout.current = setTimeout(async () => {
      setLoadingSpoonacular(true);
      setSpoonacularError(null);

      try {
        const results = await searchSpoonacular(searchQuery);
        setSpoonacularResults(results);
      } catch (err: any) {
        setSpoonacularError(
          err.message === "quota"
            ? "Daily Spoonacular limit reached. Try again tomorrow."
            : "Spoonacular search failed. Try again later."
        );
      } finally {
        setLoadingSpoonacular(false);
      }
    }, 500); // 500ms debounce
  }, [searchQuery, searchSpoonacular]);

  // -----------------------------
  // Save Spoonacular recipe
  // -----------------------------
  const handleSaveRecipe = async (id: string) => {
    if (savingRecipeIds.has(id)) return; // prevent double clicks
    setSavingRecipeIds((prev) => new Set(prev).add(id));

    try {
      await addRecipe(Number(id));
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
  // Delete recipe handler (updates grid immediately)
  // -----------------------------
  const handleDeleteRecipe = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await deleteRecipe(id);
      if (selectedRecipe?.id === id) setSelectedRecipe(null); // close modal if deleted
    } catch (err) {
      console.error("Failed to delete recipe", err);
    }
  };

  // -----------------------------
  // Filter user recipes by search query
  // -----------------------------
  const filteredUserRecipes = recipes.filter((r) =>
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

        {/* Add Recipe Form Modal */}
        {showAddRecipeForm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            <AddRecipeForm
              onClose={() => setShowAddRecipeForm(false)}
              onSuccess={(newRecipe) => {
                setSelectedRecipe(newRecipe); // open modal for new recipe
                setShowAddRecipeForm(false);
              }}
            />
          </div>
        )}

        {/* User Recipes */}
        <h2>Your Recipes</h2>
        {filteredUserRecipes.length === 0 && <p>No recipes found.</p>}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {filteredUserRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onDelete={handleDeleteRecipe} // user-owned: allow delete
            />
          ))}
        </div>

        {/* Spoonacular Results */}
        {searchQuery && (
          <>
            <h2>Spoonacular Results</h2>
            {loadingSpoonacular && <p>Loading...</p>}
            {spoonacularError && <p>{spoonacularError}</p>}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              {spoonacularResults.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)} // opens modal
                  onDelete={undefined} // read-only
                >
                  {/* Extra Save button (child prop) */}
                  <button
                    disabled={savingRecipeIds.has(recipe.id)}
                    onClick={(e) => {
                      e.stopPropagation(); // prevent modal open
                      handleSaveRecipe(recipe.id);
                    }}
                    style={{
                      flex: 1,
                      padding: "0.25rem",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "#2ecc71",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {savingRecipeIds.has(recipe.id) ? "Saving..." : "Save"}
                  </button>
                </RecipeCard>
              ))}
            </div>
          </>
        )}

        {/* Recipe Modal */}
        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            onDelete={handleDeleteRecipe}
          />
        )}
      </main>
    </>
  );
}
