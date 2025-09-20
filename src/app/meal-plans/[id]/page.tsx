// PATH: src/app/meal-plans/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useMealPlans } from "@/context/MealPlanContext";
import MealPlanDetail from "@/components/MealPlanDetail";
import Navbar from "@/components/Navbar";

export default function MealPlanDetailPage() {
  const { id } = useParams();
  const { mealPlans, update } = useMealPlans(); // use `update` method from context
  const plan = mealPlans.find((p) => p.id === id);

  if (!plan) return <p>Meal plan not found.</p>;

  // Handler to pass to MealPlanDetail
  const handleSave = async (updatedPlan: typeof plan) => {
    await update(plan.id, updatedPlan);
  };

  return (
    <>
      <Navbar />
      <main>
        <MealPlanDetail plan={plan} onSave={handleSave} />
      </main>
    </>
  );
}
