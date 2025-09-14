// path: src/app/meal-plans/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import MealPlanCard from "@/components/MealPlanCard";
import "@/styles/mealPlans.css";

export default function MealPlansPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { mealPlans, refreshPlans } = useMealPlan();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  // Refresh meal plans on mount
  useEffect(() => {
    if (user) refreshPlans();
  }, [refreshPlans, user]);

  if (authLoading) return <p className="loading">Loading...</p>;
  if (!user) return null;

  const handleSelectPlan = (planId: string) => setSelectedPlanId(planId);
  const handleCreatePlan = () => setShowCalendar(true);
  const handleDateChange = (date: Date) => setSelectedDate(date);

  return (
    <div className="meal-plans-page">
      <h1 className="page-title">Your Meal Plans</h1>

      {/* Top Controls */}
      <div className="top-controls">
        <button className="button" onClick={handleCreatePlan}>
          + Create New Meal Plan
        </button>
        {showCalendar && (
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()}
          />
        )}
      </div>

      {/* Meal Plans List */}
      <div className="plans-list">
        {mealPlans.length === 0 ? (
          <p className="empty-state">No meal plans yet.</p>
        ) : (
          mealPlans.map((plan) => (
            <div
              key={plan._id}
              className={`plan-card ${
                selectedPlanId === plan._id ? "selected" : ""
              }`}
              onClick={() => handleSelectPlan(plan._id)}
            >
              <p>
                {plan.startDate} → {plan.endDate}
              </p>
              <div className="day-meals-preview">
                {plan.meals
                  .filter(
                    (meal) =>
                      meal.date === selectedDate.toISOString().slice(0, 10)
                  )
                  .map((meal) => (
                    <MealPlanCard key={meal.id} meal={meal} />
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
