// src/components/MealPlanCard.tsx
import React from "react";
import Link from "next/link";

interface MealPlanCardProps {
  id: string;
  weekStartDate: string;
  notes?: string;
  entriesCount?: number;
}

export default function MealPlanCard({ id, weekStartDate, notes, entriesCount }: MealPlanCardProps) {
  return (
    <div className="meal-plan-card border rounded p-4 shadow mb-3 hover:shadow-lg transition">
      <h3 className="font-semibold text-lg">
        Week of: {new Date(weekStartDate).toLocaleDateString()}
      </h3>

      {notes && <p className="text-gray-600 mt-1">{notes}</p>}

      {entriesCount !== undefined && (
        <p className="text-sm text-gray-500 mt-2">Entries: {entriesCount}</p>
      )}

      {/* Example view button */}
      <div className="mt-3">
        <Link
          href={`/meal-plans/${id}`}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
        >
          View
        </Link>
      </div>
    </div>
  );
}
