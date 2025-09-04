// path: src/app/dashboard/page.tsx
/**
 * Dashboard Page
 * ----------------
 * Provides the user with an overview of their app data:
 *  - Summary cards for total meal plans, shopping lists, and food intake entries
 *  - Quick links to create new items
 *  - Recent activity sections
 *  - Designed to follow the user flow story for a smooth experience
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  // State for counts and recent data
  const [mealPlansCount, setMealPlansCount] = useState<number>(0);
  const [shoppingListsCount, setShoppingListsCount] = useState<number>(0);
  const [foodIntakeCount, setFoodIntakeCount] = useState<number>(0);

  const [recentMealPlans, setRecentMealPlans] = useState<any[]>([]);
  const [recentShoppingLists, setRecentShoppingLists] = useState<any[]>([]);
  const [recentFoodIntake, setRecentFoodIntake] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  // Fetch all overview data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch Meal Plans
        const mealPlansRes = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (mealPlansRes.ok) {
          const data = await mealPlansRes.json();
          const plans = data.data || [];
          setMealPlansCount(plans.length);
          setRecentMealPlans(plans.slice(-3).reverse()); // most recent 3
        }

        // Fetch Shopping Lists
        const shoppingListsRes = await fetch("/api/shopping-lists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (shoppingListsRes.ok) {
          const data = await shoppingListsRes.json();
          const lists = data.data || [];
          setShoppingListsCount(lists.length);
          setRecentShoppingLists(lists.slice(-3).reverse());
        }

        // Fetch Food Intake
        const foodIntakeRes = await fetch("/api/food-intake", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (foodIntakeRes.ok) {
          const data = await foodIntakeRes.json();
          const entries = data.data || [];
          setFoodIntakeCount(entries.length);
          setRecentFoodIntake(entries.slice(-3).reverse());
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading dashboard...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ border: "1px solid #ccc", padding: "20px", flex: 1 }}>
          <h2>Meal Plans</h2>
          <p>Total: {mealPlansCount}</p>
          <Link href="/meal-plans">
            <button>View Meal Plans</button>
          </Link>
          <Link href="/meal-plans/new">
            <button style={{ marginLeft: "10px" }}>New Meal Plan</button>
          </Link>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px", flex: 1 }}>
          <h2>Shopping Lists</h2>
          <p>Total: {shoppingListsCount}</p>
          <Link href="/shopping-lists">
            <button>View Lists</button>
          </Link>
          <Link href="/shopping-lists/new">
            <button style={{ marginLeft: "10px" }}>New List</button>
          </Link>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "20px", flex: 1 }}>
          <h2>Food Intake</h2>
          <p>Total Entries: {foodIntakeCount}</p>
          <Link href="/food-intake">
            <button>View Intake</button>
          </Link>
          <Link href="/food-intake/new">
            <button style={{ marginLeft: "10px" }}>Log Food</button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Recent Meal Plans */}
        <div style={{ flex: 1 }}>
          <h3>Recent Meal Plans</h3>
          {recentMealPlans.length === 0 ? (
            <p>No recent meal plans.</p>
          ) : (
            <ul>
              {recentMealPlans.map((plan) => (
                <li key={plan._id}>
                  <Link href={`/meal-plans/${plan._id}`}>
                    Week of {plan.weekStartDate.split("T")[0]}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Shopping Lists */}
        <div style={{ flex: 1 }}>
          <h3>Recent Shopping Lists</h3>
          {recentShoppingLists.length === 0 ? (
            <p>No recent shopping lists.</p>
          ) : (
            <ul>
              {recentShoppingLists.map((list) => (
                <li key={list._id}>
                  <Link href={`/shopping-lists/${list._id}`}>{list.title}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Food Intake */}
        <div style={{ flex: 1 }}>
          <h3>Recent Food Intake</h3>
          {recentFoodIntake.length === 0 ? (
            <p>No recent entries.</p>
          ) : (
            <ul>
              {recentFoodIntake.map((entry) => (
                <li key={entry._id}>
                  {entry.recipeId
                    ? `Recipe: ${entry.recipeId}`
                    : `Ingredient: ${entry.ingredientId}`}{" "}
                  - {entry.quantity} {entry.unit} on {entry.date.split("T")[0]}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
