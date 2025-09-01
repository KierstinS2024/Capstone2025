// src/components/MealPlanList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import MealPlanCard from "./MealPlanCard";

interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes?: string;
  entries?: any[];
}

export default function MealPlanList() {
  const [plans, setPlans] = useState<MealPlan[]>([]);

  const fetchMealPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/meal-plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(response.data.plans || []);
    } catch (err) {
      console.error("Error fetching meal plans", err);
    }
  };

  useEffect(() => {
    fetchMealPlans();
  }, []);

  return (
    <div className="meal-plan-list">
      {plans.map(plan => (
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
