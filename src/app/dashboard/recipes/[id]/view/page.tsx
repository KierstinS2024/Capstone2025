// path: src/app/dashboard/recipes/[id]/view/page.tsx
/**
 * View Recipe Page
 * ----------------
 * Read-only view of a recipe.
 * Shows all fields and imported info if applicable.
 */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getApiClient } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Ingredient {
  name: string;
  quantity: string;
}

interface Recipe {
  _id: string;
  name: string;
  cuisine?: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string;
  servings: number;
  importedFrom?: string;
}

export default function ViewRecipePage() {
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);
        const res = await client.get(`/recipes/${params.id}`);
        setRecipe(res.data.data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [params.id]);

  if (loading) return <p style={{ padding: "20px" }}>Loading recipe…</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <ProtectedRoute>
      <div style={{ padding: "20px" }}>
        <h1>{recipe.name}</h1>
        {recipe.cuisine && <p>Cuisine: {recipe.cuisine}</p>}
        {recipe.description && <p>{recipe.description}</p>}
        {recipe.importedFrom && <p>Imported from {recipe.importedFrom}</p>}

        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx}>
              {ing.quantity} {ing.name}
            </li>
          ))}
        </ul>

        <h2>Instructions</h2>
        <p>{recipe.instructions}</p>

        <p>Servings: {recipe.servings}</p>
      </div>
    </ProtectedRoute>
  );
}
