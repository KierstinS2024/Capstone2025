// ===========================================
// PATH: src/app/meal-plans/page.tsx
"use client";

import React, { useState } from "react";
import { useMealPlans } from "@/context/MealPlanContext";
import { useAuth } from "@/context/AuthContext";
import MealPlanEditor from "@/components/MealPlanEditor";
import Navbar from "@/components/Navbar";
import { todayISO, addDays } from "@/lib/helpers";
import styles from "@/styles/theme-mealplan.module.css";

export default function MealPlansPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    activePlan: currentPlan,
    setActivePlan,
    loading: planLoading,
    createMealPlan,
    deleteMealPlan,
  } = useMealPlans();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStartDate, setNewStartDate] = useState<string>(todayISO());
  const [newEndDate, setNewEndDate] = useState<string>(addDays(todayISO(), 6)!);
  const [formError, setFormError] = useState<string | null>(null);

  function handleOpenCreateForm() {
    setShowCreateForm(true);
    setFormError(null);
    setNewStartDate(todayISO());
    setNewEndDate(addDays(todayISO(), 6)!);
  }

  // -------------------------------------------
  // Create meal plan safely
  // -------------------------------------------
  async function handleCreatePlan(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (!user?.id) {
      setFormError("Your account is still loading. Please wait a moment.");
      return;
    }

    let safeEndDate = newEndDate;
    if (new Date(safeEndDate) < new Date(newStartDate)) {
      safeEndDate = addDays(newStartDate, 6)!;
      setNewEndDate(safeEndDate);
    }

    try {
      const createdPlan = await createMealPlan({
        startDate: newStartDate,
        endDate: safeEndDate,
        meals: {},
      });

      setActivePlan(createdPlan);
      setShowCreateForm(false);
    } catch (error: any) {
      console.error("Failed to create plan:", error);
      setFormError(
        error?.message.includes("Unauthorized")
          ? "You are not logged in. Please refresh and try again."
          : error?.message || "Failed to create meal plan."
      );
    }
  }

  // -------------------------------------------
  // Delete meal plan
  // -------------------------------------------
  async function handleDeletePlan(planId: string) {
    if (!window.confirm("Delete this meal plan?")) return;
    try {
      await deleteMealPlan(planId);
      setActivePlan(null);
    } catch (error) {
      console.error("Failed to delete plan:", error);
    }
  }

  // -------------------------------------------
  // Loading state
  // -------------------------------------------
  if (authLoading || planLoading)
    return (
      <div className={styles.pageContainer}>
        <Navbar />
        <p>Loading your meal plans...</p>
      </div>
    );

  // -------------------------------------------
  // Main UI
  // -------------------------------------------
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <h1 className={styles.heading1}>Meal Plans</h1>

      {!currentPlan && !showCreateForm && (
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleOpenCreateForm}
        >
          + Create Meal Plan
        </button>
      )}

      {!currentPlan && showCreateForm && (
        <form className={styles.createPlanForm} onSubmit={handleCreatePlan}>
          <label>
            Start Date:
            <input
              type="date"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
            />
          </label>

          <label>
            End Date:
            <input
              type="date"
              value={newEndDate}
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

          <MealPlanEditor plan={currentPlan} />
        </div>
      )}

      {!currentPlan && !showCreateForm && (
        <p>No meal plan available. Create one to get started!</p>
      )}
    </div>
  );
}
