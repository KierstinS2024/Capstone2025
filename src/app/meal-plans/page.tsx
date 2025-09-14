"use client";

import React, { useState, useEffect } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import MealCard from "@/components/MealCard";
import ShoppingListSidebar from "@/components/ShoppingListSidebar";
import "@/styles/mealPlans.css";

export default function MealPlansPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { mealPlans, addMealToPlan } = useMealPlan();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  const selectedPlan = mealPlans.find((p) => p._id === selectedPlanId);

  const handleDateChange = (date: Date) => setSelectedDate(date);

  const handleCreatePlan = () => setShowCalendar(true);

  const handleSelectPlan = (planId: string) => setSelectedPlanId(planId);

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

      {/* Existing Plans */}
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
                    (m) => m.date === selectedDate.toISOString().slice(0, 10)
                  )
                  .map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                  ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sidebar: Shopping List */}
      {selectedPlan && (
        <ShoppingListSidebar planId={selectedPlan._id} date={selectedDate} />
      )}
    </div>
  );
}
