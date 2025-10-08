// ===========================================
// PATH: src/components/MealPlanCard.tsx
// ===========================================
"use client";

import React from "react";
import { MealPlan } from "@/types/mealPlan";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/mealPlanCard.module.css";

interface Props {
  plan: MealPlan;
  onClick?: () => void;
  onDelete?: (id: string) => Promise<void>;
}

/**
 * MealPlanCard
 * - Displays a summary of a meal plan
 * - Allows deletion if it belongs to the current user
 */
export default function MealPlanCard({ plan, onClick, onDelete }: Props) {
  const { user } = useAuth();

  // Only allow edit/delete if the plan belongs to the current user
  const isUserPlan = user?.email && plan.userEmail === user.email;

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm("Are you sure you want to delete this meal plan?")) return;
    try {
      await onDelete(plan.id);
    } catch (err) {
      console.error("Failed to delete meal plan", err);
    }
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <h3>{plan.name || "Untitled Plan"}</h3>
      <p>
        {plan.startDate || "N/A"} → {plan.endDate || "N/A"}
      </p>

      {isUserPlan && onDelete && (
        <button
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering card click
            handleDelete();
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}
