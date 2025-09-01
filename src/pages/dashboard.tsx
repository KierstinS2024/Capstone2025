// src/pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// Types
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

  const [user, setUser] = useState<User | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlanEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function loadData() {
      try {
        // Get the user's profile
        const userRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (!userData.user) {
          router.push("/login");
          return;
        }
        setUser(userData.user);

        // Get the meal plans
        const plansRes = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const plansData = await plansRes.json(); // now returns raw array
        setMealPlans(plansData);
      } catch (err) {
        console.error(err);
        setError("Could not load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading) return <p>Loading your dashboard...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user?.email}</h1>

      <h2>Your Meal Plans</h2>
      {mealPlans.length === 0 ? (
        <p>You haven't created any meal plans yet.</p>
      ) : (
        <ul>
          {mealPlans.map((plan) => (
            <li key={plan._id}>
              <Link href={`/meal-plans/${plan._id}`}>
                Week of {new Date(plan.weekStartDate).toLocaleDateString()}
                {plan.notes ? ` - ${plan.notes}` : ""}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
