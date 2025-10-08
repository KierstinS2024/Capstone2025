// ===========================================
// PATH: src/app/meal-plans/page.tsx
// MealPlans page: shows create form or editor with recipe sidebar
// ===========================================
"use client";

import React from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useMealPlans } from "@/context/MealPlanContext";
import CreateMealPlanForm from "@/components/CreateMealPlanForm";
import MealPlanEditor from "@/components/MealPlanEditor";
import RecipeSidebar from "@/components/RecipeSidebar";
import { MealType } from "@/types/mealPlan";
import styles from "@/styles/mealPlansPage.module.css";

export default function MealPlansPage() {
  const {
    activePlan,
    loading,
    addMealToPlan,
    deleteMealPlan,
    moveMeal,
    saving,
  } = useMealPlans();

  // ---------- Guard for valid meal types ----------
  const isMealType = (value: string): value is MealType =>
    ["breakfast", "lunch", "dinner"].includes(value);

  // ---------- Handle drag-and-drop ----------
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const [sourceDay, sourceMealTypeStr] = source.droppableId.split("_");
    const [destDay, destMealTypeStr] = destination.droppableId.split("_");

    if (!isMealType(destMealTypeStr)) return;

    // Decode recipeId
    const recipeId = draggableId.split("_")[0];

    // Dragging from sidebar -> add new meal
    if (source.droppableId === "recipes") {
      await addMealToPlan(destDay, destMealTypeStr, recipeId);
      return;
    }

    // Move meal within existing plan
    if (!isMealType(sourceMealTypeStr)) return;
    await moveMeal(sourceDay, sourceMealTypeStr, destDay, destMealTypeStr);
  };

  // ---------- Loading state ----------
  if (loading) return <p className={styles.loading}>Loading...</p>;

  // ---------- Show create form if no active plan ----------
  if (!activePlan) return <CreateMealPlanForm />;

  // ---------- Render editor + floating delete button + sidebar ----------
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.grid}>
        {/* ---------- Editor + Delete Button ---------- */}
        <div className={styles.editorWrapper}>
          {/* ---------- Floating Delete Meal Plan Button ---------- */}
          <button
            className={styles.deletePlanBtn}
            onClick={() => {
              if (
                activePlan &&
                confirm("Are you sure you want to delete this meal plan?")
              ) {
                deleteMealPlan(activePlan.id);
              }
            }}
            disabled={saving} // disables button while saving/deleting
          >
            {saving ? "Deleting..." : "Delete Plan"}
          </button>

          {/* ---------- Editor Container (holds MealPlanEditor) ---------- */}
          <div className={styles.editorContainer}>
            <MealPlanEditor plan={activePlan} />
          </div>
        </div>

        {/* ---------- Recipe Sidebar ---------- */}
        <div className={styles.sidebarWrapper}>
          <RecipeSidebar />
        </div>
      </div>
    </DragDropContext>
  );
}
