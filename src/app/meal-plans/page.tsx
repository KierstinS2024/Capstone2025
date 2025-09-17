// PATH: src/app/meal-plans/page.tsx
"use client";

import { useMealPlans } from "../../context/MealPlanContext";
import WeeklyMealPlan from "../../components/WeeklyMealPlan";
import Navbar from "../../components/Navbar";

export default function MealPlansPage() {
  const { mealPlans } = useMealPlans();

  return (
    <>
      <Navbar />
      <main>
        <h1>Meal Plans</h1>
        <WeeklyMealPlan plans={mealPlans} />
      </main>
    </>
  );
}
