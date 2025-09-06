// path: src/app/recipes/saved/page.tsx
/**
 * SavedRecipesPage.tsx
 * --------------------
 * Displays recipes the user has saved.
 * Users can view, edit (if internal), add to meal plan, or remove saved recipes.
 */

"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SavedRecipe {
  _id: string; // MongoDB _id of saved entry
  name: string;
  cuisine?: string;
  isExternal?: boolean;
}

export default function SavedRecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch saved recipes on mount
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);
        const res = await client.get("/saved");
        setRecipes(res.data.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load saved recipes");
      } finally {
        setLoading(false);
      }
    };
    fetchSavedRecipes();
  }, []);

  const handleRemoveSaved = async (recipeId: string) => {
    if (!confirm("Remove this recipe from saved?")) return;
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.delete(`/saved/${recipeId}`);
      setRecipes(recipes.filter((r) => r._id !== recipeId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove recipe");
    }
  };

  const handleAddToMealPlan = async (recipeId: string) => {
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.post(`/meal-plan`, { recipeId });
      alert("Recipe added to your meal plan!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to meal plan");
    }
  };

  if (loading)
    return <p style={{ padding: "20px" }}>Loading saved recipes...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Saved Recipes</h1>
        {recipes.length === 0 ? (
          <p>No saved recipes yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recipes.map((recipe) => (
              <li
                key={recipe._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{recipe.name}</strong>{" "}
                  {recipe.cuisine && `(${recipe.cuisine})`}
                </div>
                <div>
                  <button onClick={() => handleAddToMealPlan(recipe._id)}>
                    Add to Meal Plan
                  </button>{" "}
                  <button
                    style={{ color: "red" }}
                    onClick={() => handleRemoveSaved(recipe._id)}
                  >
                    Remove
                  </button>{" "}
                  {!recipe.isExternal && (
                    <Link href={`/recipes/${recipe._id}/edit`}>Edit</Link>
                  )}{" "}
                  <Link href={`/recipes/${recipe._id}`}>View</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
