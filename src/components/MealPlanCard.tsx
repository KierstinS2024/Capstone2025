import React, { useState } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import { MealCard } from "./MealCard";
import { AddMealForm } from "./AddMealForm";
import type { MealPlanEntry, MealType } from "@/types/mealPlan";

export const MealPlanCard: React.FC = () => {
  const { todayMeals } = useMealPlan();
  const [editingMealType, setEditingMealType] = useState<MealType | null>(null);

  // Map today's meals for Breakfast, Lunch, Dinner
  const mealsByType: Record<MealType, MealPlanEntry | undefined> = {
    Breakfast: todayMeals.find((m) => m.mealType === "Breakfast"),
    Lunch: todayMeals.find((m) => m.mealType === "Lunch"),
    Dinner: todayMeals.find((m) => m.mealType === "Dinner"),
  };

  const handleAddMeal = (mealType: MealType) => setEditingMealType(mealType);
  const handleOpenRecipe = (meal: MealPlanEntry) => {
    window.location.href = `/recipes/${meal.recipeId}`;
  };

  const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner"];

  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
      }}
    >
      <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
        Today's Meal Plan
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
        }}
      >
        {mealTypes.map((mealType) => (
          <MealCard
            key={mealType}
            mealType={mealType}
            meal={mealsByType[mealType]}
            onAddMeal={() => handleAddMeal(mealType)}
            onClick={() =>
              mealsByType[mealType] && handleOpenRecipe(mealsByType[mealType]!)
            }
          />
        ))}
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
