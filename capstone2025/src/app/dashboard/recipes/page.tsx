// Path: src/app/dashboard/recipes/page.tsx
"use client";

/**
 * RecipesPage
 * -----------------
 * Displays a list of all recipes belonging to the user.
 * Features:
 * - Protected route
 * - Fetches recipes from `/api/recipes`
 * - Links to recipe detail and creation pages
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Recipe } from "@/types/recipe";
import styles from "./RecipesPage.module.css";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch recipes");
        const data = await res.json();
        setRecipes(data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  return (
    <ProtectedRoute>
      <main className={styles.container}>
        <h1 className={styles.title}>Recipes</h1>
        <Link href="/dashboard/recipes/new" className={styles.addButton}>
          + New Recipe
        </Link>

        {loading && <p>Loading recipes...</p>}
        {error && <p className={styles.error}>{error}</p>}

        <ul className={styles.list}>
          {recipes.map((recipe) => (
            <li key={recipe._id} className={styles.listItem}>
              <Link href={`/dashboard/recipes/${recipe._id}`}>
                {recipe.title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </ProtectedRoute>
  );
}
