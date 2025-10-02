// ===========================================
// PATH: src/app/meal-plans/page.tsx
// MealPlans page: shows create form or editor
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
  const { activePlan, loading, addMealToPlan, moveMeal } = useMealPlans();

  // Guard for valid meal types
  const isMealType = (value: string): value is MealType =>
    ["breakfast", "lunch", "dinner"].includes(value);

  // Handle drag-and-drop logic
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const [sourceDay, sourceMealTypeStr] = source.droppableId.split("_");
    const [destDay, destMealTypeStr] = destination.droppableId.split("_");

    if (!isMealType(destMealTypeStr)) return;

    // --- Decode recipeId ---
    // Draggable IDs in editor look like: `${recipeId}_${date}_${mealType}`
    // From sidebar they are just the recipeId
    const recipeId = draggableId.split("_")[0];

    // Dragging from sidebar -> add new meal
    if (source.droppableId === "recipes") {
      await addMealToPlan(destDay, destMealTypeStr, recipeId);
      return;
    }

    // Move within plan
    if (!isMealType(sourceMealTypeStr)) return;
    await moveMeal(sourceDay, sourceMealTypeStr, destDay, destMealTypeStr);
  };

  // Show loading while fetching
  if (loading) return <p className={styles.loading}>Loading...</p>;

  // Show create form if no plan exists
  if (!activePlan) return <CreateMealPlanForm />;

  // Render editor + sidebar
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.grid}>
        <div className={styles.editorWrapper}>
          <MealPlanEditor plan={activePlan} />
        </div>
        <div className={styles.sidebarWrapper}>
          <RecipeSidebar />
        </div>
      </div>
    </DragDropContext>
  );
}
