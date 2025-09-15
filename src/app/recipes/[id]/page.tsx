// path: src/app/recipes/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRecipes } from "@/context/RecipeContext";
import RecipeDetail from "@/components/RecipeDetail";
import AddToMealPlan from "@/components/AddToMealPlan";
import GenerateShoppingList from "@/components/GenerateShoppingList";
import "@/styles/recipe-detail.css";

export default function RecipeDetailPage() {
  const params = useParams();
  const { getById, loading } = useRecipes();
  const [recipe, setRecipe] = useState<any>(null);

  // Fetch recipe on mount
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!params?.id) return;
      const data = await getById(params.id as string);
      setRecipe(data);
    };
    fetchRecipe();
  }, [params, getById]);

  if (loading) return <p className="loading">Loading recipe...</p>;
  if (!recipe) return <p className="empty-state">Recipe not found.</p>;

  return (
    <div className="recipe-detail-page">
      {/* Main recipe info */}
      <RecipeDetail recipe={recipe} />

      {/* Actions: add to meal plan or shopping list */}
      <div className="recipe-actions">
        <AddToMealPlan recipe={recipe} />
        <GenerateShoppingList recipe={recipe} />
      </div>
    </div>
  );
}
