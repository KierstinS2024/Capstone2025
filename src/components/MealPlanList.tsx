// src/components/MealPlanList.tsx
import React, { useEffect } from "react";
import axios from "axios";
import MealPlanCard from "./MealPlanCard";
import { useMealPlanContext } from "@/context/MealPlanContext";

// Type for a meal plan
interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes?: string;
  entries?: any[];
}

export default function MealPlanList() {
  const { mealPlans, setMealPlans } = useMealPlanContext();

  const fetchMealPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("/api/meal-plans", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMealPlans(response.data.plans || []);
    } catch (err) {
      console.error("Error fetching meal plans", err);
    }
  };

  useEffect(() => {
    fetchMealPlans();
  }, []);

  if (!mealPlans || mealPlans.length === 0) {
    return <p className="text-gray-500 mt-4">No meal plans yet.</p>;
  }

  return (
    <div className="meal-plan-list grid gap-4">
      {mealPlans.map((plan: MealPlan) => (
        <MealPlanCard
          key={plan._id}
          id={plan._id}
          weekStartDate={plan.weekStartDate}
          notes={plan.notes}
          entriesCount={plan.entries?.length}
        />
      ))}
    </div>
  );
}
