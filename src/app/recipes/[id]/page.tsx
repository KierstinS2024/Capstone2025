// path: src/app/recipes/[id]/page.tsx
/**
 * RecipeDetailPage
 * Shows detailed info about a single recipe
 * Displays ingredients, instructions, and cuisine
 */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Ingredient {
  ingredientId: string;
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
}

export default function RecipeDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (id) fetchRecipe();
  }, [id]);

  // Fetch single recipe by ID
  const fetchRecipe = async () => {
    const res = await fetch(`/api/recipes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRecipe(data.recipe || null);
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{recipe.name}</h1>
      {recipe.cuisine && <p className="italic mb-4">{recipe.cuisine}</p>}
      <p className="mb-4">{recipe.description}</p>

      <h2 className="font-bold mb-2">Ingredients</h2>
      <ul className="list-disc pl-6 mb-4">
        {recipe.ingredients.map((ing) => (
          <li key={ing.ingredientId}>
            {ing.quantity} {ing.unit} (ID: {ing.ingredientId})
          </li>
        ))}
      </ul>

      <h2 className="font-bold mb-2">Instructions</h2>
      <ol className="list-decimal pl-6">
        {recipe.instructions.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
