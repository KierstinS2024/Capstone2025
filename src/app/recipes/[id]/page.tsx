// src/app/recipes/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Recipe {
  _id: string;
  name: string;
  description?: string;
  instructions: string;
  nutritionInfo?: string;
  cuisine?: string;
}

export default function RecipePage() {
  const router = useRouter();
  const params = useParams();

  // Type-safe extraction of id
  const id = params && typeof params.id === "string" ? params.id : null;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid recipe ID");
      setLoading(false);
      return;
    }

    async function fetchRecipe() {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Recipe not found");
          return;
        }
        setRecipe(data.recipe);
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
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
      {recipe.cuisine && <p className="mb-2">Cuisine: {recipe.cuisine}</p>}
      {recipe.description && <p className="mb-4">{recipe.description}</p>}
      <h2 className="text-xl font-semibold mb-2">Instructions</h2>
      <p className="mb-4 whitespace-pre-line">{recipe.instructions}</p>
      {recipe.nutritionInfo && (
        <>
          <h2 className="text-xl font-semibold mb-2">Nutrition Info</h2>
          <p>{recipe.nutritionInfo}</p>
        </>
      )}
    </div>
  );
}
