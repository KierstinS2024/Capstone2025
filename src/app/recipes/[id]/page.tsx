"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRecipeById } from "@/lib/spoonacularApi";
import { RecipeDetail } from "@/types/recipe";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err: any) {
        setError(err.message || "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="py-8">
      <h2 className="text-4xl font-bold mb-4">{recipe.title}</h2>
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full max-h-96 object-cover rounded mb-6"
      />
      <h3 className="text-2xl font-semibold mb-3">Ingredients</h3>
      <ul className="list-disc ml-6 mb-6">
        {recipe.extendedIngredients.map((ing) => (
          <li key={ing.id}>{ing.original}</li>
        ))}
      </ul>
      <h3 className="text-2xl font-semibold mb-3">Instructions</h3>
      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: recipe.instructions || "No instructions available.",
        }}
      />
    </div>
  );
}
