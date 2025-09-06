// path: src/app/meal-plans/page.tsx
/**
 * MealPlansListPage
 * -----------------
 * Displays all meal plans for the logged-in user.
 * Users can:
 *  - View all existing meal plans
 *  - Navigate to edit a meal plan
 *  - Create a new meal plan
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";

interface MealEntry {
  dayOfWeek: string;
  mealType: string;
  recipeId: string;
  servings: number;
}

interface MealPlan {
  _id: string;
  weekStartDate: string;
  notes?: string;
  entries?: MealEntry[];
}

export default function MealPlansListPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load meal plans");

        const data = await res.json();
        setMealPlans(data.data || []);
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
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Meal Plans</h1>
          <Link href="/meal-plans/new">
            <button>+ New Meal Plan</button>
          </Link>
        </header>

        {loading && <p>Loading meal plans...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {mealPlans.length === 0 && <li>No meal plans yet. Create one!</li>}

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
                <Link href={`/meal-plans/${plan._id}`}>
                  <button>Edit</button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
