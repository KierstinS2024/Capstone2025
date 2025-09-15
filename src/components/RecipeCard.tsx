// src/components/RecipeCard.tsx
"use client";

import React from "react";
import { Recipe } from "@/types/recipe";
import { useRecipes } from "@/context/RecipeContext";
import { useMealPlan } from "@/context/MealPlanContext";

interface RecipeCardProps {
  recipe: Recipe;
  onOpen?: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onOpen }: RecipeCardProps) {
  const { addMealToPlan } = useMealPlan();
  const { getById } = useRecipes();

  const handleAddToPlan = async () => {
    const fullRecipe = await getById(recipe.id);
    if (fullRecipe) {
      await addMealToPlan(
        { ...fullRecipe, type: "dinner" },
        new Date().toISOString().split("T")[0]
      );
    }
  };

  return (
    <div className="recipe-card">
      {recipe.image && <img src={recipe.image} alt={recipe.name} />}
      <h4>{recipe.name}</h4>
      <div className="actions">
        <button onClick={() => onOpen && onOpen(recipe)}>View</button>
        <button onClick={handleAddToPlan}>Add to Meal Plan</button>
      </div>
    </div>
  );
}
