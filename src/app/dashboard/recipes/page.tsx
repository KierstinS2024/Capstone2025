// path: src/app/dashboard/recipes/page.tsx
/**
 * Recipes List Page
 * -----------------
 * Displays all user recipes.
 * Users can:
 *  - View existing recipes
 *  - Navigate to create a new recipe
 *  - Edit a recipe
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getApiClient } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Recipe {
  _id: string;
  name: string;
  description?: string;
  cuisine?: string;
}

export default function RecipesListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const client = getApiClient(token || undefined);
        const res = await client.get("/recipes");
        setRecipes(res.data.recipes || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <ProtectedRoute>
      <div style={{ padding: "20px" }}>
        <header style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>Recipes</h1>
          <Link href="/dashboard/recipes/new">
            <button>+ New Recipe</button>
          </Link>
        </header>

        {loading && <p>Loading recipes…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recipes.length === 0 && (
              <li>No recipes yet. Create your first one!</li>
            )}
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
                <h3>{recipe.name}</h3>
                {recipe.cuisine && (
                  <p style={{ color: "#666" }}>{recipe.cuisine}</p>
                )}
                {recipe.description && <p>{recipe.description}</p>}
                <div style={{ marginTop: "10px" }}>
                  <Link href={`/dashboard/recipes/${recipe._id}`}>
                    <button style={{ marginRight: "10px" }}>View</button>
                  </Link>
                  <Link href={`/dashboard/recipes/${recipe._id}/edit`}>
                    <button>Edit</button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
