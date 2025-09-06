// src/app/recipes/[id]/page.tsx
/**
 * RecipeDetailPage
 * ----------------
 * Shows all details of a single recipe (user or external).
 * Allows editing/deleting if it's a user recipe.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import styles from "./RecipeDetailPage.module.css"; // your CSS module

// --- Type for recipe
interface Ingredient {
  ingredientId: string;
  name?: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  _id: string;
  name: string;
  description: string;
  cuisine?: string;
  ingredients: Ingredient[];
  instructions: string[];
  source: "user" | "external";
}

export default function RecipeDetailPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const recipeId = params?.id;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!recipeId) return;

    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/recipes/${recipeId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch recipe");

        const data: Recipe = await res.json();
        setRecipe(data);
      } catch (err: any) {
        setError(err.message || "Error fetching recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId, token]);

  const handleDelete = async () => {
    if (!token || !recipe || recipe.source !== "user") return;
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/recipes/${recipe._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete recipe");

      router.push("/recipes");
    } catch (err: any) {
      alert(err.message || "Error deleting recipe");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className={styles.loading}>Loading recipe...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!recipe) return <p className={styles.error}>Recipe not found.</p>;

  return (
    <div className={styles.container}>
      <h1>{recipe.name}</h1>
      {recipe.cuisine && (
        <p>
          <strong>Cuisine:</strong> {recipe.cuisine}
        </p>
      )}
      {recipe.description && <p>{recipe.description}</p>}

      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx}>
            {ing.quantity} {ing.unit} {ing.name || ing.ingredientId}
          </li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <ol>
        {recipe.instructions.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>

      {recipe.source === "user" && (
        <div className={styles.actions}>
          <Link href={`/recipes/${recipe._id}/edit`}>
            <button>Edit</button>
          </Link>
          <button onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
