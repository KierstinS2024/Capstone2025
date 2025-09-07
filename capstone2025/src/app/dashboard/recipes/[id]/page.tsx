"use client";

/**
 * Individual Recipe Page
 * ----------------------
 * Shows full details of a recipe.
 * Features:
 * - ProtectedRoute (JWT + AuthContext)
 * - Display ingredients, steps, servings
 * - Edit or delete recipe
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Recipe } from "@/types/recipe";
import styles from "./RecipePage.module.css";

export default function RecipePage() {
  return (
    <ProtectedRoute>
      <RecipeContent />
    </ProtectedRoute>
  );
}

function RecipeContent() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useParams();
  const recipeId = params.id;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipe() {
      if (!user || !recipeId) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/recipes/${recipeId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch recipe");

        const data = await res.json();
        setRecipe(data.data || null);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [user, recipeId]);

  const handleDelete = async () => {
    if (!recipe) return;
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const res = await fetch(`/api/recipes/${recipe._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error("Failed to delete recipe");

      router.push("/dashboard/recipes");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  if (loading) return <p className={styles.message}>Loading recipe...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!recipe) return <p className={styles.error}>Recipe not found.</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{recipe.title}</h1>
      <p>Servings: {recipe.servings}</p>

      <section className={styles.section}>
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ing) => (
            <li key={ing.ingredientId}>
              {ing.quantity} {ing.unit} - {ing.name}
            </li>
          ))}
        </ul>
      </section>

      {recipe.steps && recipe.steps.length > 0 && (
        <section className={styles.section}>
          <h2>Steps</h2>
          <ol>
            {recipe.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      <button
        className={styles.editButton}
        onClick={() => router.push(`/dashboard/recipes/${recipe._id}/edit`)}
      >
        Edit
      </button>
      <button className={styles.deleteButton} onClick={handleDelete}>
        Delete
      </button>
      <button
        className={styles.backButton}
        onClick={() => router.push("/dashboard/recipes")}
      >
        ← Back to Recipes
      </button>
    </main>
  );
}
