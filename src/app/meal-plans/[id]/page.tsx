// path: src/app/meal-plans/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import MealCard from "@/components/MealCard";
import AddMealForm from "@/components/AddMealForm";
import "@/styles/mealplan-detail.css";

interface MealPlanDetailPageProps {
  params: { id: string };
}

export default function MealPlanDetailPage({
  params,
}: MealPlanDetailPageProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { mealPlans, addMealToPlan, removeMealFromPlan, refreshPlans } =
    useMealPlan();

  const [currentPlan, setCurrentPlan] = useState<(typeof mealPlans)[0] | null>(
    null
  );

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  // Refresh plan and find current plan by id
  useEffect(() => {
    if (user) {
      refreshPlans();
      const plan = mealPlans.find((p) => p._id === params.id);
      setCurrentPlan(plan || null);
    }
  }, [mealPlans, params.id, refreshPlans, user]);

  if (authLoading || !currentPlan)
    return <p className="loading">Loading meal plan...</p>;
  if (!user) return null;

  return (
    <div className="mealplan-detail-page">
      <h1 className="page-title">
        Meal Plan: {currentPlan.startDate} → {currentPlan.endDate}
      </h1>

      {/* Meals Section */}
      <div className="meals-section">
        {["breakfast", "lunch", "dinner"].map((type) => {
          const meal = currentPlan.meals.find((m) => m.type === type);
          return (
            <MealCard
              key={type}
              type={type}
              meal={meal || null}
              onRemove={(mealId) => removeMealFromPlan(mealId)}
              onOpen={(meal) => console.log("Open recipe:", meal)}
            />
          );
        })}
      </div>

      {/* Add Meal Form */}
      <AddMealForm
        planId={currentPlan._id}
        onAdd={(meal, date) => addMealToPlan(meal, date)}
      />
    </div>
  );
}
