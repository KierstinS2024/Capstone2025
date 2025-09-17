// PATH: src/app/meal-plans/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useMealPlans } from "../../../context/MealPlanContext";
import MealPlanDetail from "../../../components/MealPlanDetail";
import GenerateShoppingListButton from "../../../components/GenerateShoppingListButton";
import Navbar from "../../../components/Navbar";

export default function MealPlanDetailPage() {
  const { id } = useParams();
  const { mealPlans, updatePlan } = useMealPlans();
  const plan = mealPlans.find((p) => p._id === id);

  if (!plan) return <p>Meal plan not found.</p>;

  return (
    <>
      <Navbar />
      <main>
        <MealPlanDetail plan={plan} onSave={updatePlan} />
        <GenerateShoppingListButton planId={plan._id} />
      </main>
    </>
  );
}
