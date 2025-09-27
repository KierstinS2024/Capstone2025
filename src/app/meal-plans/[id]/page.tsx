"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMealPlans } from "@/context/MealPlanContext";
import MealPlanEditor from "@/components/MealPlanEditor";
import Navbar from "@/components/Navbar";
import { MealPlan } from "@/types/mealPlan";
import styles from "@/styles/theme-mealplan.module.css";

export default function MealPlanDetailPage() {
  const params = useParams();
  const planIdRaw = params.id;

  // Guard: ensure planId is string
  const planId = Array.isArray(planIdRaw) ? planIdRaw[0] : planIdRaw;

  const { activePlan, fetchMealPlan } = useMealPlans();
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlan() {
      if (!planId) return;

      setLoading(true);
      setError(null);

      try {
        // Use context plan if IDs match
        if (activePlan?.id === planId) {
          setPlan(activePlan);
        } else {
          const fetched = await fetchMealPlan(planId);
          if (!fetched) {
            setError("Meal plan not found.");
          } else {
            setPlan(fetched);
          }
        }
      } catch (err) {
        console.error("Failed to load meal plan:", err);
        setError("Failed to load meal plan.");
      } finally {
        setLoading(false);
      }
    }

    loadPlan();
  }, [planId, activePlan, fetchMealPlan]);

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Navbar />
        <p>Loading meal plan...</p>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className={styles.pageContainer}>
        <Navbar />
        <p>{error || "Meal plan not found."}</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <h1 className={styles.heading1}>Meal Plan Details</h1>
      <MealPlanEditor plan={plan} />
    </div>
  );
}
