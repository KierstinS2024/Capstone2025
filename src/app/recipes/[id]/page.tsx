// src/app/recipes/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useRecipes } from "@/context/RecipeContext";
import RecipeDetail from "@/components/RecipeDetail";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const { recipes } = useRecipes();

  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) return <p>Recipe not found.</p>;

  return <RecipeDetail recipe={recipe} />;
}