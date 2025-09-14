// path: src/components/RecipeDetail.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRecipes } from "@/context/RecipeContext";
import { useMealPlan } from "@/context/MealPlanContext";

export default function RecipeDetailComponent() {
  const params = useParams();
  const { getById } = useRecipes();
  const { addMeal } = useMealPlan();
  const [recipe, setRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    setLoading(true);
    getById(id)
      .then((r) => setRecipe(r))
      .finally(() => setLoading(false));
  }, [params?.id, getById]);

  if (loading) return <p>Loading recipe...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="card">
      <h2>{recipe.title}</h2>
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
        />
      )}
      {recipe.summary && (
        <div
          style={{ marginTop: 12 }}
          dangerouslySetInnerHTML={{ __html: recipe.summary }}
        />
      )}
      <h4>Ingredients</h4>
      <ul>
        {(recipe.ingredients || []).map((i: string, idx: number) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
      <h4>Instructions</h4>
      <div dangerouslySetInnerHTML={{ __html: recipe.instructions || "" }} />
      <div style={{ marginTop: 12 }}>
        <button
          className="button"
          onClick={() =>
            addMeal("Monday", { id: recipe.id, name: recipe.title })
          }
        >
          + Add to Monday
        </button>
      </div>
    </div>
  );
}
