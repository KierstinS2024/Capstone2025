"use client";

import React, { useEffect, useState } from "react";
import { useMealPlans } from "@/context/MealPlanContext";
import MealPlanEditor from "@/components/MealPlanEditor";
import Navbar from "@/components/Navbar";
import { todayISO, addDays } from "@/lib/helpers";

export default function MealPlansPage() {
  const {
    activePlan,
    mealPlans,
    setActivePlan,
    loading,
    createMealPlan,
    deleteMealPlan,
  } = useMealPlans();

  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(addDays(todayISO(), 6) || todayISO());
  const [error, setError] = useState<string | null>(null);

  // Automatically select the first plan if none is active
  useEffect(() => {
    if (!activePlan && mealPlans.length > 0) {
      setActivePlan(mealPlans[0]);
    }
  }, [activePlan, mealPlans, setActivePlan]);

  const isOverlap = mealPlans.some((plan) => {
    if (activePlan?.id === plan.id) return false;
    const newStart = new Date(startDate).getTime();
    const newEnd = new Date(endDate).getTime();
    const planStart = new Date(plan.startDate).getTime();
    const planEnd = new Date(plan.endDate).getTime();
    return newStart <= planEnd && newEnd >= planStart;
  });

  function handleOpenForm() {
    setShowForm(true);
    setError(null);
    setStartDate(todayISO());
    setEndDate(addDays(todayISO(), 6) || todayISO());
  }

  async function handleCreatePlan(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (isOverlap) {
      setError("Selected date range overlaps an existing plan.");
      return;
    }

    let safeEnd = endDate;
    if (new Date(endDate) < new Date(startDate)) {
      safeEnd = addDays(startDate, 6) || startDate;
      setEndDate(safeEnd);
    }

    try {
      const newPlan = await createMealPlan({
        startDate,
        endDate: safeEnd,
        meals: {},
      });

      // ✅ Focus on the new plan immediately
      setActivePlan(newPlan);

      // ✅ Auto-close the form
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          "Failed to create meal plan. Dates may overlap an existing plan."
      );
    }
  }

  async function handleDeletePlan(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meal plan?"
    );
    if (!confirmed) return;

    await deleteMealPlan(id);
    // activePlan automatically updated in context
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <p>Loading meal plans...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <h1>Meal Plans</h1>

      {/* Create Plan Button + Form */}
      {!showForm ? (
        <button onClick={handleOpenForm}>+ Create Meal Plan</button>
      ) : (
        <form onSubmit={handleCreatePlan} style={{ marginBottom: "1rem" }}>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label style={{ marginLeft: "1rem" }}>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button
            type="submit"
            style={{ marginLeft: "1rem" }}
            disabled={isOverlap}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setError(null);
            }}
            style={{ marginLeft: "0.5rem" }}
          >
            Cancel
          </button>

          {isOverlap && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>
              Selected date range overlaps an existing plan.
            </p>
          )}
          {error && !isOverlap && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
          )}
        </form>
      )}

      {/* Switch between existing plans */}
      {mealPlans.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <h2>Your Plans</h2>
          <ul>
            {mealPlans.map((plan) => (
              <li key={plan.id} style={{ marginBottom: "0.5rem" }}>
                <button
                  onClick={() => setActivePlan(plan)}
                  style={{
                    fontWeight: activePlan?.id === plan.id ? "bold" : "normal",
                    marginRight: "0.5rem",
                  }}
                >
                  {plan.startDate} → {plan.endDate}
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  style={{ color: "red" }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Active Plan Editor */}
      {activePlan ? (
        <MealPlanEditor plan={activePlan} />
      ) : (
        <p>No meal plan available. Create one to get started!</p>
      )}
    </div>
  );
}
