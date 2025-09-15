// src/components/MealPlanCard.tsx
"use client";

import React from "react";
import { MealPlan } from "@/types/mealPlan";
import MealCard from "./MealCard";
import { useMealPlan } from "@/context/MealPlanContext";

interface MealPlanCardProps {
  plan: MealPlan;
  selectedDate: string;
  onSelectPlan: (id: string) => void;
  isSelected: boolean;
}

export default function MealPlanCard({
  plan,
  selectedDate,
  onSelectPlan,
  isSelected,
}: MealPlanCardProps) {
  const { removeMealFromPlan } = useMealPlan();

  const mealsForDate = plan.meals.filter((m) => m.date === selectedDate);

  return (
    <div
      className={`mealplan-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelectPlan(plan._id)}
    >
      <p>
        {plan.startDate} → {plan.endDate}
      </p>
      <div className="meals-preview">
        {["breakfast", "lunch", "dinner"].map((type) => {
          const meal = mealsForDate.find((m) => m.type === type);
          return (
            <MealCard
              key={type}
              type={type as any}
              meal={meal || null}
              onRemove={meal ? (id) => removeMealFromPlan(id) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
