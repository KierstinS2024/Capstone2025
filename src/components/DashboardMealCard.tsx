// ===========================================
// PATH: src/components/DashboardMealCard.tsx
// ===========================================
// - Single meal slot card for dashboard (Breakfast/Lunch/Dinner)
// - If recipe exists: shows background image + recipe title
// - If empty: shows "+ Add Meal"
// - Click behavior:
//     - Recipe exists → go to recipe detail
//     - Empty → call onEdit to go to meal plan editor
// ===========================================

"use client";

import React from "react";
import { Recipe } from "@/types/recipe";
import { useRouter } from "next/navigation";
import styles from "@/styles/dashboard.module.css";

interface DashboardMealCardProps {
  mealType: string;
  recipe?: Recipe;
  onEdit: () => void;
}

export default function DashboardMealCard({
  mealType,
  recipe,
  onEdit,
}: DashboardMealCardProps) {
  const router = useRouter();

  // Click handler for card
  const handleClick = () => {
    if (recipe) router.push(`/recipes/${recipe.id}`);
    else onEdit();
  };

  return (
    <div
      className={styles.dashboardMealCard}
      onClick={handleClick}
      style={{
        backgroundImage: recipe ? `url(${recipe.image})` : undefined,
      }}
    >
      <div className={styles.dashboardMealOverlay}>
        {/* Meal label */}
        <p className={styles.mealTypeLabel}>
          {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
        </p>

        {/* Recipe title or Add Meal prompt */}
        {recipe ? (
          <h4 className={styles.recipeTitle}>{recipe.title}</h4>
        ) : (
          <p className={styles.addMealPrompt}>+ Add Meal</p>
        )}
      </div>
    </div>
  );
}
