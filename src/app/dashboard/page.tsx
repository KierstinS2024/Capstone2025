// path: src/app/dashboard/page.tsx
"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useRouter } from "next/navigation";
import TodayMealPlanCard from "@/components/TodayMealPlanCard";
import Link from "next/link";
import "@/styles/dashboard.css";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { refreshPlans } = useMealPlan();
  const { refreshList } = useShoppingList();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Refresh data when user is present
  useEffect(() => {
    if (user) {
      refreshPlans();
      refreshList();
    }
  }, [user, refreshPlans, refreshList]);

  if (authLoading || !user) return <p className="loading">Loading...</p>;

  return (
    <div className="dashboard-container">
      <h2 className="welcome">Welcome, {user.email}</h2>
      <p className="subtitle">Your command center for today</p>

      {/* Today’s Meal Plan */}
      <TodayMealPlanCard />

      {/* Quick Links */}
      <div className="quick-links">
        <Link href="/meal-plans" className="quick-link">
          Manage Meal Plans
        </Link>
        <Link href="/recipes" className="quick-link">
          Discover Recipes
        </Link>
        <Link href="/shopping-list" className="quick-link">
          View Shopping List
        </Link>
      </div>
    </div>
  );
}
