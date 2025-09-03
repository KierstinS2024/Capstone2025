// path: src/app/meal-plans/page.tsx
/**
 * MealPlansListPage
 * Displays all meal plans for the logged-in user
 * Allows creating a new meal plan or navigating to a detail page
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes?: string;
}

export default function MealPlansListPage() {
  const { token } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    const res = await fetch("/api/meal-plans", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMealPlans(data.data || []);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Meal Plans</h1>

      <Link
        href="/meal-plans/create"
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Create New Meal Plan
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {mealPlans.map((plan) => (
          <Link
            key={plan._id}
            href={`/meal-plans/${plan._id}`}
            className="border p-4 rounded hover:shadow"
          >
            <h2 className="font-bold">
              Week of {new Date(plan.weekStartDate).toDateString()}
            </h2>
            {plan.notes && <p>{plan.notes}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
