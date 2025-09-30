// ===========================================
// PATH: src/app/meal-plans/page.tsx
// Meal Plans Page — create meal plan with flexible
// start/end dates, drag/drop meals, and show active plan date
// ===========================================

"use client";

import React, { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useMealPlans } from "@/context/MealPlanContext";
import MealPlanEditor from "@/components/MealPlanEditor";
import RecipeSidebar from "@/components/RecipeSidebar";
import styles from "@/styles/mealPlansPage.module.css";
import { MealType } from "@/types/mealPlan";

export default function MealPlansPage() {
  const {
    activePlan,
    loading,
    createMealPlan,
    addMealToPlan,
    moveMeal,
    updateMealPlan,
    fetchActivePlan,
  } = useMealPlans();

  // -----------------------------
  // Local UI state
  // -----------------------------
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const noPlanExists =
    !activePlan || !activePlan.startDate || !activePlan.endDate;

  // -----------------------------
  // Create a new meal plan with flexible date range
  // -----------------------------
  const handleCreateMealPlan = async () => {
    setError(null);

    // Validate input dates
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      // Create meal plan via context
      await createMealPlan(startDate, endDate);

      // Clear input fields
      setStartDate("");
      setEndDate("");

      // Refresh the active plan so the UI updates immediately
      await fetchActivePlan();
    } catch (err: any) {
      if (err?.message?.includes("already")) {
        setError(
          "You already have a meal plan. Delete it before creating a new one."
        );
      } else {
        setError("Something went wrong creating the meal plan.");
      }
      console.error("Failed to create meal plan:", err);
    }
  };

  // -----------------------------
  // Drag & drop handling
  // -----------------------------
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const isFromSidebar = source.droppableId === "recipes";
    const isToSidebar = destination.droppableId === "recipes";

    try {
      // 1️⃣ Drag from sidebar to plan
      if (isFromSidebar && !isToSidebar) {
        const [destDay, destMealType] = destination.droppableId.split("_") as [
          string,
          MealType
        ];
        await addMealToPlan(destDay, destMealType, draggableId);
        return;
      }

      // 2️⃣ Move within plan
      if (!isFromSidebar && !isToSidebar) {
        const [sourceDay, sourceMealType] = source.droppableId.split("_") as [
          string,
          MealType
        ];
        const [destDay, destMealType] = destination.droppableId.split("_") as [
          string,
          MealType
        ];

        if (sourceDay === destDay && sourceMealType === destMealType) return;

        await moveMeal(sourceDay, sourceMealType, destDay, destMealType);
        return;
      }

      // 3️⃣ Remove meal by dragging back to sidebar
      if (!isFromSidebar && isToSidebar && activePlan) {
        const [sourceDay, sourceMealType] = source.droppableId.split("_") as [
          string,
          MealType
        ];
        const updatedMeals = { ...activePlan.meals };
        updatedMeals[sourceDay][sourceMealType] = "";
        await updateMealPlan(activePlan.id, updatedMeals);
      }
    } catch (err) {
      console.error("Drag & drop update failed:", err);
    }
  };

  // -----------------------------
  // Loading state
  // -----------------------------
  if (loading) return <p className={styles.loading}>Loading meal plans...</p>;

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.mealPlansPage}>
        {/* Sidebar */}
        <aside className={styles.sidebarColumn}>
          <RecipeSidebar />
        </aside>

        {/* Main content */}
        <main className={styles.editorColumn}>
          {noPlanExists ? (
            <div className={styles.noPlan}>
              <h2>No meal plan yet</h2>
              <p>Select a start and end date to create a meal plan.</p>

              <label>
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </label>

              <label>
                End Date:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split("T")[0]}
                />
              </label>

              {error && <p className={styles.error}>{error}</p>}

              <button
                onClick={handleCreateMealPlan}
                disabled={loading || !startDate || !endDate}
                className={styles.createButton}
              >
                {loading ? "Creating..." : "Create Meal Plan"}
              </button>
            </div>
          ) : (
            <>
              {/* Active plan header with date range */}
              <div className={styles.planHeader}>
                <h2>Active Meal Plan</h2>
                <p>
                  From <strong>{activePlan.startDate}</strong> to{" "}
                  <strong>{activePlan.endDate}</strong>
                </p>
              </div>

              {/* Meal plan editor */}
              <MealPlanEditor plan={activePlan} />
            </>
          )}
        </main>
      </div>
    </DragDropContext>
  );
}
