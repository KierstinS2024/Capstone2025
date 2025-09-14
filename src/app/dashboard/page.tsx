// path: src/app/dashboard/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "@/styles/dashboard.css";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { mealPlans } = useMealPlan();
  const { shoppingList } = useShoppingList();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!user) return null;

  // Take next 7 days' meal plans (or fewer if not available)
  const upcomingPlans = mealPlans
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 7);

  // Take first 5 shopping list items
  const previewItems = shoppingList.slice(0, 5);

  return (
    <div className="dashboard-page">
      <h2 className="page-title">Welcome, {user.email}</h2>
      <p className="subtitle">
        Quick overview of your meals and shopping list:
      </p>

      {/* Upcoming Meal Plans */}
      <section className="dashboard-section">
        <h3 className="section-title">Upcoming Meal Plans</h3>
        {upcomingPlans.length === 0 ? (
          <p className="empty-state">No meal plans yet.</p>
        ) : (
          <ul className="meal-preview-list">
            {upcomingPlans.map((plan) => (
              <li key={plan._id} className="meal-preview-item">
                <strong>{plan.date}:</strong>{" "}
                {plan.meals.length > 0
                  ? plan.meals.map((m) => m.name).join(", ")
                  : "No meals added"}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Shopping List Preview */}
      <section className="dashboard-section">
        <h3 className="section-title">Shopping List Preview</h3>
        {shoppingList.length === 0 ? (
          <p className="empty-state">Your shopping list is empty.</p>
        ) : (
          <ul className="shopping-preview-list">
            {previewItems.map((item) => (
              <li key={item.id} className="shopping-preview-item">
                {item.name} {item.purchased ? "(purchased)" : ""}
              </li>
            ))}
            {shoppingList.length > 5 && <li>…and more</li>}
          </ul>
        )}
      </section>

      {/* Quick Links */}
      <section className="dashboard-section links-grid">
        <Link href="/meal-plans" className="link-card">
          Manage Meal Plans
        </Link>
        <Link href="/recipes" className="link-card">
          Discover Recipes
        </Link>
        <Link href="/shopping-list" className="link-card">
          View Shopping List
        </Link>
      </section>
    </div>
  );
}
