// path: src/app/recipes/saved/[id]/view/page.tsx
/**
 * ViewSavedRecipePage.tsx
 * ----------------------
 * Displays details of a saved recipe (internal only).
 * Users can edit, delete, or add the recipe to a meal plan.
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

interface SavedRecipeDetail {
  _id: string;
  name: string;
  cuisine?: string;
  ingredients: string[];
  instructions: string[];
}

export default function ViewSavedRecipePage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<SavedRecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingMealPlan, setSavingMealPlan] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);
        const res = await client.get(`/saved/${params.id}`);
        setRecipe(res.data.data);
      } catch (err: any) {
        setError(err.message || "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this saved recipe?")) return;
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.delete(`/saved/${params.id}`);
      router.push("/recipes/saved");
    } catch (err) {
      console.error(err);
      alert("Failed to delete recipe");
    }
  };

  const handleAddToMealPlan = async () => {
    setSavingMealPlan(true);
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.post("/meal-plan", { recipeId: params.id });
      alert("Recipe added to meal plan!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to meal plan");
    } finally {
      setSavingMealPlan(false);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading recipe...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
  if (!recipe) return <p style={{ padding: "20px" }}>Recipe not found</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>{recipe.name}</h1>
        {recipe.cuisine && (
          <p>
            <strong>Cuisine:</strong> {recipe.cuisine}
          </p>
        )}
        <h3>Ingredients:</h3>
        <ul>
          {recipe.ingredients.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <h3>Instructions:</h3>
        <ol>
          {recipe.instructions.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => router.push(`/recipes/saved/${params.id}/edit`)}
            style={{ marginRight: "10px" }}
          >
            Edit
          </button>
          <button
            onClick={handleAddToMealPlan}
            disabled={savingMealPlan}
            style={{ marginRight: "10px" }}
          >
            {savingMealPlan ? "Adding..." : "Add to Meal Plan"}
          </button>
          <button
            onClick={handleDelete}
            style={{ color: "red", marginRight: "10px" }}
          >
            Delete
          </button>
          <button onClick={() => router.push("/recipes/saved")}>
            Back to Saved Recipes
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
