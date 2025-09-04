// path: src/app/dashboard/recipes/page.tsx
/**
 * RecipesListPage.tsx
 * -------------------
 * Lists user recipes with links to view, edit, or create new recipes.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

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
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);
        const res = await client.get("/recipes");
        setRecipes(res.data.recipes || []);
      } catch (err: any) {
        setError(err.message || "Error loading recipes");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <header>
          <h1>Recipes</h1>
          <Link href="/dashboard/recipes/new">
            <button>+ New Recipe</button>
          </Link>
        </header>
        {loading && <p>Loading recipes...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recipes.map((r) => (
              <li
                key={r._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <h3>{r.name}</h3>
                {r.cuisine && <p>{r.cuisine}</p>}
                {r.description && <p>{r.description}</p>}
                <div>
                  <Link href={`/dashboard/recipes/${r._id}`}>View</Link>
                  {" | "}
                  <Link href={`/dashboard/recipes/${r._id}/edit`}>Edit</Link>
                </div>
              </li>
            ))}
            {recipes.length === 0 && <li>No recipes yet. Create one!</li>}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
