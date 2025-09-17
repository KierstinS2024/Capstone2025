// src/components/GenerateShoppingList.tsx
"use client";

import { useMealPlans } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";

export default function GenerateShoppingList({
  mealPlanId,
}: {
  mealPlanId: string;
}) {
  const { generateFromMealPlan } = useShoppingList();
  const { mealPlans } = useMealPlans();
  const plan = mealPlans.find((p) => p._id === mealPlanId);

  if (!plan) return null;

  return (
    <button onClick={() => generateFromMealPlan(mealPlanId)}>
      Generate Shopping List from {plan.title}
    </button>
  );
}
