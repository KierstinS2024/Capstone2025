// src/app/shopping-list/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useShoppingList } from "@/context/ShoppingListContext";
import { AddShoppingListForm } from "@/components/AddShoppingListForm";
import {
  ShoppingListItem,
  ShoppingList as ShoppingListType,
} from "@/types/shoppingList";

/**
 * Shopping List Detail Page
 * Displays all items in a single shopping list and allows:
 * - Adding new items
 * - Removing items
 * - Toggling purchased state
 */
export default function ShoppingListDetailPage() {
  // Get shopping list ID from URL
  const { id: shoppingListId } = useParams();

  // Access shopping list state and functions from context
  const { shoppingLists, fetchShoppingLists, addItem, removeItem, toggleItem } =
    useShoppingList();

  // Local state for current shopping list
  const [shoppingList, setShoppingList] = useState<
    ShoppingListType | undefined
  >(shoppingLists.find((sl) => sl._id === shoppingListId));
  const [loading, setLoading] = useState(!shoppingList);

  // Fetch the shopping list if it's not already in context
  useEffect(() => {
    if (!shoppingList) {
      setLoading(true);
      fetchShoppingLists().finally(() => {
        setShoppingList(shoppingLists.find((sl) => sl._id === shoppingListId));
        setLoading(false);
      });
    }
  }, [shoppingList, shoppingListId, fetchShoppingLists, shoppingLists]);

  // Add a new item to the shopping list
  const handleAddItem = (item: ShoppingListItem) => {
    addItem(shoppingListId!, item);
    setShoppingList((prev) =>
      prev ? { ...prev, items: [...prev.items, item] } : prev
    );
  };

  // Remove an item from the shopping list
  const handleRemoveItem = (itemId: string) => {
    removeItem(shoppingListId!, itemId);
    setShoppingList((prev) =>
      prev
        ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) }
        : prev
    );
  };

  // Toggle the purchased state of an item
  const handleToggleItem = (itemId: string) => {
    toggleItem(shoppingListId!, itemId);
    setShoppingList((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((i) =>
              i.id === itemId ? { ...i, purchased: !i.purchased } : i
            ),
          }
        : prev
    );
  };

  // Show loading state
  if (loading) return <p>Loading shopping list...</p>;

  // Handle case where shopping list is not found
  if (!shoppingList) return <p>Shopping list not found.</p>;

  return (
    <div style={{ padding: "24px", maxWidth: "700px", margin: "0 auto" }}>
      {/* Shopping list title */}
      <h1 style={{ marginBottom: "16px" }}>{shoppingList.name}</h1>

      {/* Form to add new items */}
      <AddShoppingListForm onAdd={handleAddItem} />

      {/* Render list of items */}
      {shoppingList.items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {shoppingList.items.map((item) => (
            <li key={item.id} style={{ marginBottom: "8px" }}>
              <label
                style={{
                  textDecoration: item.purchased ? "line-through" : "none",
                }}
              >
                {/* Checkbox to toggle purchased state */}
                <input
                  type="checkbox"
                  checked={item.purchased}
                  onChange={() => handleToggleItem(item.id)}
                  style={{ marginRight: "8px" }}
                />
                {item.name}
              </label>

              {/* Button to remove item */}
              <button
                onClick={() => handleRemoveItem(item.id)}
                style={{ marginLeft: "12px" }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
