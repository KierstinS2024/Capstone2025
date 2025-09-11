import React from "react";
import type { MealPlanEntry, MealType } from "@/types/mealPlan";

interface MealCardProps {
  mealType: MealType;
  meal?: MealPlanEntry; // undefined if not added yet
  onAddMeal: () => void;
  onClick: () => void;
}

/**
 * Mini card representing a single meal
 * Used in MealPlanCard
 */
export const MealCard: React.FC<MealCardProps> = ({
  mealType,
  meal,
  onAddMeal,
  onClick,
}) => {
  return (
    <div
      onClick={meal ? onClick : undefined}
      style={{
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: meal ? "#fafafa" : "#f0f0f0",
        textAlign: "center",
        cursor: meal ? "pointer" : "default",
      }}
    >
      <h4 style={{ marginBottom: "8px" }}>{mealType}</h4>

      {meal ? (
        <>
          <img
            src={meal.recipeImage || "/placeholder-recipe.jpg"}
            alt={meal.recipeTitle || "Recipe image"}
            style={{ width: "100%", borderRadius: "4px", marginBottom: "6px" }}
          />
          <div style={{ fontWeight: 500 }}>{meal.recipeTitle || "Recipe"}</div>
        </>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddMeal();
          }}
          style={{
            padding: "6px 12px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + Add Meal
        </button>
      )}
    </div>
  );
};
