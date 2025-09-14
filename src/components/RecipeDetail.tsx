// path: src/components/RecipeDetail.tsx
"use client";

import React from "react";
import { Recipe } from "@/types/recipe";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import "@/styles/recipe-detail.css";

interface RecipeDetailProps {
  recipe: Recipe;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const { addMealToPlan } = useMealPlan();
  const { addMultipleItems } = useShoppingList();

  const today = new Date().toISOString().split("T")[0];

  const handleAddIngredients = () => {
    if (!recipe.ingredients) return;
    const names = recipe.ingredients.map((ing) => ing.name);
    addMultipleItems(names);
  };

  const handleAddToMealPlan = async (
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    const meal = {
      id: recipe.id,
      name: recipe.title,
      type: mealType,
      date: today,
      image: recipe.image,
      recipeId: recipe.id,
      ingredients: recipe.ingredients || [],
    };
    await addMealToPlan(meal, today);
  };

  return (
    <div className="recipe-detail">
      <h1 className="recipe-title">{recipe.title}</h1>
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      )}

      <section className="recipe-actions">
        <button className="button" onClick={handleAddIngredients}>
          Add All Ingredients to Shopping List
        </button>
        <div className="meal-type-buttons">
          {(["breakfast", "lunch", "dinner"] as const).map((type) => (
            <button
              key={type}
              className="button"
              onClick={() => handleAddToMealPlan(type)}
            >
              Add to {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {recipe.summary && (
        <section className="recipe-summary">
          <h2>Summary</h2>
          <p>{recipe.summary}</p>
        </section>
      )}

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <section className="recipe-ingredients">
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ing) => (
              <li key={ing.id || ing.name}>{ing.name}</li>
            ))}
          </ul>
        </section>
      )}

      {recipe.instructions && (
        <section className="recipe-instructions">
          <h2>Instructions</h2>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
