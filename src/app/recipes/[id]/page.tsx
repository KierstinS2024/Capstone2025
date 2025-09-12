// Path: src/app/recipes/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRecipes } from "@/context/RecipeContext";
import { useMealPlan } from "@/context/MealPlanContext";
import { useGuest } from "@/context/GuestContext";
import type { Recipe } from "@/types/recipe";
import type { MealType } from "@/types/mealPlan";

const RecipeDetailsPage: React.FC = () => {
  const params = useParams();
  const recipeId = params.id as string;

  const { recipes } = useRecipes();
  const { addMeal } = useMealPlan();
  const { addMealToGuestPlan } = useGuest();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("Dinner");

  useEffect(() => {
    const foundRecipe = recipes.find((r) => r._id === recipeId);
    if (foundRecipe) setRecipe(foundRecipe);
  }, [recipeId, recipes]);

  if (!recipe) return <p>Recipe not found.</p>;

  const handleAddToMealPlan = () => {
    addMeal({
      date: new Date().toISOString(),
      mealType: selectedMealType,
      recipeId: recipe._id,
      recipeTitle: recipe.title,
      recipeImage: recipe.image,
      ingredients: recipe.ingredients,
    });
    alert(`${recipe.title} added to your ${selectedMealType} plan!`);
  };

  const handleAddToGuestPlan = () => {
    addMealToGuestPlan(selectedMealType, recipe._id);
    alert(`${recipe.title} added to guest ${selectedMealType} plan!`);
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>
        {recipe.title}
      </h1>

      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
        />
      )}

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 500 }}>Ingredients</h2>
        <ul style={{ paddingLeft: 16, marginTop: 8 }}>
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx}>
              {ing.quantity} {ing.unit ?? ""} {ing.name}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 500 }}>Instructions</h2>
        <p style={{ whiteSpace: "pre-line", marginTop: 8 }}>
          {recipe.instructions}
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <label style={{ marginRight: 8 }}>Add to Meal Type:</label>
        <select
          value={selectedMealType}
          onChange={(e) => setSelectedMealType(e.target.value as MealType)}
          style={{ padding: "6px 10px", borderRadius: 4, marginRight: 8 }}
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
        </select>
      </section>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleAddToMealPlan}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#3b82f6",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add to My Meal Plan
        </button>
        <button
          onClick={handleAddToGuestPlan}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#22c55e",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add to Guest Plan
        </button>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
