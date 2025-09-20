// PATH: src/app/recipes/page.tsx
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
  const filteredUserRecipes = (userRecipes || []).filter(
    (r): r is Recipe =>
      !!r &&
      typeof r.title === "string" &&
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Spoonacular search fetch
  const fetchSpoonacular = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setLoadingSpoonacular(true);
    setSpoonacularError(null); // reset error before fetch

    try {
      const results = await searchSpoonacular(searchQuery);
      setSpoonacularResults((prev) =>
        spoonacularPage === 1 ? results : [...prev, ...results]
      );
      if (results.length === 0) setHasMore(false);
    } catch (err: any) {
      if (err.message === "quota") {
        setSpoonacularError(
          "Daily Spoonacular limit reached. Please try again tomorrow."
        );
      } else {
        setSpoonacularError("Spoonacular search failed. Try again later.");
        console.error("Spoonacular search failed", err);
      }
    } finally {
      setLoadingSpoonacular(false);
    }
  }, [searchQuery, spoonacularPage, searchSpoonacular]);

  // Reset Spoonacular results when query changes
  useEffect(() => {
    setSpoonacularResults([]);
    setSpoonacularPage(1);
    setHasMore(true);
    setSpoonacularError(null);
  }, [searchQuery]);

  useEffect(() => {
    fetchSpoonacular();
  }, [fetchSpoonacular, spoonacularPage]);

  const handleSaveSpoonacular = async (id: string) => {
    if (savingRecipeIds.has(id)) return;

    setSavingRecipeIds((prev) => new Set(prev).add(id));
    try {
      const recipe = spoonacularResults.find((r) => r.id === id);
      if (recipe) await addRecipe(recipe);
      alert("Recipe saved!");
    } catch (err) {
      console.error(err);
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
        <h1>Recipes</h1>

        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* User Recipes */}
          <div style={{ flex: 1 }}>
            <h2>Your Recipes</h2>
            {filteredUserRecipes.length === 0 ? (
              <p>No recipes found.</p>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {filteredUserRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => setSelectedRecipe(recipe)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Spoonacular Results */}
          <div style={{ flex: 1 }}>
            <h2>Spoonacular</h2>
            {spoonacularError ? (
              <p style={{ color: "red" }}>{spoonacularError}</p>
            ) : spoonacularResults.length === 0 &&
              searchQuery &&
              !loadingSpoonacular ? (
              <p>No results found.</p>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {spoonacularResults.map((result, index) => {
                  const isSaving = savingRecipeIds.has(result.id);
                  const isLast = index === spoonacularResults.length - 1;
                  return (
                    <div
                      key={result.id}
                      ref={isLast ? lastRecipeRef : null}
                      style={{ position: "relative" }}
                    >
                      <RecipeCard
                        recipe={result}
                        onClick={() => setSelectedRecipe(result)}
                      />
                      <button
                        onClick={() => handleSaveSpoonacular(result.id)}
                        disabled={isSaving}
                        style={{
                          position: "absolute",
                          top: "0.5rem",
                          right: "0.5rem",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.8rem",
                        }}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
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
