// path: src/components/CreateMealPlanModal.tsx
"use client";

/**
 * CreateMealPlanModal
 *
 * Modal for creating a new meal plan.
 * Uses the CreateMealPlanPage form internally for consistency.
 */

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./CreateMealPlanModal.module.css";
import CreateMealPlanPage from "@/app/dashboard/meal-plans/new/page";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMealPlanModal({ isOpen, onClose }: Props) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <CreateMealPlanPage />
      </div>
    </div>
  );
}
