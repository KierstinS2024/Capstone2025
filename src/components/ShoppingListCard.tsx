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
    <div className="shopping-list-card border rounded-md p-4 shadow-sm mb-4 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold mb-1">
        Created: {new Date(createdAt).toLocaleDateString()}
      </h3>

      {itemsCount !== undefined && <p className="text-sm">Total items: {itemsCount}</p>}
      {purchasedCount !== undefined && <p className="text-sm">Purchased: {purchasedCount}</p>}

      {/* TODO: Add buttons for view, edit, or delete this list */}
    </div>
  );
}
