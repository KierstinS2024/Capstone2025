// Path: src/components/RecipeCard.tsx
"use client";

import React from "react";
import type { Recipe } from "@/types/recipe";
import { useRecipes } from "@/context/RecipeContext";

interface RecipeCardProps {
  recipeId: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipeId }) => {
  const { recipes } = useRecipes();
  const recipe = recipes.find((r) => r._id === recipeId);
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12 }}>
      <h3>{recipe.title}</h3>
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ width: "100%", borderRadius: 6 }}
        />
      )}
    </div>
  );
};

export default RecipeCard;
