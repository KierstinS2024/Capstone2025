// Path: src/app/dashboard/meal-plans/page.tsx
"use client";

/**
 * MealPlansDashboardPage
 * ----------------------
 * Dashboard listing all meal plans.
 * Features:
 * - Protected route
 * - Fetches meal plans from API
 * - Links to create new or edit existing meal plans
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function MealPlansDashboardPage() {
  return (
    <ProtectedRoute>
      <MealPlansList />
    </ProtectedRoute>
  );
}

interface MealPlan {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
}

function MealPlansList() {
  const router = useRouter();
  const { user } = useAuth();

  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all meal plans
  useEffect(() => {
    if (!user) return;

    const fetchMealPlans = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/meal-plans", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch meal plans");

        const data = await res.json();
        setMealPlans(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlans();
  }, [user]);

  if (loading) return <p>Loading meal plans...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <main>
      <h1>Meal Plans</h1>

      <button onClick={() => router.push("/dashboard/meal-plans/new")}>
        + Create New Meal Plan
      </button>

      {mealPlans.length === 0 ? (
        <p>No meal plans found.</p>
      ) : (
        <ul>
          {mealPlans.map((plan) => (
            <li key={plan._id}>
              <span>
                {plan.title} — {new Date(plan.startDate).toLocaleDateString()}{" "}
                to {new Date(plan.endDate).toLocaleDateString()}
              </span>
              <button
                onClick={() =>
                  router.push(`/dashboard/meal-plans/${plan._id}/edit`)
                }
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
