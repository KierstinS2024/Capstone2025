// src/pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// I define TypeScript types for my data
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

  // I store user info and meal plans in state
  const [user, setUser] = useState<User | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlanEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // I fetch the current user when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user profile
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);

          // Once I have user, fetch meal plans
          fetch("/api/meal-plans", {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((plans) => {
              setMealPlans(plans);
              setLoading(false);
            })
            .catch(() => setError("Failed to load meal plans"));
        } else {
          router.push("/login");
        }
      })
      .catch(() => {
        setError("Failed to load user");
        setLoading(false);
      });
  }, [router]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user?.email}</h1>

      <h2>Your Meal Plans</h2>
      {mealPlans.length === 0 && <p>You have no meal plans yet.</p>}
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
