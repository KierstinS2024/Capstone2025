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
    <div className="meal-plan-card">
      <h3>Week of: {weekStartDate}</h3>
      {notes && <p>{notes}</p>}
      {entriesCount !== undefined && <p>Entries: {entriesCount}</p>}
      {/* Later: Add buttons to edit/delete/view details */}
    </div>
  );
}
