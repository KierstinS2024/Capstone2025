// Path: src/components/MealPlanCard.tsx
"use client";

import React, { useState } from "react";
import type { MealPlanEntry, MealType } from "@/types/mealPlan";
import RecipeCard from "./RecipeCard";
import { AddMealForm } from "./AddMealForm";

interface MealPlanCardProps {
  meal: MealPlanEntry;
  isGuest?: boolean;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({
  meal,
  isGuest = false,
}) => {
  const [editingMealType, setEditingMealType] = useState<MealType | null>(null);

  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #d8cfc4",
        borderRadius: 10,
        backgroundColor: "#f4f1ed",
      }}
    >
      <h2 style={{ fontSize: 20, marginBottom: 12, color: "#6b4c3b" }}>
        {meal.mealType}
      </h2>

      {meal.recipeId ? (
        <RecipeCard recipeId={meal.recipeId} />
      ) : (
        <div
          onClick={() => !isGuest && setEditingMealType(meal.mealType)}
          style={{
            padding: 12,
            border: "1px dashed #c0b49f",
            borderRadius: 8,
            cursor: isGuest ? "default" : "pointer",
          }}
        >
          Add {meal.mealType}
        </div>
      )}

      {editingMealType && !isGuest && (
        <AddMealForm
          mealType={editingMealType}
          onClose={() => setEditingMealType(null)}
        />
      )}
    </div>
  );
};

export default MealPlanCard;
