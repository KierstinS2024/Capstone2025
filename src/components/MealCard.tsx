// path: src/components/MealCard.tsx
"use client";

import React from "react";
import { Meal } from "@/types/mealPlan";

interface MealCardProps {
  meal: Meal;
  onRemove?: (mealId: string) => void;
  onSwap?: (mealId: string) => void;
  onOpenRecipe?: (recipeId?: string) => void;
}

export default function MealCard({
  meal,
  onRemove,
  onSwap,
  onOpenRecipe,
}: MealCardProps) {
  return (
    <div
      className="meal-card"
      style={{
        position: "relative",
        width: 160,
        height: 160,
        borderRadius: 8,
        overflow: "hidden",
        cursor: meal.recipeId ? "pointer" : "default",
        backgroundColor: "#f3f3f3",
        backgroundImage: meal.image ? `url(${meal.image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => meal.recipeId && onOpenRecipe?.(meal.recipeId)}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          textAlign: "center",
          padding: "4px 0",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {meal.type.toUpperCase()}
      </div>
      {meal.recipeId && (
        <div
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            display: "flex",
            gap: 4,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwap?.(meal.id);
            }}
          >
            Swap
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(meal.id);
            }}
          >
            Remove
          </button>
        </div>
      )}
      {!meal.recipeId && (
        <button
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "6px 10px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#1d4ed8",
            color: "#fff",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenRecipe?.();
          }}
        >
          Add Recipe
        </button>
      )}
    </div>
  );
}
