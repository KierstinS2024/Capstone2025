"use client";

/**
 * Dashboard Recipes Page
 * ----------------------
 * Lists all recipes for the logged-in user.
 * Features:
 * - ProtectedRoute (JWT + AuthContext)
 * - Fetch recipes from `/api/recipes`
 * - Show "Create New" button
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Recipe } from "@/types/recipe";
import styles from "./RecipesPage.module.css";

export default function RecipesPage() {
  return (
    <ProtectedRoute>
      <RecipesContent />
    </ProtectedRoute>
  );
}

function RecipesContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      if (!user) return;

      setLoading(true);
      try {
        const res = await fetch("/api/recipes", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch recipes");

        const data = await res.json();
        setRecipes(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [user]);

  if (loading) return <p className={styles.message}>Loading recipes...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Your Recipes</h1>

      <button
        className={styles.addButton}
        onClick={() => router.push("/dashboard/recipes/new")}
      >
        + Create New Recipe
      </button>

      {recipes.length === 0 ? (
        <p className={styles.emptyMessage}>
          You haven’t created any recipes yet.
        </p>
      ) : (
        <div className={styles.cardsGrid}>
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className={styles.card}
              onClick={() => router.push(`/dashboard/recipes/${recipe._id}`)}
            >
              <h2>{recipe.title}</h2>
              <p>{recipe.ingredients.length} ingredients</p>
              <small>{recipe.servings} servings</small>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
