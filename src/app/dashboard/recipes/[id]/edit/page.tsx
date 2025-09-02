// path: src/app/dashboard/recipes/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch recipe");
        setRecipe(data.recipe);
      } catch (err: any) {
        setError(err.message || "Error loading recipe");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipe();
  }, [id]);

  if (loading) return <p className="p-6">Loading recipe...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!recipe) return <p className="p-6">Recipe not found</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>
      <RecipeForm mode="edit" recipe={recipe} />
    </div>
  );
}
