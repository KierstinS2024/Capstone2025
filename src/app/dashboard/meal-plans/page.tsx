/* src/app/dashboard/meal-plans/page.tsx */
"use client";

import React, { useEffect, useState } from "react";
import MealPlanCard from "@/components/MealPlanCard";
import CreateMealPlanModal from "@/components/CreateMealPlanModal";
import { useMealPlanContext } from "@/context/MealPlanContext";
import styles from "./MealPlannerPage.module.css";

export default function MealPlannerPage() {
  const { mealPlans, setMealPlans } = useMealPlanContext();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user's meal plans
  useEffect(() => {
    async function fetchMealPlans() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMealPlans(data.plans || []);
      } catch (err) {
        console.error("Failed to fetch meal plans", err);
        setMealPlans([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMealPlans();
  }, [setMealPlans]);

  if (loading)
    return <p className="text-center mt-10">Loading meal plans...</p>;

  return (
    <main className={styles.container}>
      {/* Page title */}
      <h1 className={styles.title}>Your Meal Plans</h1>

      {/* Button to open modal */}
      <button
        className={styles.newPlanButton}
        onClick={() => setIsModalOpen(true)}
      >
        + New Meal Plan
      </button>

      {/* Create Meal Plan Modal */}
      <CreateMealPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Display meal plans */}
      {mealPlans.length > 0 ? (
        <div className={styles.grid}>
          {mealPlans.map((plan) => (
            <MealPlanCard
              key={plan._id}
              id={plan._id}
              weekStartDate={plan.weekStartDate}
              notes={plan.notes}
              entriesCount={plan.entries?.length} // pass count only
            />
          ))}
        </div>
      ) : (
        <p className={styles.emptyMessage}>
          No meal plans yet. Start planning your week!
        </p>
      )}
    </main>
  );
}
