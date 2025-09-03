// path: src/app/dashboard/recipes/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import styles from "../RecipesShared.module.css";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  _id: string;
  name: string;
  description: string;
  cuisine?: string;
  instructions: string[];
  ingredients: Ingredient[];
  userSubmitted: boolean;
  createdByUserId?: string;
}

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = typeof params.id === "string" ? params.id : "";
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Recipe>>({});

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) router.push("/auth/login");
  }, [token, router]);

  // Fetch recipe details
  useEffect(() => {
    if (!recipeId || !token) return;

    async function fetchRecipe() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/recipes/${recipeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch recipe");
        setRecipe(data.recipe);
        setFormData(data.recipe);
      } catch (err: any) {
        setError(err.message || "Error loading recipe");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [recipeId, token]);

  // Update recipe
  const handleUpdate = async () => {
    if (!recipe || !token) return;

    try {
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update recipe");

      setRecipe(data.recipe);
      setIsEditing(false);
      alert("Recipe updated successfully!");
    } catch (err: any) {
      alert(err.message || "Error updating recipe");
    }
  };

  // Delete recipe
  const handleDelete = async () => {
    if (!recipe || !token) return;
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete recipe");

      alert("Recipe deleted successfully");
      router.push("/dashboard/recipes");
    } catch (err: any) {
      alert(err.message || "Error deleting recipe");
    }
  };

  if (loading) return <p className={styles.message}>Loading recipe...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!recipe) return <p className={styles.error}>Recipe not found.</p>;

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {isEditing ? (
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          ) : (
            recipe.name
          )}
        </h1>

        <p className={styles.cuisine}>
          Cuisine:{" "}
          {isEditing ? (
            <input
              type="text"
              value={formData.cuisine || ""}
              onChange={(e) =>
                setFormData({ ...formData, cuisine: e.target.value })
              }
            />
          ) : (
            recipe.cuisine || "N/A"
          )}
        </p>

        <h2>Description</h2>
        {isEditing ? (
          <textarea
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        ) : (
          <p>{recipe.description}</p>
        )}

        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx}>
              {ing.name}: {ing.quantity} {ing.unit}
            </li>
          ))}
        </ul>

        <h2>Instructions</h2>
        <ol>
          {recipe.instructions.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>

        {recipe.userSubmitted && (
          <div className={styles.actions}>
            {isEditing ? (
              <>
                <button onClick={handleUpdate} className={styles.saveButton}>
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(recipe);
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                Edit
              </button>
            )}
            <button onClick={handleDelete} className={styles.deleteButton}>
              Delete
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
