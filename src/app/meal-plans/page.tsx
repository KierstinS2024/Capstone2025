// ===========================================
// PATH: src/app/meal-plans/page.tsx
//
// MealPlansPage — main entry for meal plans
// - Shows create plan form if user has no plan
// - Shows current plan editor if plan exists
// - Handles deletion & active plan management
// - Fully TypeScript-safe with string-only dates
// ===========================================

"use client";

import React, { useState } from "react";
import { useMealPlans } from "@/context/MealPlanContext";
import { useAuth } from "@/context/AuthContext";
import MealPlanEditor from "@/components/MealPlanEditor";
import Navbar from "@/components/Navbar";
import { todayISO, addDays } from "@/lib/helpers";
import styles from "@/styles/theme-mealplan.module.css";

export default function MealPlansPage() {
  // -------------------------------
  // Contexts
  // -------------------------------
  const { user, loading: authLoading } = useAuth();
  const {
    activePlan: currentPlan,
    setActivePlan,
    loading: planLoading,
    createMealPlan,
    deleteMealPlan,
  } = useMealPlans();

  // -------------------------------
  // Local state for "create plan" form
  // -------------------------------
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Dates are always strings (never null)
  const [newStartDate, setNewStartDate] = useState<string>(todayISO());
  const [newEndDate, setNewEndDate] = useState<string>(addDays(todayISO(), 6)!);

  const [formError, setFormError] = useState<string | null>(null);

  // -------------------------------
  // Open the "create plan" form
  // -------------------------------
  function handleOpenCreateForm() {
    setShowCreateForm(true);
    setFormError(null);
    setNewStartDate(todayISO());
    setNewEndDate(addDays(todayISO(), 6)!);
  }

  // -------------------------------
  // Handle creation of a new meal plan
  // -------------------------------
  async function handleCreatePlan(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (!user?.id) {
      setFormError("Your account is still loading. Please wait a moment.");
      return;
    }

    // Ensure end date is always after start date
    let safeEndDate = newEndDate;
    if (new Date(safeEndDate) < new Date(newStartDate)) {
      // Add 6 days to start date as fallback
      safeEndDate = addDays(newStartDate, 6) ?? todayISO();
      setNewEndDate(safeEndDate);
    }

    try {
      // Create meal plan via context API
      const createdPlan = await createMealPlan({
        startDate: newStartDate,
        endDate: safeEndDate,
        meals: {}, // empty initial plan
      });

      // Set newly created plan as active
      setActivePlan(createdPlan);
      setShowCreateForm(false);
    } catch (error: any) {
      console.error("Failed to create plan:", error);
      setFormError(error?.message || "Failed to create meal plan.");
    }
  }

  // -------------------------------
  // Handle deletion of the current meal plan
  // -------------------------------
  async function handleDeletePlan(planId: string) {
    const confirmed = window.confirm("Delete this meal plan?");
    if (!confirmed) return;

    try {
      await deleteMealPlan(planId);
      setActivePlan(null);
    } catch (error) {
      console.error("Failed to delete plan:", error);
    }
  }

  // -------------------------------
  // Show loading state while auth or plan is loading
  // -------------------------------
  if (authLoading || planLoading) {
    return (
      <div className={styles.pageContainer}>
        <Navbar />
        <p>Loading your meal plans...</p>
      </div>
    );
  }

  // -------------------------------
  // Main UI
  // -------------------------------
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <h1 className={styles.heading1}>Meal Plans</h1>

      {/* ----------------------------------------
          Show "Create Meal Plan" button if no plan
          ---------------------------------------- */}
      {!currentPlan && !showCreateForm && (
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleOpenCreateForm}
        >
          + Create Meal Plan
        </button>
      )}

      {/* ----------------------------------------
          Create Meal Plan Form
          ---------------------------------------- */}
      {!currentPlan && showCreateForm && (
        <form className={styles.createPlanForm} onSubmit={handleCreatePlan}>
          <label>
            Start Date:
            <input
              type="date"
              value={newStartDate} // always a string
              onChange={(e) => setNewStartDate(e.target.value)}
            />
          </label>

          <label>
            End Date:
            <input
              type="date"
              value={newEndDate} // always a string
              onChange={(e) => setNewEndDate(e.target.value)}
            />
          </label>

          <button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
            disabled={!user?.id}
          >
            Save
          </button>

          <button
            type="button"
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={() => {
              setShowCreateForm(false);
              setFormError(null);
            }}
          >
            Cancel
          </button>

          {formError && <p className={styles.formError}>{formError}</p>}
        </form>
      )}

      {/* ----------------------------------------
          Show Active Plan Editor
          ---------------------------------------- */}
      {currentPlan && (
        <div>
          <h2 className={styles.heading2}>Your Current Plan</h2>

          <div className={styles.planItem}>
            <span className={styles.planDates}>
              {currentPlan.startDate} → {currentPlan.endDate}
            </span>

            <button
              className={`${styles.button} ${styles.buttonDanger}`}
              onClick={() => handleDeletePlan(currentPlan.id)}
            >
              Delete Plan
            </button>
          </div>

          {/* MealPlanEditor renders the week table and supports drag/drop */}
          <MealPlanEditor plan={currentPlan} />
        </div>
      )}

      {/* ----------------------------------------
          Empty state: no plan
          ---------------------------------------- */}
      {!currentPlan && !showCreateForm && (
        <p>No meal plan available. Create one to get started!</p>
      )}
    </div>
  );
}
