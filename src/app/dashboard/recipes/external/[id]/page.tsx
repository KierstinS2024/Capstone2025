/* src/app/dashboard/recipes/external/[id]/page.tsx */
"use client"; // Using client-side hooks for fetching data

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../RecipesShared.module.css";

// Define the type for the external recipe
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

  // Fetch recipe by ID when component mounts or ID changes
  useEffect(() => {
    if (!id) return;

    async function fetchRecipe() {
      setLoading(true);
      try {
        const res = await fetch(`/api/external/recipes/${id}`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
        } else {
          setRecipe(data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!recipe) return <p>Recipe not found</p>;

  return (
    <div className={styles.container}>
      {/* Recipe title */}
      <h1 className={styles.title}>{recipe.title}</h1>

      {/* Recipe image */}
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className={styles.image} />
      )}

      {/* Cuisine info */}
      {recipe.cuisines && (
        <p className={styles.cuisine}>Cuisine: {recipe.cuisines.join(", ")}</p>
      )}

      {/* Summary section */}
      {recipe.summary && (
        <div
          className={styles.section}
          dangerouslySetInnerHTML={{ __html: recipe.summary }}
        />
      )}

      {/* Instructions section */}
      {recipe.instructions && (
        <div className={`${styles.section} ${styles.instructions}`}>
          <h2>Instructions:</h2>
          <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
        </div>
      )}

      {/* Go back button */}
      <button className={styles.button} onClick={() => router.back()}>
        Go Back
      </button>
    </div>
  );
}
