// src/components/DashboardSummary.tsx
"use client";

import React from "react";
import styles from "./DashboardSummary.module.css";

interface Meal {
  mealType: string; // Breakfast, Lunch, Dinner
  recipeName: string;
}

interface DashboardSummaryProps {
  todayMeals: Meal[];
  pendingGroceries: number;
  nutritionSummary: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function DashboardSummary({
  todayMeals,
  pendingGroceries,
  nutritionSummary,
}: DashboardSummaryProps) {
  return (
    <div className={styles.summaryContainer}>
      {/* Today's Meals */}
      <div className={styles.card}>
        <h3>Today's Meals</h3>
        {todayMeals.length === 0 ? (
          <p>No meals planned for today</p>
        ) : (
          <ul>
            {todayMeals.map((meal, index) => (
              <li key={index}>
                <strong>{meal.mealType}:</strong> {meal.recipeName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pending Groceries */}
      <div className={styles.card}>
        <h3>Pending Groceries</h3>
        <p>{pendingGroceries} items need to be purchased</p>
      </div>

      {/* Nutrition Summary */}
      <div className={styles.card}>
        <h3>Nutrition Summary</h3>
        <p>Calories: {nutritionSummary.calories}</p>
        <p>Protein: {nutritionSummary.protein}g</p>
        <p>Carbs: {nutritionSummary.carbs}g</p>
        <p>Fat: {nutritionSummary.fat}g</p>
      </div>
    </div>
  );
}
