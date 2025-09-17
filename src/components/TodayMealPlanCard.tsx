// src/components/TodayMealPlanCard.tsx
"use client";

import { IMealPlan } from "@/types/mealPlan";
import MealPlanCard from "./MealPlanCard";

export default function TodayMealPlanCard({
  plan,
}: {
  plan: IMealPlan | null;
}) {
  if (!plan) return <p>No meal plan for today</p>;
  return <MealPlanCard plan={plan} />;
}
