// path: src/app/dashboard/meal-plans/page.tsx
    
"use client";

// --- React imports ---
import { useState, useEffect } from "react";

// --- Context imports ---
import { useMealPlanContext, MealPlan } from "@/context/MealPlanContext";

// --- Component imports ---
import MealPlanList from "@/components/MealPlanList";
import CreateMealPlanModal from "@/components/CreateMealPlanModal";

// --- Styles ---
import styles from "./MealPlansListPage.module.css";

// ------------------------------
// MealPlansListPage
// ------------------------------
// Displays a list of user's meal plans with options to create new ones
// Integrates MealPlanContext for global state and reactivity
// Includes loading, empty, and modal states for improved UX
// ------------------------------
export default function MealPlansListPage() {
  const { mealPlans, fetchMealPlans, loading } = useMealPlanContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch meal plans on component mount
  useEffect(() => {
    fetchMealPlans();
  }, [fetchMealPlans]);

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <h1 className={styles.title}>Meal Plans</h1>

      {/* Create Button */}
      <button
        className={styles.createButton}
        onClick={() => setIsModalOpen(true)}
      >
        Create New Meal Plan
      </button>

      {/* Loading State */}
      {loading && <p className={styles.statusMessage}>Loading meal plans...</p>}

      {/* Empty State */}
      {!loading && mealPlans.length === 0 && (
        <p className={styles.statusMessage}>
          You don't have any meal plans yet. Start by creating one!
        </p>
      )}

      {/* Meal Plan List */}
      {!loading && mealPlans.length > 0 && (
        <MealPlanList mealPlans={mealPlans as MealPlan[]} />
      )}

      {/* Create Meal Plan Modal */}
      <CreateMealPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
