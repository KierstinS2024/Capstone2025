// Path: src/components/MealCard.tsx
// Mini card for a single meal: shows recipe title/image or + Add Meal

"use client";

import React from "react";
import type { MealPlanEntry, MealType } from "@/types/mealPlan";
import { useRouter } from "next/navigation";

interface MealCardProps {
  mealType: MealType;
  meal: MealPlanEntry;
  isGuest?: boolean;
}

const MealCard: React.FC<MealCardProps> = ({ mealType, meal, isGuest }) => {
  const router = useRouter();

  const handleClick = () => {
    if (meal.recipeId) {
      router.push(`/recipes/${meal.recipeId}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        minWidth: "180px",
        padding: "12px",
        borderRadius: "10px",
        border: meal.recipeId ? "1px solid #c0b49f" : "1px dashed #c0b49f",
        backgroundColor: "#faf7f2",
        cursor: meal.recipeId ? "pointer" : isGuest ? "default" : "pointer",
        textAlign: "center",
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
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            />
          )}
          <div style={{ fontWeight: 500, color: "#6b4c3b" }}>
            {meal.recipeTitle}
          </div>
        </>
      ) : (
        <div style={{ color: "#8b7d70", fontWeight: 500 }}>
          + Add {mealType}
        </div>
      )}
    </div>
  );
};

export default MealCard;
