// path: src/app/dashboard/DashboardPageContent.tsx
"use client";

/**
 * DashboardPageContent
 *
 * Displays the user's dashboard with:
 * - Welcome message
 * - Quick actions (create meal plan, generate shopping list)
 * - List of existing meal plans
 * - Handles deletion of meal plans
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useMealPlanContext, MealPlan } from "@/context/MealPlanContext";
import MealPlanCard from "@/components/MealPlanCard";
import styles from "./DashboardPage.module.css";

export default function DashboardPageContent() {
  const router = useRouter();
  const { logout } = useAuth();
  const { mealPlans, setMealPlans } = useMealPlanContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/auth/login");

    async function fetchData() {
      try {
        // Fetch current user info
        const userRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (!userData.user) return router.push("/auth/login");
        setUserEmail(userData.user.email);

        // Fetch all meal plans
        const plansRes = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const plansData = await plansRes.json();
        setMealPlans(plansData.mealPlans || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router, setMealPlans]);

  // Handle meal plan deletion
  const handleDelete = async (planId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/auth/login");

    try {
      const res = await fetch(`/api/meal-plans/${planId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete meal plan");

      setMealPlans(mealPlans.filter((plan) => plan._id !== planId));
    } catch (err) {
      console.error(err);
      alert("Could not delete meal plan");
    }
  };

  if (loading) return <p className={styles.title}>Loading...</p>;
  if (error) return <p className={styles.title}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <h1 className={styles.title}>Welcome, {userEmail}</h1>
      <div>
        <button onClick={() => router.push("/dashboard/meal-plans/new")}>
          + Create New Meal Plan
        </button>
        {mealPlans[0] && (
          <button
            onClick={() =>
              router.push(
                `/dashboard/shopping-lists/from-meal-plan/${mealPlans[0]._id}`
              )
            }
          >
            Generate Shopping List
          </button>
        )}
      </div>

      {/* Meal Plans Section */}
      <h2 className={styles.title}>Your Meal Plans</h2>
      {mealPlans.length === 0 ? (
        <p>No meal plans created yet.</p>
      ) : (
        <div className={styles.cards}>
          {mealPlans.map((plan) => (
            <MealPlanCard
              key={plan._id}
              id={plan._id}
              weekStartDate={plan.weekStartDate}
              notes={plan.notes}
              entriesCount={plan.entries?.length}
              onClick={() => router.push(`/dashboard/meal-plans/${plan._id}`)}
              onDelete={() => handleDelete(plan._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
