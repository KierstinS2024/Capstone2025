// Path: src/components/MealPlanCard.tsx
"use client";

import React, { useState } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import { useGuest } from "@/context/GuestContext";
import { AddMealForm } from "./AddMealForm";
import type { MealPlanEntry, MealType } from "@/types/mealPlan";
import { useRouter } from "next/navigation";

interface MealPlanCardProps {
  isGuest?: boolean;
}

const MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner"];

const MealPlanCard: React.FC<MealPlanCardProps> = ({ isGuest = false }) => {
  const { todayMeals } = useMealPlan();
  const { guestMealPlan } = useGuest();
  const router = useRouter();

  const entries = isGuest ? guestMealPlan : todayMeals;

  const [modalMealType, setModalMealType] = useState<MealType | null>(null);

  // Map entries to mealType for quick access
  const mealsByType: Record<MealType, MealPlanEntry | null> = {
    Breakfast: null,
    Lunch: null,
    Dinner: null,
  };

  entries.forEach((entry) => {
    mealsByType[entry.mealType] = entry;
  });

  const handleMealClick = (meal: MealPlanEntry) => {
    if (meal?.recipeId) {
      router.push(`/recipes/${meal.recipeId}`);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #d8cfc4",
        borderRadius: 12,
        padding: 24,
        backgroundColor: "#f9f6f2",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        Today’s Meals
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {MEAL_TYPES.map((mealType) => {
          const meal = mealsByType[mealType];

          return (
            <div
              key={mealType}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: 8,
                backgroundColor: "#fff",
                cursor: meal ? "pointer" : "default",
                border: "1px solid #ccc",
              }}
              onClick={() => meal && handleMealClick(meal)}
            >
              <span style={{ fontWeight: 500 }}>{mealType}</span>
              {meal ? (
                <span>{meal.recipeTitle}</span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalMealType(mealType);
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  + Add {mealType}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {modalMealType && (
        <AddMealForm
          mealType={modalMealType}
          onClose={() => setModalMealType(null)}
        />
      )}
    </div>
  );
};

export default MealPlanCard;
