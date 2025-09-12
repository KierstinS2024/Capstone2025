// Path: src/components/MealPlanCard.tsx
"use client";

import React, { useState } from "react";
import AddMealForm from "./AddMealForm";
import type { MealPlanEntry, MealType } from "@/types/mealPlan";

interface MealPlanCardProps {
  todayMeals: MealPlanEntry[];
  mealPlanDate: string;
  isGuest?: boolean;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({
  todayMeals,
  mealPlanDate,
  isGuest = false,
}) => {
  const [addingMealType, setAddingMealType] = useState<MealType | null>(null);

  const mealsByType: Record<MealType, MealPlanEntry | undefined> = {
    Breakfast: todayMeals.find((m) => m.mealType === "Breakfast"),
    Lunch: todayMeals.find((m) => m.mealType === "Lunch"),
    Dinner: todayMeals.find((m) => m.mealType === "Dinner"),
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 20,
        backgroundColor: "white",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        Meals for {new Date(mealPlanDate).toLocaleDateString()}
      </h2>

      {(["Breakfast", "Lunch", "Dinner"] as MealType[]).map((mealType) => (
        <div
          key={mealType}
          style={{
            borderTop: "1px solid #eee",
            paddingTop: 12,
            marginTop: 12,
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 500 }}>{mealType}</h3>

          {mealsByType[mealType] ? (
            <div style={{ marginTop: 8 }}>
              <p style={{ fontWeight: 500 }}>
                {mealsByType[mealType]?.recipeTitle}
              </p>
              {mealsByType[mealType]?.recipeImage && (
                <img
                  src={mealsByType[mealType]?.recipeImage}
                  alt={mealsByType[mealType]?.recipeTitle}
                  style={{ width: "100%", maxWidth: 200, borderRadius: 8 }}
                />
              )}
            </div>
          ) : (
            <p style={{ fontStyle: "italic", color: "#777", marginTop: 4 }}>
              No {mealType} planned.
            </p>
          )}

          {/* Show Add button ONLY if NOT guest */}
          {!isGuest && !mealsByType[mealType] && (
            <button
              onClick={() => setAddingMealType(mealType)}
              style={{
                marginTop: 8,
                padding: "6px 12px",
                border: "none",
                borderRadius: 6,
                backgroundColor: "#3b82f6",
                color: "white",
                cursor: "pointer",
              }}
            >
              + Add {mealType}
            </button>
          )}
        </div>
      ))}

      {/* Add Meal Form Modal */}
      {addingMealType && (
        <AddMealForm
          mealType={addingMealType}
          onClose={() => setAddingMealType(null)}
        />
      )}
    </div>
  );
};

export default MealPlanCard;
