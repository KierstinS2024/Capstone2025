// path: src/components/RecipeModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getRecipeById } from "@/lib/spoonacularApi";
import { RecipeDetail } from "@/types/recipe";
import "@/styles/recipe-detail.css";

export default function RecipeModal({
  recipeId,
  onClose,
}: {
  recipeId: string;
  onClose: () => void;
}) {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecipeById(recipeId)
      .then((data) => setRecipe(data))
      .finally(() => setLoading(false));
  }, [recipeId]);

  if (loading) return <div className="modal">Loading...</div>;

  if (!recipe) return <div className="modal">Recipe not found</div>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>{recipe.title}</h2>
        {recipe.image && <img src={recipe.image} alt={recipe.title} />}
        <h3>Ingredients</h3>
        <ul>
          {recipe.extendedIngredients.map((ing) => (
            <li key={ing.id}>{ing.original}</li>
          ))}
        </ul>
        <h3>Instructions</h3>
        <div dangerouslySetInnerHTML={{ __html: recipe.instructions || "" }} />
      </div>
    </div>
  );
}
