// path: src/app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMealPlan } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/styles/dashboard.css";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const { mealPlans, loading: mealPlanLoading, refreshPlans } = useMealPlan();
  const { shoppingList, toggleItem, removeItem, refreshList } =
    useShoppingList();

  const [todayPlan, setTodayPlan] = useState<(typeof mealPlans)[0] | null>(
    null
  );
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    refreshPlans();
    refreshList();
  }, [refreshPlans, refreshList]);

  useEffect(() => {
    const todayMealPlan = mealPlans.find(
      (plan) => plan.startDate <= today && plan.endDate >= today
    );
    setTodayPlan(todayMealPlan || null);
  }, [mealPlans, today]);

  if (authLoading || mealPlanLoading)
    return <p className="loading">Loading...</p>;
  if (!user) return null;

  return (
    <div className="dashboard-container">
      <h2 className="welcome">Welcome, {user.email}</h2>
      <p className="subtitle">Your command center for today</p>

      {todayPlan ? (
        <div className="today-plan">
          {/* MealPlan Card */}
          <div className="mealplan-card">
            <h3 className="mealplan-title">
              Meal Plan ({todayPlan.startDate} - {todayPlan.endDate})
            </h3>
            <div className="mini-meals">
              {["breakfast", "lunch", "dinner"].map((type) => {
                const meal = todayPlan.meals.find(
                  (m) => m.type === type && m.date === today
                );
                return (
                  <div key={type} className="mini-meal-card">
                    {meal ? (
                      <>
                        {meal.image && (
                          <img
                            src={meal.image}
                            alt={meal.name}
                            className="mini-meal-img"
                          />
                        )}
                        <span className="meal-type">{type}</span>
                        <span className="meal-name">{meal.name}</span>
                        <div className="meal-actions">
                          <Link
                            href={`/recipes/${meal.recipeId}`}
                            className="view-recipe"
                          >
                            View
                          </Link>
                          <button
                            className="remove-meal"
                            onClick={() => {
                              // Remove meal from plan (need MealPlanContext function)
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <button className="add-meal-button">+ Add {type}</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shopping List Panel */}
          <div className="shopping-list-panel">
            <h3 className="panel-title">Shopping List</h3>
            {shoppingList.length === 0 ? (
              <p className="empty-state">Your shopping list is empty.</p>
            ) : (
              <ul className="shopping-items">
                {shoppingList.map((item) => (
                  <li key={item.id} className="shopping-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={item.purchased}
                        onChange={() => toggleItem(item.id)}
                      />
                      <span className={item.purchased ? "purchased" : ""}>
                        {item.name}
                      </span>
                    </label>
                    <button
                      className="remove-button"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="no-today-plan">
          <p>No meal plan scheduled for today.</p>
          <Link href="/meal-plans" className="create-plan-button">
            Create Meal Plan
          </Link>
        </div>
      )}

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
