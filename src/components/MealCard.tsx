// src/components/MealCard.tsx
"use client";

import React from "react";
import { Meal } from "@/types/mealPlan";

interface MealCardProps {
  meal: Meal | null;
  type: "Breakfast" | "Lunch" | "Dinner";
  onRemove?: (mealId: string) => void;
  onOpen?: (meal: Meal) => void;
}

export default function MealCard({
  meal,
  type,
  onRemove,
  onOpen,
}: MealCardProps) {
  if (!meal) return <div className="meal-card empty">+ Add {type}</div>;

  return (
    <div className="meal-card">
      {meal.image && (
        <img src={meal.image} alt={meal.name} className="meal-img" />
      )}
      <div className="meal-info">
        <h4>{meal.name}</h4>
        <div className="meal-actions">
          {onOpen && <button onClick={() => onOpen(meal)}>View</button>}
          {onRemove && (
            <button onClick={() => onRemove(meal.id)}>Remove</button>
          )}
        </div>
      </div>
    </div>
  );
}
