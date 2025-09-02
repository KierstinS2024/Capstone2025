// path: src/app/dashboard/recipes/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import styles from "./RecipesListPage.module.css";

interface Recipe {
  _id: string;
  name: string;
  cuisine?: string;
  description: string;
}

/**
 * The main content for the Recipe List Page
 */
function RecipesListPageContent() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) router.push("/auth/login");
  }, [token, router]);

  // Fetch all recipes
  useEffect(() => {
    if (!token) return;

    async function fetchRecipes() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch recipes");

        setRecipes(data.recipes || []);
      } catch (err: any) {
        setError(err.message || "Error loading recipes");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [token]);

  if (loading) return <p className={styles.message}>Loading recipes...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (recipes.length === 0)
    return <p className={styles.message}>No recipes found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recipes</h1>
      <button
        className={styles.createButton}
        onClick={() => router.push("/dashboard/recipes/create")}
      >
        + Create New Recipe
      </button>
      <ul className={styles.list}>
        {recipes.map((recipe) => (
          <li key={recipe._id} className={styles.listItem}>
            <h2
              className={styles.recipeName}
              onClick={() => router.push(`/dashboard/recipes/${recipe._id}`)}
            >
              {recipe.name}
            </h2>
            {recipe.cuisine && (
              <p className={styles.cuisine}>Cuisine: {recipe.cuisine}</p>
            )}
            <p className={styles.description}>{recipe.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * RecipeListPage
 * Wraps the content in ProtectedRoute
 */
export default function RecipesListPage() {
  return (
    <ProtectedRoute>
      <RecipesListPageContent />
    </ProtectedRoute>
  );
}
