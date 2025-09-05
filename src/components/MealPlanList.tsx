import React, { useState } from "react";
import MealPlanCard from "./MealPlanCard";
import { useMealPlanContext } from "@/context/MealPlanContext";
import CreateMealPlanModal from "./CreateMealPlanModal";
import styles from "./MealPlanList.module.css";

export default function MealPlanList() {
  const { mealPlans } = useMealPlanContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* Button to open modal */}
      <button className={styles.newButton} onClick={() => setIsModalOpen(true)}>
        + New Meal Plan
      </button>

      {/* Modal for creating new meal plan */}
      <CreateMealPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Meal plan list */}
      {mealPlans && mealPlans.length > 0 ? (
        <div className={styles.mealPlanList}>
          {mealPlans.map((plan) => (
            <MealPlanCard
              key={plan._id}
              id={plan._id}
              weekStartDate={plan.weekStartDate}
              notes={plan.notes}
              entriesCount={plan.entries?.length}
              onClick={() => console.log("Navigate to detail page:", plan._id)}
            />
          ))}
        </div>
      ) : (
        <p className={styles.emptyMessage}>No meal plans yet.</p>
      )}
    </div>
  );
}
