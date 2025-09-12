// Path: src/components/RecipeCard.tsx
"use client";

import React from "react";
import type { Recipe } from "@/types/recipe";
import { useShoppingList } from "@/context/ShoppingListContext";

interface RecipeCardProps {
  recipe: Recipe;
}

/**
 * Card component to display recipe information
 * Allows adding individual ingredients to the shopping list
 */
const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { addItem } = useShoppingList();

  /**
   * Add a single ingredient to the shopping list
   */
  const handleAddIngredient = (ingredientName: string) => {
    addItem({ name: ingredientName, mealTypes: [], isNew: true });
    alert(`${ingredientName} added to shopping list!`);
  };

  return (
    <div
      style={{
        border: "1px solid #d8cfc4",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        backgroundColor: "#fffdfb",
      }}
    >
      <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
        {recipe.title}
      </h3>
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ width: "100%", borderRadius: 8, marginBottom: 8 }}
        />
      )}

      <h4 style={{ fontSize: 16, fontWeight: 500 }}>Ingredients:</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {recipe.ingredients.map((ingredient) => (
          <li
            key={ingredient.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4px 0",
            }}
          >
            <span>
              {ingredient.quantity} {ingredient.name}
            </span>
            <button
              onClick={() => handleAddIngredient(ingredient.name)}
              style={{
                padding: "2px 6px",
                borderRadius: 4,
                border: "none",
                backgroundColor: "#3b82f6",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeCard;
