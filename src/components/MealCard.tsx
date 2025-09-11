// Path: src/components/MealCard.tsx
"use client";

import React from "react";
import RecipeCard from "./RecipeCard";
import type { MealPlanEntry } from "@/types/mealPlan";
import type { Recipe } from "@/types/recipe";

// Props designed for guest or authenticated mode
interface MealCardProps {
  meal: MealPlanEntry;
  recipe: Recipe; // Full recipe object for authenticated users
  isGuest?: boolean; // Disable actions requiring backend
}

const MealCard: React.FC<MealCardProps> = ({
  meal,
  recipe,
  isGuest = false,
}) => {
  return (
    <div
      style={{
        padding: "12px",
        border: "1px solid #d8cfc4",
        borderRadius: "10px",
        backgroundColor: "#f4f1ed",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Meal type header */}
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "8px",
          color: "#6b4c3b",
        }}
      >
        {meal.mealType}
      </h3>

      {/* RecipeCard */}
      <RecipeCard recipe={recipe} isGuest={isGuest} />
    </div>
  );
};

export default MealCard;
