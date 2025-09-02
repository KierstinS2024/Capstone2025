// path: src/app/dashboard/recipes/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./RecipeDetailPage.module.css";

interface Ingredient {
  name: string;
  quantity: string;
}

interface Recipe {
  _id: string;
  name: string;
  description: string;
  cuisine?: string;
  instructions?: string[];
  ingredients?: Ingredient[];
  createdByUserId?: string;
}

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params?.id as string;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!recipeId) return;

    async function fetchRecipe() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/recipes/${recipeId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch recipe");
        setRecipe(data.recipe);
      } catch (err: any) {
        setError(err.message || "Error loading recipe");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [recipeId]);

  const handleDelete = async () => {
    if (!token || !recipe) return;
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const res = await fetch(`/api/recipes/${recipe._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete recipe");
      router.push("/dashboard/recipes");
    } catch (err: any) {
      alert(err.message || "Error deleting recipe");
    }
  };

  if (loading) return <p className={styles.message}>Loading recipe...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!recipe) return <p className={styles.message}>Recipe not found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{recipe.name}</h1>
      {recipe.cuisine && (
        <p className={styles.cuisine}>Cuisine: {recipe.cuisine}</p>
      )}
      <p className={styles.description}>{recipe.description}</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Ingredients</h2>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <ul className={styles.list}>
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} className={styles.listItem}>
                {ing.quantity} {ing.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No ingredients listed.</p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Instructions</h2>
        {recipe.instructions && recipe.instructions.length > 0 ? (
          <ol className={styles.list}>
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className={styles.listItem}>
                {step}
              </li>
            ))}
          </ol>
        ) : (
          <p>No instructions provided.</p>
        )}
      </section>

      {token && recipe.createdByUserId && (
        <div className={styles.actions}>
          <button
            className={styles.editButton}
            onClick={() => router.push(`/dashboard/recipes/${recipe._id}/edit`)}
          >
            ✏️ Edit
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}
