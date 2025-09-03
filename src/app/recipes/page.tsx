// path: src/app/recipes/page.tsx
/**
 * Recipes List Page
 * -----------------
 * Displays all recipes for the logged-in user.
 * From here, the user can:
 *  - View all recipes
 *  - Navigate to create a new recipe
 *  - Click on a recipe to edit it
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all recipes when the page loads
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
        console.error("Error fetching recipes:", err);
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

      {/* Button to create a new recipe */}
      <div style={{ marginBottom: "20px" }}>
        <Link href="/recipes/new">
          <button>Create New Recipe</button>
        </Link>
      </div>

      {/* List of recipes */}
      {recipes.length === 0 ? (
        <p>You don’t have any recipes yet. Create one to get started!</p>
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
              <p>{recipe.description}</p>
              <p>
                Ingredients:{" "}
                {recipe.ingredients?.length ? recipe.ingredients.length : "0"}
              </p>
              <p>
                Instructions:{" "}
                {recipe.instructions?.length ? recipe.instructions.length : "0"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
