// src/pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Types for my user and meal plan data
interface User {
  id: string;
  email: string;
}

interface MealPlanEntry {
  _id: string;
  weekStartDate: string;
  notes?: string;
}

export default function Dashboard() {
  const router = useRouter();

  // State to keep track of user info and meal plans
  const [user, setUser] = useState<User | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlanEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user info and meal plans when the page loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If there's no token, send them back to login
      router.push("/login");
      return;
    }

    // First, get the user's profile
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);

          // Now that we have the user, grab their meal plans
          fetch("/api/meal-plans", {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((plans) => {
              setMealPlans(plans);
              setLoading(false);
            })
            .catch(() => setError("Could not load meal plans"));
        } else {
          router.push("/login");
        }
      })
      .catch(() => {
        setError("Could not load user info");
        setLoading(false);
      });
  }, [router]);

  if (loading) return <p>Loading your dashboard...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user?.email}</h1>

      <h2>Your Meal Plans</h2>
      {mealPlans.length === 0 && <p>You haven't created any meal plans yet.</p>}
      <ul>
        {mealPlans.map((plan) => (
          <li key={plan._id}>
            <a href={`/meal-plans/${plan._id}`}>
              Week of {new Date(plan.weekStartDate).toLocaleDateString()}
              {plan.notes ? ` - ${plan.notes}` : ""}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
