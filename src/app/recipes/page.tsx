// Path: src/app/recipes/page.tsx
// Recipes Page: displays all recipes in a grid with search/filter

"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRecipes } from "@/context/RecipeContext";
import RecipeCard from "@/components/RecipeCard";
import type { Recipe } from "@/types/recipe";

const RecipesPage: React.FC = () => {
  const { recipes } = useRecipes();
  const [searchQuery, setSearchQuery] = useState("");

  const safeRecipes = Array.isArray(recipes) ? recipes : [];

  const filteredRecipes = useMemo(() => {
    return safeRecipes.filter((recipe: Recipe) =>
      (recipe.title ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [safeRecipes, searchQuery]);

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "16px" }}>
        All Recipes 🍳
      </h1>

      {/* Search bar */}
      <div style={{ marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Recipe grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {filteredRecipes.map((recipe) => (
          <Link
            key={recipe._id}
            href={`/recipes/${recipe._id}`}
            style={{ textDecoration: "none" }}
          >
            <RecipeCard recipe={recipe} />
          </Link>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <p style={{ marginTop: "16px" }}>No recipes match your search.</p>
      )}
    </div>
  );
};

export default RecipesPage;
