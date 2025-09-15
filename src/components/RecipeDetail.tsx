// src/components/RecipeDetail.tsx
"use client";

import React from "react";
import { Recipe } from "@/types/recipe";

interface RecipeDetailProps {
  recipe: Recipe;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  return (
    <div className="recipe-detail">
      <h2>{recipe.name}</h2>
      {recipe.image && <img src={recipe.image} alt={recipe.name} />}
      <p>{recipe.summary}</p>
      <ul>
        {recipe.ingredients?.map((ing, idx) => (
          <li key={idx}>{ing.name}</li>
        ))}
      </ul>
      <ol>
        {recipe.instructions?.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
