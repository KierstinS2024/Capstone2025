// path: src/app/recipes/page.tsx
/**
 * Recipes List Page
 * -----------------
 * Shows all recipes for the logged-in user.
 * Users can:
 *  - View recipe name, cuisine, and number of ingredients
 *  - Click a recipe to edit it
 *  - Navigate to create a new recipe
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes when component mounts
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("/api/recipes", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRecipes(data.data || []);
        } else {
          console.error("Failed to fetch recipes");
        }
      } catch (err) {
        console.error("Error loading recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading recipes...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Recipes</h1>

      {/* Button to create new recipe */}
      <div style={{ marginBottom: "20px" }}>
        <Link href="/recipes/new">
          <button>Create New Recipe</button>
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p>No recipes yet. Add one to get started!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {recipes.map((recipe) => (
            <li
              key={recipe._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "4px",
              }}
            >
              <Link href={`/recipes/${recipe._id}`}>
                <strong>{recipe.name}</strong>
              </Link>
              <p>Cuisine: {recipe.cuisine || "Not specified"}</p>
              <p>
                Ingredients: {recipe.ingredients?.length || "No ingredients"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
