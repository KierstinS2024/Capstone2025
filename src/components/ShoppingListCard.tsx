// src/components/ShoppingListCard.tsx
import React, { useEffect, useState } from "react";
import { useShoppingList } from "@/context/ShoppingListContext";

export const ShoppingListCard: React.FC = () => {
  const { shoppingLists } = useShoppingList();
  const activeList = shoppingLists[0];
  const [highlight, setHighlight] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (activeList) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [activeList]);

  if (!activeList) {
    return (
      <div className="p-4 border rounded-2xl bg-white shadow-sm">
        No shopping list found.
      </div>
    );
  }

  return (
    <div
      className={`p-4 border rounded-2xl shadow-sm transition ${
        highlight ? "bg-yellow-50" : "bg-white"
      }`}
    >
      <h2 className="text-lg font-semibold mb-3">{activeList.title}</h2>
      <ul className="text-sm text-gray-700">
        {activeList.items.slice(0, 3).map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <input type="checkbox" checked={item.checked} readOnly />
            {item.ingredient} – {item.quantity}
          </li>
        ))}
      </ul>
      {activeList.items.length > 3 && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-3 text-blue-600 text-sm"
        >
          View full list →
        </button>
      )}

      {expanded && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">{activeList.title}</h2>
            <ul className="space-y-2">
              {activeList.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <input type="checkbox" checked={item.checked} readOnly />
                  {item.ingredient} – {item.quantity} ({item.category})
                </li>
              ))}
            </ul>
            <button
              onClick={() => setExpanded(false)}
              className="mt-4 bg-gray-200 px-3 py-1 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
