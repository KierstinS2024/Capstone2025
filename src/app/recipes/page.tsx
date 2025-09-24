// ===========================================
// PATH: src/app/recipes/page.tsx
// ===========================================
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRecipes } from "@/context/RecipeContext";
import { Recipe } from "@/types/recipe";
import RecipeCard from "@/components/RecipeCard";
import RecipeModal from "@/components/RecipeModal";
import Navbar from "@/components/Navbar";

export default function RecipesPage() {
  const { recipes: userRecipes, searchSpoonacular, addRecipe } = useRecipes();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Spoonacular state
  const [spoonacularResults, setSpoonacularResults] = useState<Recipe[]>([]);
  const [spoonacularPage, setSpoonacularPage] = useState(1);
  const [loadingSpoonacular, setLoadingSpoonacular] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [savingRecipeIds, setSavingRecipeIds] = useState<Set<string>>(
    new Set()
  );
  const [spoonacularError, setSpoonacularError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  // Infinite scroll for Spoonacular
  const lastRecipeRef = useCallback(
    (node: HTMLDivElement) => {
      if (loadingSpoonacular) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setSpoonacularPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingSpoonacular, hasMore]
  );

  // Filter user recipes by search query
  const filteredUserRecipes = (userRecipes || []).filter((r): r is Recipe =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Spoonacular search
  const fetchSpoonacular = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setLoadingSpoonacular(true);
    setSpoonacularError(null);

    try {
      const results = await searchSpoonacular(searchQuery);
      setSpoonacularResults((prev) =>
        spoonacularPage === 1 ? results : [...prev, ...results]
      );
      if (results.length === 0) setHasMore(false);
    } catch (err: any) {
      setSpoonacularError(
        err.message === "quota"
          ? "Daily Spoonacular limit reached. Please try again tomorrow."
          : "Spoonacular search failed. Try again later."
      );
      console.error(err);
    } finally {
      setLoadingSpoonacular(false);
    }
  }, [searchQuery, spoonacularPage, searchSpoonacular]);

  // Reset Spoonacular results on query change
  useEffect(() => {
    setSpoonacularResults([]);
    setSpoonacularPage(1);
    setHasMore(true);
    setSpoonacularError(null);
  }, [searchQuery]);

  useEffect(() => {
    fetchSpoonacular();
  }, [fetchSpoonacular, spoonacularPage]);

  // Save a Spoonacular recipe to user collection
  const handleSaveSpoonacular = async (id: string) => {
    if (savingRecipeIds.has(id)) return;

    setSavingRecipeIds((prev) => new Set(prev).add(id));
    try {
      const userEmail = localStorage.getItem("userEmail") || "";
      await addRecipe(Number(id), userEmail);
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

  return (
    <>
      <Navbar />
      <main style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "1rem" }}>Recipes</h1>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "2rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* User Recipes */}
          <div>
            <h2 style={{ marginBottom: "1rem" }}>Your Recipes</h2>
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
                    currentUserEmail={localStorage.getItem("userEmail")}
                    onClick={() => setSelectedRecipe(recipe)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Spoonacular Results */}
          <div>
            <h2 style={{ marginBottom: "1rem" }}>Spoonacular</h2>
            {spoonacularError ? (
              <p style={{ color: "red" }}>{spoonacularError}</p>
            ) : spoonacularResults.length === 0 &&
              searchQuery &&
              !loadingSpoonacular ? (
              <p>No results found.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "1rem",
                }}
              >
                {spoonacularResults.map((result, index) => {
                  const isSaving = savingRecipeIds.has(result.id);
                  const isLast = index === spoonacularResults.length - 1;
                  return (
                    <div key={result.id} ref={isLast ? lastRecipeRef : null}>
                      <RecipeCard
                        recipe={result}
                        onClick={() => setSelectedRecipe(result)}
                        onSave={handleSaveSpoonacular}
                        currentUserEmail={localStorage.getItem("userEmail")}
                      />
                    </div>
                  );
                })}
                {loadingSpoonacular && <p>Loading more...</p>}
              </div>
            )}
          </div>
        </div>

        {/* Recipe Modal */}
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
