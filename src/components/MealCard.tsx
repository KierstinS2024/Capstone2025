// Path: src/components/MealCard.tsx
"use client";

import React from "react";
import type { MealPlanEntry, MealType } from "@/types/mealPlan";
import { useRouter } from "next/navigation";

interface MealCardProps {
  meal: MealPlanEntry;
  mealType: MealType;
  isGuest?: boolean;
  onAddMeal?: () => void;
}

const MealCard: React.FC<MealCardProps> = ({
  meal,
  mealType,
  isGuest = false,
  onAddMeal,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (meal.recipeId) {
      router.push(`/recipes/${meal.recipeId}`);
    } else if (onAddMeal) {
      onAddMeal();
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: meal.recipeId || onAddMeal ? "pointer" : "default",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        width: 180,
        height: 140,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      {meal.recipeId ? (
        <>
          {meal.recipeImage && (
            <img
              src={meal.recipeImage}
              alt={meal.recipeTitle}
              style={{
                width: "100%",
                height: 80,
                objectFit: "cover",
                marginBottom: 8,
                borderRadius: 4,
              }}
            />
          )}
          <span style={{ fontWeight: 600, textAlign: "center" }}>
            {meal.recipeTitle}
          </span>
        </>
      ) : (
        <span style={{ color: "#3b82f6", fontWeight: 600 }}>
          + Add {mealType}
        </span>
      )}
    </div>
  );
};

export default MealCard;
