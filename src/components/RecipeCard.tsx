// src/components/RecipeCard.tsx
import React from "react";
import { Recipe } from "../models/Recipe";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div>
      {/* Recipe title */}
      <h3>{recipe.title}</h3>
      {/* Ingredients list */}
      <ul>
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>
      {/* Instructions */}
      <p>{recipe.instructions}</p>
    </div>
  );
};

export default RecipeCard;
