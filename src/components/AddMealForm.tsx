// Path: src/components/AddMealForm.tsx
"use client";

import React, { useState } from "react";
import { useRecipes } from "@/context/RecipeContext";
import { useMealPlan } from "@/context/MealPlanContext";
import type { MealType } from "@/types/mealPlan";
import type { Recipe } from "@/types/recipe";

interface AddMealFormProps {
  mealType: MealType;
  onClose: () => void;
}

export const AddMealForm: React.FC<AddMealFormProps> = ({
  mealType,
  onClose,
}) => {
  const { recipes } = useRecipes();
  const { addMeal } = useMealPlan();

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("");

  const handleAdd = () => {
    const recipe = recipes.find((r) => r._id === selectedRecipeId);
    if (!recipe) return;

    addMeal({
      date: new Date().toISOString(),
      mealType,
      recipeId: recipe._id,
      recipeTitle: recipe.title,
      recipeImage: recipe.image,
      ingredients: recipe.ingredients,
    });

    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: 24,
          maxWidth: 500,
          width: "90%",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
          Add {mealType}
        </h2>

        <select
          value={selectedRecipeId}
          onChange={(e) => setSelectedRecipeId(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            marginBottom: 16,
          }}
        >
          <option value="">Select a recipe</option>
          {recipes.map((recipe: Recipe) => (
            <option key={recipe._id} value={recipe._id}>
              {recipe.title}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #ccc",
              backgroundColor: "#f4f4f4",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedRecipeId}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#3b82f6",
              color: "#fff",
              cursor: selectedRecipeId ? "pointer" : "not-allowed",
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
