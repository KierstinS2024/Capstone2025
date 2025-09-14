// path: src/app/recipes/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import RecipeDetail from "@/components/RecipeDetail";
import "@/styles/recipe-detail.css";

interface RecipeDetailPageProps {
  params: { id: string };
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { getById } = useRecipes();

  const recipeId = params.id;
  const [recipe, setRecipe] =
    useState<
      typeof getById extends (...args: any) => Promise<infer R> ? R : null
    >(null);
  const [loading, setLoading] = useState(true);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      const data = await getById(recipeId);
      setRecipe(data);
      setLoading(false);
    };
    fetchRecipe();
  }, [recipeId, getById]);

  if (authLoading || loading)
    return <p className="loading">Loading recipe...</p>;
  if (!user) return null;
  if (!recipe) return <p className="empty-state">Recipe not found.</p>;

  return (
    <div className="recipe-detail-page">
      <RecipeDetail recipe={recipe} />
    </div>
  );
}
