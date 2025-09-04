// path: src/app/meal-plans/page.tsx
/**
 * Meal Plans List Page
 * --------------------
 * Displays all meal plans for the logged-in user.
 * Users can view, edit, or create new plans.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";

export default function MealPlansPage() {
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const res = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMealPlans(data.data || []);
        } else console.error("Failed to fetch meal plans");
      } catch (err) {
        console.error("Error loading meal plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMealPlans();
  }, []);

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>My Meal Plans</h1>
        <Link href="/meal-plans/new">+ Create New Meal Plan</Link>
        {loading ? (
          <p>Loading meal plans…</p>
        ) : mealPlans.length === 0 ? (
          <p>You don’t have any meal plans yet. Create one to get started!</p>
        ) : (
          <ul>
            {mealPlans.map((plan) => (
              <li key={plan._id}>
                <Link href={`/meal-plans/${plan._id}`}>
                  Week of {plan.weekStartDate.split("T")[0]}
                </Link>
                <p>{plan.notes || "No notes"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
