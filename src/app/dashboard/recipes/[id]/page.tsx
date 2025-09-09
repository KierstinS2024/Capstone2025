// src/app/dashboard/recipes/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/app/dashboard/layout";
import { getApiClient } from "@/lib/api";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface UserRecipe {
  _id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  cuisine: string;
}

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [recipe, setRecipe] = useState<UserRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token") || undefined;
        const apiClient = getApiClient(token);

        const response = await apiClient.get(`/recipes/${id}`);
        if (response.data?.recipe) {
          setRecipe(response.data.recipe);
        } else {
          setError("Recipe not found.");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading)
    return (
      <DashboardLayout>
        <p>Loading recipe...</p>
      </DashboardLayout>
    );
  if (error)
    return (
      <DashboardLayout>
        <p style={{ color: "red" }}>{error}</p>
      </DashboardLayout>
    );
  if (!recipe) return null;

  return (
    <DashboardLayout>
      <h1>{recipe.name}</h1>
      {recipe.cuisine && (
        <p>
          <strong>Cuisine:</strong> {recipe.cuisine}
        </p>
      )}
      {recipe.description && <p>{recipe.description}</p>}

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
        <h2>Instructions</h2>
        <ol>
          {recipe.instructions.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </section>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => router.back()} style={{ marginRight: "10px" }}>
          Back to Recipes
        </button>
        <button onClick={() => router.push(`/dashboard/recipes/${id}/edit`)}>
          Edit Recipe
        </button>
      </div>
    </DashboardLayout>
  );
}
