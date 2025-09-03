// path: src/app/meal-plans/page.tsx
/**
 * Meal Plans List Page
 * ---------------------
 * Displays all meal plans for the logged-in user.
 * From here, the user can:
 *  - View their saved plans
 *  - Navigate to create a new plan
 *  - Click on a plan to edit it
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MealPlansPage() {
  // Store all meal plans retrieved from the backend
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch meal plans when component first loads
  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const res = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (res.ok) {
          const data = await res.json();
          setMealPlans(data.data || []);
        } else {
          console.error("Failed to fetch meal plans");
        }
      } catch (err) {
        console.error("Error loading meal plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlans();
  }, []);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading meal plans...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Meal Plans</h1>

      {/* Button to create a new plan */}
      <div style={{ marginBottom: "20px" }}>
        <Link href="/meal-plans/new">
          <button>Create New Meal Plan</button>
        </Link>
      </div>

      {/* If no plans exist, show helpful message */}
      {mealPlans.length === 0 ? (
        <p>You don’t have any meal plans yet. Create one to get started!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {mealPlans.map((plan) => (
            <li
              key={plan._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "4px",
              }}
            >
              {/* Link to edit the selected plan */}
              <Link href={`/meal-plans/${plan._id}`}>
                <strong>Week of {plan.weekStartDate.split("T")[0]}</strong>
              </Link>
              <p>{plan.notes || "No notes"}</p>
              <p>
                Entries:{" "}
                {plan.entries?.length
                  ? plan.entries.length
                  : "No recipes added"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
