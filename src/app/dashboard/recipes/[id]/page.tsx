// path: src/app/dashboard/recipes/[id]/page.tsx
"use client";

/**
 * RecipeDetailsPage
 * -----------------
 * Displays full details of a user-submitted recipe:
 * - Recipe title and description
 * - Ingredients with quantities and units
 * - Step-by-step instructions
 * - Cuisine information
 * Provides links to edit the recipe and navigate back to the recipe list.
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

// Ingredient type (matches RecipeForm)
interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

// Recipe type for user-submitted recipe
interface UserRecipe {
  _id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  cuisine: string;
}

export default function RecipeDetailsPage() {
  const { id } = useParams(); // Recipe ID from route
  const router = useRouter();

  const [recipe, setRecipe] = useState<UserRecipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // --- Fetch recipe from API ---
  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const userToken = localStorage.getItem("token") || undefined;
        const apiClient = getApiClient(userToken);

        const response = await apiClient.get(`/recipes/${id}`);
        if (response.data?.recipe) {
          setRecipe(response.data.recipe);
        } else {
          setLoadError("Recipe not found");
        }
      } catch (error: any) {
        console.error("Error fetching recipe:", error);
        setLoadError(error.message || "Failed to load recipe");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (isLoading) return <p>Loading recipe...</p>;
  if (loadError) return <p>Error: {loadError}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <main style={{ padding: "20px", maxWidth: "700px" }}>
        {/* Recipe Title */}
        <h1>{recipe.name}</h1>

        {/* Cuisine */}
        {recipe.cuisine && (
          <p>
            <strong>Cuisine:</strong> {recipe.cuisine}
          </p>
        )}

        {/* Description */}
        {recipe.description && <p>{recipe.description}</p>}

        {/* Ingredients */}
        <section>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.quantity} {ingredient.unit} {ingredient.name}
              </li>
            ))}
          </ul>
        </section>

        {/* Instructions */}
        <section>
          <h2>Instructions</h2>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </section>

        {/* Navigation Links */}
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => router.back()} style={{ marginRight: "10px" }}>
            Back to Recipes
          </button>
          <button onClick={() => router.push(`/dashboard/recipes/${id}/edit`)}>
            Edit Recipe
          </button>
        </div>
      </main>
    </ProtectedRoute>
  );
}
