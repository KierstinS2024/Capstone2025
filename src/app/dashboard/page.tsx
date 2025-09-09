// Path: src/app/dashboard/page.tsx
"use client";

/**
 * DashboardPage
 * --------------------
 * Main landing page for logged-in users.
 * Features:
 * - Static navigation cards (Ingredients, Recipes, Meal Plans)
 * - User-specific meal plans list with MealPlanCard
 * - Quick actions: create meal plan, generate shopping list
 * - Loading and error handling
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useMealPlanContext } from "@/context/MealPlanContext";
import MealPlanCard from "@/components/MealPlanCard";
import styles from "./DashboardPage.module.css";

interface User {
  _id: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { mealPlans, setMealPlans } = useMealPlanContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/auth/login");

    async function fetchData() {
      try {
        // --- Fetch user ---
        const userRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (!userData.user) return router.push("/auth/login");
        setUser(userData.user);

        // --- Fetch meal plans ---
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

  if (loading) return <p className={styles.message}>Loading dashboard...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Welcome, {user?.email}</h1>

      {/* Static Navigation Cards */}
      <section className={styles.cards}>
        <Link href="/dashboard/ingredients" className={styles.card}>
          <h2>🧂 Ingredients</h2>
          <p>Manage your ingredients</p>
        </Link>
        <Link href="/dashboard/recipes" className={styles.card}>
          <h2>🍲 Recipes</h2>
          <p>Create, edit, and view recipes</p>
        </Link>
        <Link href="/dashboard/meal-plans" className={styles.card}>
          <h2>📅 Meal Plans</h2>
          <p>Plan your weekly meals</p>
        </Link>
      </section>

      {/* Quick Actions */}
      <section className={styles.quickActions}>
        <button
          className={styles.actionButton}
          onClick={() => router.push("/dashboard/meal-plans/new")}
        >
          + Create New Meal Plan
        </button>
        <button
          className={styles.actionButton}
          onClick={() => {
            if (!mealPlans[0]) return alert("No meal plans available");
            router.push(
              `/dashboard/shopping-lists/from-meal-plan/${mealPlans[0]._id}`
            );
          }}
        >
          Generate Shopping List
        </button>
      </section>

      {/* User Meal Plans */}
      <section className={styles.section}>
        <h2>Your Meal Plans</h2>
        {mealPlans.length === 0 ? (
          <p className={styles.emptyMessage}>
            You haven’t created any meal plans yet.
          </p>
        ) : (
          <div className={styles.cardsGrid}>
            {mealPlans.map((plan) => (
              <MealPlanCard
                key={plan._id}
                id={plan._id}
                weekStartDate={plan.weekStartDate}
                notes={plan.notes}
                entriesCount={plan.entries?.length}
                onClick={() => router.push(`/dashboard/meal-plans/${plan._id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
