// src/components/RecipeCard.tsx
import React from "react";

interface RecipeCardProps {
  name: string;
  cuisine?: string;
  instructions: string[];
  source?: string; // e.g., "Local" or "Spoonacular"
}

const RecipeCard: React.FC<RecipeCardProps> = ({ name, cuisine, instructions, source }) => {
  return (
    <div className="recipe-card border p-4 rounded-md shadow-sm mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span className="text-sm text-gray-500">{source || "Local"}</span>
      </div>
      {cuisine && <p className="text-sm text-gray-600 mb-2">Cuisine: {cuisine}</p>}
      <ul className="list-decimal list-inside text-sm">
        {instructions.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeCard;
