// src/components/ShoppingListComponent.tsx
"use client";

import { IShoppingList } from "@/types/shoppingList";

// Component for rendering shopping list items
export default function ShoppingListComponent({
  list,
}: {
  list: IShoppingList;
}) {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <h3 className="font-semibold text-lg">Shopping List</h3>
      <ul className="mt-2 space-y-1">
        {list.items.map((item, i) => (
          <li key={i} className="flex justify-between items-center">
            <span>{item.name}</span>
            <span className="text-gray-500 text-sm">{item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
