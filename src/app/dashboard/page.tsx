// src/app/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

interface User {
  id: string;
  email: string;
}

interface MealPlanEntry {
  _id: string;
  weekStartDate: string;
  notes?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlanEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    async function loadData() {
      try {
        // Fetch user info
        const userRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (!userData.user) {
          router.push("/auth/login");
          return;
        }
        setUser(userData.user);

        // Fetch meal plans
        const plansRes = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const plansData = await plansRes.json();
        setMealPlans(plansData.plans || []);
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
    <div className={styles.dashboardPage}>
      {/* Welcome header */}
      <h1 className={styles.welcome}>Welcome, {user?.email}</h1>

      {/* Meal plans section */}
      <h2 className={styles.sectionTitle}>Your Meal Plans</h2>

      {mealPlans.length === 0 ? (
        <p className={styles.emptyMessage}>
          You haven't created any meal plans yet.
        </p>
      ) : (
        <ul>
          {mealPlans.map((plan) => (
            <li key={plan._id}>
              <Link
                href={`/dashboard/meal-plans/${plan._id}`}
                className="text-blue-600 hover:underline"
              >
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
