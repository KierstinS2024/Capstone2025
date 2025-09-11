// Path: src/components/GuestDashboard.tsx
"use client"; // Hooks/state required

import React, { useState } from "react";
import { useGuest } from "@/context/GuestContext";
import { AddMealForm } from "./AddMealForm";
import RecipeCard from "./RecipeCard";
import type { MealType } from "@/types/mealPlan";

/**
 * GuestDashboard
 * Displays a guest's simulated meal plan with sample recipes
 * Supports adding new recipes via modal
 */
export const GuestDashboard: React.FC = () => {
  const { guestMealPlan, addMealToGuestPlan, guestRecipes } = useGuest();
  const [editingMealType, setEditingMealType] = useState<MealType | null>(null);

  const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner"];

  // Map meals for rendering
  const mealsByType = mealTypes.reduce((acc, type) => {
    const meal = guestMealPlan.find((m) => m.mealType === type);
    acc[type] = meal;
    return acc;
  }, {} as Record<MealType, (typeof guestMealPlan)[0]>);

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", color: "#6b4c3b", marginBottom: "16px" }}>
        Guest Mode Meal Plan
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {mealTypes.map((mealType) => {
          const meal = mealsByType[mealType];
          return meal ? (
            <RecipeCard key={meal.recipeId} recipeId={meal.recipeId} />
          ) : (
            <div
              key={mealType}
              style={{
                padding: "12px",
                border: "1px dashed #c0b49f",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8b7d70",
                cursor: "pointer",
                backgroundColor: "#f9f6f2",
              }}
              onClick={() => setEditingMealType(mealType)}
            >
              Add {mealType}
            </div>
          );
        })}
      </div>

      {editingMealType && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <AddMealForm
            mealType={editingMealType}
            onClose={() => setEditingMealType(null)}
          />
        </div>
      )}
    </div>
  );
};
