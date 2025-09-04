// path: src/app/meal-plans/page.tsx
/**
 * MealPlansListPage.tsx
 * ---------------------
 * Displays all meal plans for the logged-in user.
 * User can view, edit, or create new plans.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { getApiClient } from "@/lib/api";

interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes?: string;
  entries?: any[];
}

export default function MealPlansListPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token") || undefined;
        const client = getApiClient(token);
        const res = await client.get("/meal-plans");
        setMealPlans(res.data.data || []);
      } catch (err: any) {
        setError(err.message || "Error loading meal plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <header>
          <h1>Meal Plans</h1>
          <Link href="/meal-plans/new">
            <button>+ New Meal Plan</button>
          </Link>
        </header>
        {loading && <p>Loading meal plans...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {mealPlans.map((plan) => (
              <li
                key={plan._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <Link href={`/meal-plans/${plan._id}`}>
                  <strong>Week of {plan.weekStartDate.split("T")[0]}</strong>
                </Link>
                <p>{plan.notes || "No notes"}</p>
                <p>Entries: {plan.entries?.length || "No recipes added"}</p>
              </li>
            ))}
            {mealPlans.length === 0 && <li>No meal plans yet. Create one!</li>}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
