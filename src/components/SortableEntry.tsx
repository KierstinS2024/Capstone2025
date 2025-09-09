// path: src/components/SortableEntry.tsx
/**
 * SortableEntry component
 * A single meal plan entry that can be dragged between DayColumns
 */

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MealPlanEntryWithId } from "./MealPlanKanban";

interface SortableEntryProps {
  entry: MealPlanEntryWithId;
}

export default function SortableEntry({ entry }: SortableEntryProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: entry._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "0.5rem",
    marginBottom: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <strong>{entry.recipeName || "Recipe"}</strong> — {entry.mealType} (
      {entry.servings} servings)
    </div>
  );
}
