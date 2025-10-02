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
import { MealType, Recipe } from "@/types";

/**
 * Dashboard
 * - Main user dashboard
 * - Shows today's meals and shopping list
 * - Fully responsive
 */
export default function Dashboard() {
  const { user } = useAuth();
  const { activePlan, loading, removeMealFromPlan } = useMealPlans();
  const { recipes } = useRecipes();
  const { list } = useShoppingList();
  const router = useRouter();

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
    if (recipe) {
      setSelectedRecipe(recipe); // Open modal with full recipe
    }
  };

  const handleCloseModal = () => setSelectedRecipe(null);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.welcomeMessage}>
        Welcome{user?.email ? `, ${user.email}` : ""}!
      </h1>

      <div className={styles.mainColumns}>
        {/* Left column: Meal Plan */}
        <div className={styles.leftColumn}>
          {hasPlan ? (
            <>
              <div className={styles.panelHeader}>
                <h2>Your Meal Plan</h2>
                <p>
                  {activePlan.startDate && activePlan.endDate
                    ? `${new Date(
                        activePlan.startDate
                      ).toDateString()} → ${new Date(
                        activePlan.endDate
                      ).toDateString()}`
                    : "Start → End"}
                </p>
              </div>

              <TodayMealPlanCard
                plan={activePlan}
                date={today}
                onRemoveMeal={handleRemoveMeal}
                onOpenMeal={handleOpenMeal} // pass handler
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
