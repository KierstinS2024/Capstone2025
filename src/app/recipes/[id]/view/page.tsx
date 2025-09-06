// path: src/app/recipes/[id]/view/page.tsx
/**
 * ViewRecipePage.tsx
 * ----------------------
 * Displays a single recipe in read-only mode.
 * Users can add/remove the recipe from favorites and add it to a meal plan.
 * External recipes cannot be edited.
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

interface Recipe {
  _id: string;
  name: string;
  description?: string;
  instructions?: string[];
  cuisine?: string;
  ingredients?: string[];
  isExternal?: boolean;
  isFavorite?: boolean; // indicates if user has saved this recipe
}

export default function ViewRecipePage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);

        // Fetch from favorites API first to check if saved
        const favRes = await client.get("/favorites");
        const savedRecipes: Recipe[] = favRes.data.data || [];
        const found = savedRecipes.find((r) => r._id === params.id);

        // Fetch recipe details
        const res = await client.get(`/recipes/${params.id}`);
        const data: Recipe = res.data.recipe || res.data; // external recipes may return different structure
        setRecipe({
          ...data,
          isFavorite: !!found,
          isExternal: data.isExternal || false,
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [params.id]);

  // Toggle favorite status
  const handleToggleFavorite = async () => {
    if (!recipe) return;
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);

      if (recipe.isFavorite) {
        await client.delete(`/favorites/${recipe._id}`);
        setRecipe({ ...recipe, isFavorite: false });
      } else {
        await client.post(`/favorites`, { recipeId: recipe._id });
        setRecipe({ ...recipe, isFavorite: true });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update favorites");
    }
  };

  // Add recipe to meal plan
  const handleAddToMealPlan = async () => {
    if (!recipe) return;
    try {
      const token = localStorage.getItem("token") || undefined;
      const client = getApiClient(token);
      await client.post(`/meal-plan`, { recipeId: recipe._id });
      alert("Recipe added to your meal plan!");
    } catch (err) {
      console.error(err);
      alert("Failed to add recipe to meal plan");
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
        {recipe.description && <p>{recipe.description}</p>}
        {recipe.ingredients && (
          <>
            <h3>Ingredients:</h3>
            <ul>
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </>
        )}
        {recipe.instructions && (
          <>
            <h3>Instructions:</h3>
            <ol>
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </>
        )}

        <div style={{ marginTop: "20px" }}>
          <button onClick={handleToggleFavorite}>
            {recipe.isFavorite ? "Remove from Saved" : "Add to Saved"}
          </button>{" "}
          <button onClick={handleAddToMealPlan}>Add to Meal Plan</button>{" "}
          {!recipe.isExternal && (
            <button onClick={() => router.push(`/recipes/${recipe._id}/edit`)}>
              Edit Recipe
            </button>
          )}{" "}
          <button onClick={() => router.push("/recipes")}>
            Back to Recipes
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
