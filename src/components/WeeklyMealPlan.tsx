// path: src/components/WeeklyMealPlan.tsx
"use client";
import React from "react";
import { useMealPlan } from "@/context/MealPlanContext";

export default function WeeklyMealPlan() {
  const { week, loading, addMeal, removeMeal } = useMealPlan();

  if (loading) return <p>Loading meal plan...</p>;
  if (!week)
    return (
      <div className="card">
        <p>No plan yet. Add some meals.</p>
      </div>
    );

  const days = Object.keys(week.days || {});

  return (
    <div className="card">
      <h3>Weekly Meal Plan</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {days.map((day) => (
          <div
            key={day}
            style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}
          >
            <strong>{day}</strong>
            <ul>
              {(week.days[day] || []).map((m) => (
                <li
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                  }}
                >
                  <span>{m.name}</span>
                  <div>
                    <button
                      className="button-muted"
                      onClick={() => removeMeal(day, m.id)}
                      style={{ marginRight: 8 }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 6 }}>
              <button
                className="button"
                onClick={() =>
                  addMeal(day, { id: crypto.randomUUID(), name: "New Meal" })
                }
              >
                + Add Meal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
