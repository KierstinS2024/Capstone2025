// path: src/app/dashboard/shopping-lists/[id]/page.tsx
"use client";

/**
 * ShoppingListPage
 * --------------------
 * Displays a single shopping list with full CRUD functionality:
 * - View items
 * - Mark items as purchased
 * - Edit quantity/unit
 * - Delete items
 * - Add new items
 *
 * Uses JWT authentication and calls your Shopping List API endpoints.
 */

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./ShoppingListPage.module.css";

// ------------------- Types -------------------
interface ShoppingListItem {
  _id: string;
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
  purchased: boolean;
}

interface ShoppingList {
  _id: string;
  title: string;
  items: ShoppingListItem[];
}

// ------------------- Component -------------------
export default function ShoppingListPage() {
  const router = useRouter();
  const params = useParams(); // { id: string }
  const listId = params?.id;

  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [newUnit, setNewUnit] = useState<string>("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ------------------- Fetch Shopping List -------------------
  useEffect(() => {
    if (!token || !listId) return;

    async function fetchShoppingList() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/shopping-lists/${listId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch shopping list");
        setShoppingList(data);
      } catch (err: any) {
        setError(err.message || "Error fetching shopping list");
      } finally {
        setLoading(false);
      }
    }

    fetchShoppingList();
  }, [listId, token]);

  // ------------------- Handlers -------------------
  const handleUpdateItem = async (
    itemId: string,
    updates: Partial<Pick<ShoppingListItem, "quantity" | "unit" | "purchased">>
  ) => {
    if (!token || !shoppingList) return;
    try {
      const res = await fetch(
        `/api/shopping-lists/${shoppingList._id}/items/${itemId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update item");

      setShoppingList((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map((item) =>
            item._id === itemId ? { ...item, ...updates } : item
          ),
        };
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update item");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!token || !shoppingList) return;
    try {
      const res = await fetch(
        `/api/shopping-lists/${shoppingList._id}/items/${itemId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete item");

      setShoppingList((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.filter((item) => item._id !== itemId),
        };
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete item");
    }
  };

  const handleAddItem = async () => {
    if (!token || !shoppingList || !newItemName) return;
    try {
      const res = await fetch(`/api/shopping-lists/${shoppingList._id}/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredientId: newItemName, // temp: use name as id if not using actual IDs
          name: newItemName,
          quantity: newQuantity,
          unit: newUnit,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add item");

      setShoppingList((prev) => {
        if (!prev) return prev;
        return { ...prev, items: [...prev.items, data.data] };
      });

      setNewItemName("");
      setNewQuantity(1);
      setNewUnit("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to add item");
    }
  };

  // ------------------- Render -------------------
  if (loading)
    return <p className={styles.message}>Loading shopping list...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!shoppingList)
    return <p className={styles.message}>No shopping list found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{shoppingList.title}</h1>

      <ul className={styles.list}>
        {shoppingList.items.map((item) => (
          <li key={item._id} className={styles.item}>
            <input
              type="checkbox"
              checked={item.purchased}
              onChange={(e) =>
                handleUpdateItem(item._id, { purchased: e.target.checked })
              }
            />
            <input type="text" value={item.name} disabled />
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleUpdateItem(item._id, { quantity: Number(e.target.value) })
              }
            />
            <input
              type="text"
              value={item.unit}
              onChange={(e) =>
                handleUpdateItem(item._id, { unit: e.target.value })
              }
            />
            <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <div className={styles.newItem}>
        <input
          type="text"
          placeholder="Ingredient Name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newQuantity}
          onChange={(e) => setNewQuantity(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Unit"
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value)}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
    </div>
  );
}
