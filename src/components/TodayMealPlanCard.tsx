// src/components/TodayMealPlanCard.tsx
"use client";

import { MealPlan } from "@/types/mealPlan";
import MealPlanCard from "./MealPlanCard";

export default function TodayMealPlanCard({ plan }: { plan: MealPlan | null }) {
  if (!plan) return <p>No meal plan for today</p>;
  return <MealPlanCard plan={plan} />;
}
