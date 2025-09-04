// path: src/app/meal-plans/page.tsx
/**
 * Meal Plans List Page
 * ---------------------
 * Lists all meal plans for the logged-in user.
 * Users can create a new plan or edit existing ones.
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMealPlans();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading meal plans...</p>;

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>My Meal Plans</h1>
        <Link href="/meal-plans/new">
          <button>Create New Meal Plan</button>
        </Link>

        {mealPlans.length === 0 ? (
          <p>No meal plans yet. Create one!</p>
        ) : (
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
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
