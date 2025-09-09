// path: src/app/dashboard/recipes/external/[id]/page.tsx
"use client";

/**
 * ExternalRecipePage
 * ------------------
 * Displays detailed information for an external (Spoonacular) recipe.
 * - Fetches from backend proxy API: /api/external/recipes/:id
 * - Shows title, image, cuisines, summary, and instructions
 * - Gracefully handles loading/error states
 * - Includes navigation back to recipes list
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import styles from "./ExternalRecipePage.module.css";

interface ExternalRecipe {
  id: number;
  title: string;
  summary?: string;
  instructions?: string;
  cuisines?: string[];
  image?: string;
}

export default function ExternalRecipePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [recipe, setRecipe] = useState<ExternalRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/external/recipes/${id}`);
        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed to fetch recipe");
        }

        setRecipe(data);
      } catch (err: any) {
        console.error("Error fetching external recipe:", err);
        setError(err.message || "Error loading recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <p className={styles.source}>Loading recipe...</p>;
  if (error) return <p className={styles.source}>Error: {error}</p>;
  if (!recipe) return <p className={styles.source}>Recipe not found.</p>;

  return (
    <div>
      <NavBar />
      <main className={styles.container}>
        {/* Title */}
        <h1 className={styles.title}>{recipe.title}</h1>

        {/* Image */}
        {recipe.image && (
          <img src={recipe.image} alt={recipe.title} className={styles.image} />
        )}

        {/* Cuisine */}
        {recipe.cuisines && recipe.cuisines.length > 0 && (
          <p className={styles.source}>Cuisine: {recipe.cuisines.join(", ")}</p>
        )}

        {/* Summary */}
        {recipe.summary && (
          <div
            className={styles.instructions}
            dangerouslySetInnerHTML={{ __html: recipe.summary }}
          />
        )}

        {/* Instructions */}
        {recipe.instructions && (
          <div className={styles.instructions}>
            <h2>Instructions</h2>
            <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
          </div>
        )}

        {/* Back Navigation */}
        <button className={styles.backButton} onClick={() => router.back()}>
          ← Back to Recipes
        </button>
      </main>
    </div>
  );
}
