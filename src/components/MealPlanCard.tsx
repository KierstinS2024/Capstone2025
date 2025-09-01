// src/components/MealPlanCard.tsx

import React from "react";

interface MealPlanCardProps {
  id: string;
  weekStartDate: string;
  notes?: string;
  entriesCount?: number;
}

export default function MealPlanCard({ id, weekStartDate, notes, entriesCount }: MealPlanCardProps) {
  return (
    <div className="meal-plan-card border rounded p-3 shadow mb-3">
      {/* Display the start date of the week */}
      <h3>Week of: {weekStartDate}</h3>

      {/* Show any notes if available */}
      {notes && <p>{notes}</p>}

      {/* Show how many entries are in this plan */}
      {entriesCount !== undefined && <p>Entries: {entriesCount}</p>}

      {/* TODO: Add buttons for edit, delete, or view details */}
    </div>
  );
}
