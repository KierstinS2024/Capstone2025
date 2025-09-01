// src/components/ShoppingListCard.tsx

import React from "react";

interface ShoppingListCardProps {
  id: string;
  createdAt: string;
  itemsCount?: number;
  purchasedCount?: number;
}

export default function ShoppingListCard({
  id,
  createdAt,
  itemsCount,
  purchasedCount,
}: ShoppingListCardProps) {
  return (
    <div className="shopping-list-card">
      <h3>Created: {new Date(createdAt).toLocaleDateString()}</h3>
      {itemsCount !== undefined && <p>Total items: {itemsCount}</p>}
      {purchasedCount !== undefined && <p>Purchased: {purchasedCount}</p>}
      {/* Later: add buttons to view, edit, or delete this list */}
    </div>
  );
}
