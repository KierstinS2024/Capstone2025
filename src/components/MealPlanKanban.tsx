// path: src/components/MealPlanKanban.tsx
/**
 * MealPlanKanban component
 * Displays a user's meal plan in a Kanban-style board
 * Allows drag-and-drop of entries between days
 */

import React from "react";
import { MealPlanEntry } from "@/models/MealPlan";
import SortableEntry from "./SortableEntry";
import DayColumn from "./DayColumn";

// Extend MealPlanEntry with _id for TypeScript
export interface MealPlanEntryWithId extends MealPlanEntry {
  _id: string;
  recipeName?: string;
}

interface MealPlanKanbanProps {
  entries: MealPlanEntryWithId[];
}

const daysOfWeek: string[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function MealPlanKanban({ entries }: MealPlanKanbanProps) {
  // Map entries by day
  const entriesByDay: Record<string, MealPlanEntryWithId[]> = {};
  daysOfWeek.forEach((day) => {
    entriesByDay[day] = [];
  });

  entries.forEach((entry) => {
    // Ensure _id exists
    const id = entry._id || new Date().toISOString();
    entriesByDay[entry.dayOfWeek]?.push({ ...entry, _id: id });
  });

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      {daysOfWeek.map((day) => (
        <DayColumn key={day} day={day}>
          {entriesByDay[day].map((entry) => (
            <SortableEntry key={entry._id} entry={entry} />
          ))}
        </DayColumn>
      ))}
    </div>
  );
}
