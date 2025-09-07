// Path: src/app/dashboard/recipes/[id]/page.tsx

"use client";

/**
 * RecipeDetailPage
 * -----------------
 * Displays the details of a single recipe.
 * Features:
 * - Protected route
 * - Fetches recipe from `/api/recipes/[id]`
 * - Links to edit page
 */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Recipe } from "@/types/recipe";
import styles from "./RecipeDetailPage.module.css";

export default function RecipeDetailPage() {
  const params = useParams();
  const recipeId = params.id as string;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/recipes/${recipeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch recipe");
        const data = await res.json();
        setRecipe(data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [recipeId]);

  return (
    <ProtectedRoute>
      <main className={styles.container}>
        {loading && <p>Loading recipe...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {recipe && (
          <>
            <h1 className={styles.title}>{recipe.title}</h1>
            {recipe.description && <p>{recipe.description}</p>}
            <p>Servings: {recipe.servings}</p>

            <section>
              <h2>Ingredients</h2>
              <ul>
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    {ing.quantity} {ing.unit} {ing.name}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2>Steps</h2>
              <ol>
                {recipe.steps?.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </section>

            <Link
              href={`/dashboard/recipes/${recipe._id}/edit`}
              className={styles.editButton}
            >
              Edit Recipe
            </Link>
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}
