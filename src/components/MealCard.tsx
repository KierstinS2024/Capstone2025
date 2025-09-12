// Path: src/components/MealCard.tsx
// Mini card for Breakfast/Lunch/Dinner
// Shows recipe info if available, else + Add Meal placeholder
// Handles guest mode and inline styling

"use client";

import React from "react";
import type { MealPlanEntry, MealType } from "@/types/mealPlan";

interface MealCardProps {
  meal?: MealPlanEntry; // optional: meal may not exist yet
  mealType: MealType;
  isGuest?: boolean; // disable edits for guest view
  onAddMeal: () => void;
  onClick?: () => void; // optional click when meal exists
}

const MealCard: React.FC<MealCardProps> = ({
  meal,
  mealType,
  isGuest = false,
  onAddMeal,
  onClick,
}) => {
  const hasMeal = !!meal;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: 200,
        height: 180,
        border: hasMeal ? "1px solid #d8cfc4" : "1px dashed #d8cfc4",
        borderRadius: 12,
        backgroundColor: hasMeal ? "#fffdfb" : "#fefcf9",
        cursor: hasMeal && !isGuest ? "pointer" : "default",
        padding: 12,
        textAlign: "center",
      }}
      onClick={hasMeal && !isGuest && onClick ? onClick : undefined}
    >
      {hasMeal ? (
        <>
          {meal?.recipeImage && (
            <img
              src={meal.recipeImage}
              alt={meal.recipeTitle}
              style={{
                width: "100%",
                height: 100,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 8,
              }}
            />
          )}
          <p
            style={{
              fontWeight: 600,
              color: "#3a2d25",
              fontSize: 16,
            }}
          >
            {meal?.recipeTitle}
          </p>
        </>
      ) : (
        <>
          <p style={{ marginBottom: 12, color: "#8b7d70" }}>
            No {mealType.toLowerCase()} planned yet
          </p>
          <button
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#4f7a65",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={onAddMeal}
          >
            + Add {mealType}
          </button>
        </>
      )}
    </div>
  );
};

export default MealCard;
