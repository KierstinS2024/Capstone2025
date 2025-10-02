"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMealPlans } from "@/context/MealPlanContext";
import { useRecipes } from "@/context/RecipeContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useRouter } from "next/navigation";
import TodayMealPlanCard from "./TodayMealPlanCard";
import ShoppingListPanel from "./ShoppingListPanel";
import RecipeModal from "./RecipeModal";
import styles from "@/styles/dashboard.module.css";
import { MealPlan, MealType, Recipe } from "@/types";

/**
 * Dashboard
 * - Main user dashboard
 * - Shows today's meals and shopping list
 * - Fully responsive
 */
export default function Dashboard() {
  const { user } = useAuth(); // Authenticated user
  const { activePlan, loading, removeMealFromPlan } = useMealPlans(); // Meal plan context
  const { recipes } = useRecipes(); // All recipes context
  const { list } = useShoppingList(); // Shopping list context
  const router = useRouter();

  // State to control the recipe modal
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  if (loading || !recipes) {
    return <p className={styles.loading}>Loading dashboard...</p>;
  }

  const hasPlan = !!activePlan;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleRemoveMeal = async (mealType: MealType) => {
    if (!activePlan) return;
    await removeMealFromPlan(today, mealType);
  };

  const handleOpenMeal = (recipe: Recipe) => {
    setSelectedRecipe(recipe); // Open modal
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className={styles.dashboardContainer}>
      {/* Welcome message */}
      <h1 className={styles.welcomeMessage}>
        Welcome{user?.email ? `, ${user.email}` : ""}!
      </h1>

      <div className={styles.mainColumns}>
        {/* Left column: Meal Plan */}
        <div className={styles.leftColumn}>
          {hasPlan ? (
            <>
              {/* Panel header showing plan dates */}
              <div className={styles.panelHeader}>
                <h2>Your Meal Plan</h2>
                <p>
                  {activePlan.startDate || "Start"} →{" "}
                  {activePlan.endDate || "End"}
                </p>
              </div>

              {/* Today's meals */}
              <TodayMealPlanCard
                plan={activePlan}
                date={today}
                onRemoveMeal={handleRemoveMeal}
                onOpenMeal={handleOpenMeal}
              />
            </>
          ) : (
            <div className={styles.panel}>
              <p>No meal plan yet. Create one to get started.</p>
              <button
                className={styles.btnPrimary}
                onClick={() => router.push("/meal-plans")}
              >
                Create Meal Plan
              </button>
            </div>
          )}
        </div>

        {/* Right column: Shopping List */}
        <div className={styles.rightColumn}>
          <ShoppingListPanel list={list} />
        </div>
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={handleCloseModal} />
      )}
    </div>
  );
}
