// PATH: src/app/meal-plans/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useMealPlans } from "@/context/MealPlanContext";
import MealPlanEditor from "@/components/MealPlanEditor";
import Navbar from "@/components/Navbar";

export default function MealPlanDetailPage() {
  const { id } = useParams();
  const { mealPlans } = useMealPlans();
  const plan = mealPlans.find((p) => p.id === id);

  if (!plan) return <p>Meal plan not found.</p>;

  return (
    <>
      <Navbar />
      <main>
        <MealPlanEditor plan={plan} />
      </main>
    </>
  );
}
