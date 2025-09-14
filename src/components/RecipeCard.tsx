// path: src/components/RecipeCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Recipe } from "@/types/recipe";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import "@/styles/recipeCard.css";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { addMealToPlan, getAllMealNames } = useMealPlan();
  const { addMultipleItems } = useShoppingList();

  // Add all recipe ingredients to shopping list
  const handleAddIngredients = () => {
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      const ingredientNames = recipe.ingredients.map((ing) => ing.name);
      addMultipleItems(ingredientNames);
    }
  };

  // Add recipe as a meal (default type: lunch) for today
  const handleAddToMealPlan = async () => {
    const today = new Date().toISOString().split("T")[0];
    const meal = {
      id: recipe.id,
      name: recipe.title,
      type: "lunch", // default meal type
      date: today,
      image: recipe.image,
      recipeId: recipe.id,
      ingredients: recipe.ingredients || [],
    };
    await addMealToPlan(meal, today);
  };

  return (
    <div className="recipe-card">
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="recipe-img" />
      )}
      <div className="recipe-info">
        <h3 className="recipe-title">{recipe.title}</h3>
        <p className="recipe-summary">{recipe.summary}</p>
      </div>
      <div className="recipe-actions">
        <Link href={`/recipes/${recipe.id}`} className="view-button">
          View
        </Link>
        <button onClick={handleAddIngredients} className="button">
          Add Ingredients
        </button>
        <button onClick={handleAddToMealPlan} className="button">
          Add to Meal Plan
        </button>
      </div>
    </div>
  );
}
