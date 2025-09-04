// Path: src/app/dashboard/recipes/page.tsx
"use client";

/**
 * RecipesPage
 * --------------------
 * Dashboard for viewing, searching, creating, and editing recipes.
 * - Fetches both user-submitted and Spoonacular recipes
 * - Integrates SearchBar and RecipeForm
 * - Renders recipes in a responsive grid using RecipeCard
 * - Edit/Delete only for user recipes
 * - Auto-refreshes recipe list after creating or editing a recipe
 */

import { useState, useEffect } from "react";
import RecipeCard from "@/components/RecipeCard";
import SearchBar from "@/components/SearchBar";
import RecipeForm from "@/components/RecipeForm";
import styles from "./RecipesPage.module.css";
import sharedStyles from "./RecipesShared.module.css";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  ingredientId?: string;
}

interface Recipe {
  _id?: string;
  name: string;
  description: string;
  cuisine: string;
  ingredients: Ingredient[];
  instructions: string[];
  source: "user" | "spoonacular";
  externalId?: string;
}

export default function RecipesPage() {
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [spoonRecipes, setSpoonRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const fetchRecipes = async (query: string) => {
    setLoading(true);
    setError("");

    try {
      // Fetch user recipes
      const userRes = await fetch(
        `/api/recipes?search=${encodeURIComponent(query)}`
      );
      const userData = await userRes.json();
      const users: Recipe[] = (userData.recipes || []).map((r: any) => ({
        _id: r._id,
        name: r.name,
        description: r.description || "",
        cuisine: r.cuisine || "",
        ingredients: (r.ingredients || []).map((ing: any) => ({
          name: ing.name,
          quantity: String(ing.quantity),
          unit: ing.unit,
          ingredientId: ing.ingredientId,
        })),
        instructions: r.instructions || [],
        source: "user",
      }));
      setUserRecipes(users);

      // Fetch Spoonacular recipes
      const spoonRes = await fetch(
        `/api/external/recipes?search=${encodeURIComponent(query)}`
      );
      const spoonData = await spoonRes.json();
      const spoons: Recipe[] = (spoonData.recipes || []).map((r: any) => ({
        name: r.title,
        description: r.summary || "",
        cuisine: r.cuisine || "",
        ingredients: (r.extendedIngredients || []).map((ing: any) => ({
          name: ing.name || "",
          quantity: String(ing.amount || ""),
          unit: ing.unit || "",
        })),
        instructions: (r.analyzedInstructions || []).map(
          (step: any) => step.step || ""
        ),
        source: "spoonacular",
        externalId: r.id.toString(),
      }));
      setSpoonRecipes(spoons);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError("Failed to load recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes("");
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchRecipes(query);
  };

  const handleSave = () => {
    setEditingRecipe(null);
    fetchRecipes(searchQuery);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recipes Dashboard</h1>

      <SearchBar onSearch={handleSearch} />

      {!editingRecipe && (
        <button
          className={sharedStyles.button}
          onClick={() =>
            setEditingRecipe({
              name: "",
              description: "",
              ingredients: [{ name: "", quantity: "", unit: "" }],
              instructions: [""],
              cuisine: "",
              source: "user",
            })
          }
          style={{ marginBottom: "1rem" }}
        >
          Create New Recipe
        </button>
      )}

      {editingRecipe && (
        <RecipeForm initialData={editingRecipe} onSave={handleSave} />
      )}

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.message}>Loading recipes...</p>}
      {!loading && !error && userRecipes.length + spoonRecipes.length === 0 && (
        <p className={styles.empty}>No recipes found.</p>
      )}

      <div className={styles.grid}>
        {userRecipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            showActions={true}
            onEdit={() => setEditingRecipe(recipe)}
            onDelete={async () => {
              if (!confirm(`Delete recipe "${recipe.name}"?`)) return;
              try {
                const token = localStorage.getItem("token");
                if (!token) return alert("You must be logged in");
                const res = await fetch(`/api/recipes/${recipe._id}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                  fetchRecipes(searchQuery);
                  alert("Recipe deleted");
                } else {
                  const data = await res.json();
                  alert(`Error deleting: ${data.message || "Unknown error"}`);
                }
              } catch (err) {
                alert(`Network error: ${err}`);
              }
            }}
          />
        ))}

        {spoonRecipes.map((recipe) => (
          <RecipeCard key={recipe.externalId} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
