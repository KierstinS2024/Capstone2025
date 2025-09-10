// src/components/MealPlanCard.tsx
import React, { useState } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import type { MealPlan, MealPlanEntry } from "@/types/mealPlan";
import { MealPlanForm } from "./MealPlanForm";

interface MealPlanCardProps {
  mealPlan?: MealPlan;
}

export const MealPlanCard: React.FC<MealPlanCardProps> = ({ mealPlan }) => {
  const { currentMealPlan } = useMealPlan();
  const [editing, setEditing] = useState(false);

  const activePlan = mealPlan || currentMealPlan;

  if (!activePlan) {
    return (
      <div
        style={{
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fefefe",
        }}
      >
        No active meal plan. Create one to get started!
      </div>
    );
  }

  const { title, startDate, endDate, entries } = activePlan;

  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
      }}
    >
      <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>{title}</h2>
      <p style={{ fontSize: "14px", color: "#555", marginBottom: "12px" }}>
        {new Date(startDate).toLocaleDateString()} -{" "}
        {new Date(endDate).toLocaleDateString()}
      </p>

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {entries.map((entry: MealPlanEntry, idx) => (
          <li
            key={entry.date + entry.mealType + idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "6px",
              padding: "4px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <span style={{ fontWeight: 500 }}>{entry.mealType}</span>
            <span style={{ color: "#666" }}>Recipe ID: {entry.recipeId}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setEditing(true)}
        style={{
          marginTop: "12px",
          padding: "6px 12px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Edit Plan
      </button>

      {editing && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <MealPlanForm
            existingPlan={activePlan}
            onClose={() => setEditing(false)}
          />
        </div>
      )}
    </div>
  );
};
