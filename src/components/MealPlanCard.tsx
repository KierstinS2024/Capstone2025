// Path: src/components/MealPlanCard.tsx
"use client";

import React, { useState } from "react";
import type { MealPlanEntry, MealType } from "@/types/mealPlan";
import MealCard from "./MealCard";
import AddMealForm from "./AddMealForm";

interface MealPlanCardProps {
  todayMeals: MealPlanEntry[]; // meals for this day
  mealPlanDate: string; // ISO string for date
  isGuest?: boolean;
}

const MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner"];

const MealPlanCard: React.FC<MealPlanCardProps> = ({
  todayMeals,
  mealPlanDate,
  isGuest = false,
}) => {
  // Track which meal type modal is open
  const [addingMealType, setAddingMealType] = useState<MealType | null>(null);

  // Map today's meals by type
  const mealsByType: Record<MealType, MealPlanEntry | null> = {
    Breakfast: null,
    Lunch: null,
    Dinner: null,
  };
  MEAL_TYPES.forEach((type) => {
    const meal = todayMeals.find((m) => m.mealType === type);
    mealsByType[type] = meal || null;
  });

  return (
    <div
      style={{
        padding: 24,
        border: "1px solid #d8cfc4",
        borderRadius: 12,
        backgroundColor: "#f4f1ed",
        marginBottom: 24,
      }}
    >
      {/* Date header */}
      <h2
        style={{
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 16,
          color: "#6b4c3b",
        }}
      >
        {new Date(mealPlanDate).toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })}
      </h2>

      {/* Meal cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {MEAL_TYPES.map((mealType) => (
          <MealCard
            key={mealType}
            meal={mealsByType[mealType]}
            mealType={mealType}
            isGuest={isGuest || !todayMeals.length}
            onAddMeal={() => setAddingMealType(mealType)}
          />
        ))}
      </div>

      {/* AddMealForm modal */}
      {addingMealType && !isGuest && (
        <AddMealForm
          mealType={addingMealType}
          onClose={() => setAddingMealType(null)}
        />
      )}

      {/* Guest plan modal (optional) */}
      {addingMealType && isGuest && (
        <AddMealForm
          mealType={addingMealType}
          onClose={() => setAddingMealType(null)}
        />
      )}
    </div>
  );
};

export default MealPlanCard;
