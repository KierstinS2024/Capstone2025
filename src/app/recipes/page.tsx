// Path: src/app/recipes/page.tsx
"use client";

import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import type { Recipe } from "@/types/recipe";
import MealPlanCard from "@/components/MealPlanCard";
import AddMealForm from "@/components/AddMealForm";

const RecipesPage: React.FC = () => {
  const { recipes, spoonacularResults, loading, searchSpoonacularRecipes } =
    useRecipes();
  const [query, setQuery] = useState("");
  const [addingMeal, setAddingMeal] = useState<{
    recipe: Recipe;
    mealType: string;
  } | null>(null);

  const handleSearch = () => {
    if (query.trim()) searchSpoonacularRecipes(query.trim());
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>
        Recipes
      </h1>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Spoonacular recipes..."
          style={{
            padding: 8,
            width: "60%",
            marginRight: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSearch}
          style={{ padding: "8px 16px", borderRadius: 4 }}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {/* Spoonacular Results */}
      {spoonacularResults.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {spoonacularResults.map((r) => (
            <div
              key={r._id}
              style={{
                border: "1px solid #d8cfc4",
                borderRadius: 8,
                padding: 16,
                width: 200,
              }}
            >
              {r.image && (
                <img
                  src={r.image}
                  alt={r.title}
                  style={{ width: "100%", borderRadius: 6, marginBottom: 8 }}
                />
              )}
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{r.title}</h3>
              <button
                onClick={() => setAddingMeal({ recipe: r, mealType: "Lunch" })}
                style={{ marginTop: 8 }}
              >
                + Add Meal
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Local recipes */}
      {recipes.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2>My Recipes</h2>
          <ul>
            {recipes.map((r) => (
              <li key={r._id}>{r.title}</li>
            ))}
          </ul>
        </div>
      )}

      {/* AddMeal Modal */}
      {addingMeal && (
        <AddMealForm
          mealType={addingMeal.mealType as any}
          onClose={() => setAddingMeal(null)}
        />
      )}
    </div>
  );
};

export default RecipesPage;
