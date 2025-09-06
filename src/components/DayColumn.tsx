// path: src/components/DayColumn.tsx
/**
 * DayColumn component
 * Represents a single day in the Kanban view
 * Contains sortable entries
 */

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import SortableEntry from "./SortableEntry";
import { MealPlanEntryWithId } from "./MealPlanKanban";

interface DayColumnProps {
  day: string;
  entries: MealPlanEntryWithId[];
}

export default function DayColumn({ day, entries }: DayColumnProps) {
  const { setNodeRef } = useDroppable({
    id: day,
  });

  return (
    <div
      style={{
        minWidth: 250,
        margin: "0 1rem",
        backgroundColor: "#f4f4f4",
        padding: "1rem",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ textAlign: "center" }}>{day}</h3>

      {/* Droppable container for this day */}
      <div ref={setNodeRef} style={{ minHeight: "100px" }}>
        {entries.map((entry) => (
          <SortableEntry key={entry._id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
