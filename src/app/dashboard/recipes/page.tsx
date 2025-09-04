// path: src/app/dashboard/recipes/page.tsx
/**
 * Recipes List Page
 * ----------------
 * Lists all user recipes and provides navigation to create or edit.
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

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      try {
        const res = await client.get("/recipes");
        setRecipes(res.data || []);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
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
        <h1>Recipes</h1>
        <Link href="/dashboard/recipes/new">+ New Recipe</Link>
        {loading ? (
          <p>Loading recipes…</p>
        ) : recipes.length === 0 ? (
          <p>No recipes yet. Create your first one!</p>
        ) : (
          <ul>
            {recipes.map((r) => (
              <li key={r._id}>
                <Link href={`/dashboard/recipes/${r._id}`}>{r.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
